// const { v4: uuidv4 } = require("uuid");
const { validationResult } = require('express-validator');
const User = require('../model/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../model/http-error');
// const DUMMY_USERS = [
//   {
//     id: 'u1',
//     name: 'Frankyn Ekoh',
//     email: 'Frank@d.com',
//     password: 'djdoi',
//   },
// ];
const getUsers = async (req, res, next) => {
  // res.json({ users: DUMMY_USERS });

  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password } = req.body;
  // const hasUser = DUMMY_USERS.find((p) => p.email === email);
  // if (hasUser) {
  //   return next(
  //     new HttpError("could not create user, email already exists", 422)
  //   );
  // }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Singning up failde try agian later', 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });
  // {
  //   id: uuidv4(),
  //   name, //name:name
  //   email,
  //   password,
  // };
  // DUMMY_USERS.push(createUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed', 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  // const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   return next(
  //     new HttpError(
  //       "Could not identify user, credentials seem to be wrong",
  //       401
  //     )
  //   );
  // }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
