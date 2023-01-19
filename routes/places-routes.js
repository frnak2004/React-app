/*const express = require('express');
const PlacesControllers = require('../controllers/places-controllers');
const router = express.Router();
const { check } = require('express-validator');

router.get('/:pid', PlacesControllers.getPlaceById);

router.get('/user/:uid', PlacesControllers.getUsersById);

router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').notEmpty(),
  ],
  PlacesControllers.createPlace
);

router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  PlacesControllers.updatePlace
);
router.delete('/:pid', PlacesControllers.deletePlace);

module.exports = router; //to esport module

/* one way of doing it router.get("/:pid", (req, res, next) => {
  //it handles any request that starts with api/places/ somenthing
  const placesId = req.params.pid; //paramas seachers for an object with a specific id and renders it
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placesId;
  });
  if (!place) {
    const error = new HttpError("Could not find a place the provided id");
    error.code = 404;
    return next(error);
  }
  res.json({ place });
});*/

const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);
router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
