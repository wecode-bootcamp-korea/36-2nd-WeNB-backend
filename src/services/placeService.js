const placeDao = require('../models/placeDao');

const getPlaces = async (limit, offset) => {
    const getPlaces = await placeDao.getPlaces(limit, offset);

    return getPlaces;
};

const getPlaceByPlaceId = async (place_id) => {
    const getPlaceByPlaceId = await placeDao.getPlaceByPlaceId(place_id);

    return getPlaceByPlaceId;
};

module.exports = {
    getPlaces,
    getPlaceByPlaceId
}