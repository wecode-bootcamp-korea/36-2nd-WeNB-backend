const express = require('express');
const placeController = require('../controllers/placeController');

const router = express.Router();

router.get('/', placeController.getPlaces);
router.get('/:place_id(\\d+)', placeController.getPlaceByPlaceId);

module.exports = {
    router
}