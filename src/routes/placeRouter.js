const express = require('express');
const placeController = require('../controllers/placeController');
const {imageUploader} = require("../middlewares/imageUploader");
const jwtValidation = require('../utils/jwt');

const router = express.Router();

router.get('/', placeController.getPlaces);
router.get('/:place_id(\\d+)', placeController.getPlaceByPlaceId);
router.post('/', jwtValidation.validation, placeController.postPlace);
router.post('/images', jwtValidation.validation, imageUploader.array('images'), placeController.postImages); 
router.post('/amenity_bunches', jwtValidation.validation, placeController.postAmenityBunches);
router.delete('/:place_id', jwtValidation.validation, placeController.deletePlaceWithPlaceId);
router.get('/reviews/:place_id', placeController.getReviewsByPlaceId);
router.post('/review', jwtValidation.validation, placeController.postReviews);
router.get('/amenities', placeController.getAmenities);
router.get('/search', placeController.searchWithPriceRangeAndAmenities);

module.exports = {
    router
}