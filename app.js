const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./model/http-error');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASSWORD}@cluster0.d7lgc6f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();
app.use(bodyParser.json()); // it will parse any data into json

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});
app.use('/api/places', placesRoutes);
// => /api/places/..
app.use('/api/users', usersRoutes);

// error handling middlewar function
app.use((req, res, next) => {
  return next(new HttpError('Could not find this route', 404));
});
app.use((error, req, res, next) => {
  console.log('ERROR RESPONSE:', error.message);
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});
mongoose.set('strictQuery', true);
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  err => {
    if (err) {
      console.log('connection failed');
      console.log(
        process.env.DB_PASSWORD,
        process.env.DB_USER,
        process.env.DB_NAME
      );
    } else {
      console.log('connected to database');
    }
  }
);
app.listen(5000, function () {
  console.log('server is running');
});
// mongoose.set("strictQuery", false);
// mongoose
//   .connect(uri)
//   .then(() => {
//     app.listen(5000, function () {
//       console.log("server is running");
//     });
//   })
//   .catch((err) => console.log("connection failed"));
