const placeDao = require('../models/placeDao');

const getPlaces = async (limit, offset) => {
    const getPlaces = await placeDao.getPlaces(limit, offset);

    if (getPlaces.length == 0) {
        const err = new Error("NO_MORE_PLACES_TO_LOAD");
        err.statusCode = 404;
        throw err;
    };

    return getPlaces;
}

module.exports = {
    getPlaces
}