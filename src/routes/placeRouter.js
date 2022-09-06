const express = require('express');
const placeController = require('../controllers/placeController');
const {imageUploader} = require("../middlewares/imageUploader");
const jwtValidation = require('../utils/jwt');

const router = express.Router();

router.get('/', placeController.getPlaces);
router.get('/:place_id(\\d+)', placeController.getPlaceByPlaceId);
router.post('/', jwtValidation.validation, placeController.postPlace);

router.post('/amenity_bunches', jwtValidation.validation, placeController.postAmenityBunches);

module.exports = {
    router
}