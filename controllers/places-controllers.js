const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
/*
const User = require('../model/users');
// const logo = require('../OIP (5).jpg')
const { validationResult } = require('express-validator');
const HttpError = require('../model/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../model/place');
const mongoose = require('mongoose');
// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     tiltle: "franklyn",
//     description: "one to 10",
//     location: {
//       lat: 9384948,
//       lng: 3234455,
//     },
//     address: "3drikfdf",
//     creator: "u1",
//   },
// ];

const getPlacesById = async (req, res, next) => {
  //it handles any request that starts with api/places/ somenthing
  const placeId = req.params.pid;
  //paramas seachers for an object with a specific id and renders it
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('could not find a place', 500);
    return next(error);
  }
  //DUMMY_PLACES.filter((p) => {
  //   return p.id === placeId;
  // });
  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};
const getUsersById = async (req, res, next) => {
  //it handles any request that starts with api/places/user/ somenthing
  const userId = req.params.uid;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later',
      500
    );
    return next(error);
  }
  //DUMMY_PLACES.find((p) => p.creator === userId);
  //  if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id', 404)
    );
  }
  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    ),
  });
};
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  //without mongodb
  // const createPlace = {
  //   id: uuidv4(),
  //   title: title,
  //   description,
  //   location: coordinates,
  //   address,
  //   creator,
  // };

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place failed', 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      'Could not find user for the provided user id',
      404
    );
    return next(error);
  }
  console.log(user);
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    // await createdPlace.save();
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating place failed', 500);
    return next(error);
  }

  // before MONGODB DUMMY_PLACES.push(createPlace); // to push it inside the DUMM_PLACES ARRAY
  res.status(201).json({ place: createdPlace });
};
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid data, please check data', 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Updating place failed', 500);
    return next(error);
  }
  // const updatePlace = { ...DUMMY_PLACES.find((p) => p.id === placesId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placesId);
  place.title = title;
  place.description = description;
  // DUMMY_PLACES[placeIndex] = updatePlace;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Somenthign went wrong', 500);
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};
const deletePlace = async (req, res, next) => {
  const placesId = req.params.pid;
  // if (!DUMMY_PLACES.find((p) => p.id === placesId)) {
  //   return next(new HttpError("could not find a place for that id", 404));
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placesId);
  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError('Somenthign went wrong', 500);
    return next(error);
  }
  if (!place) {
    const error = new HttpError('Could not find place', 404);
    return next(error);
  }
  try {
    // await place.remove();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Somenthign went wrong', 500);
    return next(error);
  }
  res.status(200).json({ message: 'place deleted' });
};

//to export multiple things we use
exports.getPlacesById = getPlacesById;
exports.getUsersById = getUsersById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
*/

// const uuid = require('uuid/v4');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../model/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../model/place');
const User = require('../model/users');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  //to clean up places
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later',
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place.', 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this place.',
      401
    );
    return next(error);
  }
  const imagePath = place.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;