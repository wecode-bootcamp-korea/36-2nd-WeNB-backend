const placeDao = require('../models/placeDao');

const getPlaces = async (limit, offset) => {
    const getPlaces = await placeDao.getPlaces(limit, offset);

    return getPlaces;
}

module.exports = {
    getPlaces
}