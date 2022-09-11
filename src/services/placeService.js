const placeDao = require('../models/placeDao');

const getPlaces = async (limit, offset) => {

    const getPlaces = await placeDao.getPlaces(limit, offset);

    return getPlaces;
};

const getPlaceByPlaceId = async (place_id) => {
    const getPlaceByPlaceId = await placeDao.getPlaceByPlaceId(place_id);

    return getPlaceByPlaceId;
};



const postPlace = async (user_id, name, price, max_capacity, latitude, longitude, available_from, available_until, max_days) => {
    const hasUserId = await placeDao.hasUserId(user_id);
    if (hasUserId == 0) {
        const err = new Error("YOU_ARE_NOT_REGISTERED");
        err.statusCode = 404;
        throw err;
    }

    const getUserTypeId = await placeDao.getUserTypeId(user_id);

    if (getUserTypeId == 1) {
        const err = new Error("YOU_ARE_NOT_HOST");
        err.statusCode = 404;
        throw err;
    }

    const postPlace = await placeDao.postPlace(user_id, name, price, max_capacity, latitude, longitude, available_from, available_until, max_days);

    return postPlace;
};

const postImages = async (images, place_id) => {
    return await placeDao.postImages(images, place_id);
};

const postAmenityBunches = async (place_id, amenity_ids) => {
    const amenityDoesNotExist = amenity_ids.filter((e) => {
        return e > 18 
    });
    
    if (amenityDoesNotExist.length > 0) {
        const err = new Error("AMENITY_DOES_NOT_EXIST");
        err.statusCode = 404;
        throw err;
    }

    const place_ids = await placeDao.getPlaceIds();

    if (place_ids[place_ids.length-1] != place_id) {
        const err = new Error("WRONG_PLACE_CALLED");
        err.statusCode = 404;
        throw err;
    }

    const postAmenityBunches = await placeDao.postAmenityBunches(place_id, amenity_ids);

    return postAmenityBunches;
};


const deletePlaceWithPlaceId = async (place_id) => {
    const getPlaceIds = await placeDao.getPlaceIds();

    if (!getPlaceIds.includes(Number(place_id))) {
        const err = new Error("PLACE_DOES_NOT_EXIST");
        err.statusCode = 404;
        throw err;
    }

    const deletePlaceWithPlaceId = await placeDao.deletePlaceWithPlaceId(place_id);

    return deletePlaceWithPlaceId;
};

const getReviewsByPlaceId = async (place_id) => {
    const getReviewsByPlaceId = await placeDao.getReviewsByPlaceId(place_id);

    return getReviewsByPlaceId;
};

const postReviews = async (booking_id, place_id, rate, comment) => {
    const getBookingIds = await placeDao.getBookingIds();

    if (!getBookingIds.includes(booking_id)) {
        const err = new Error("DID_NOT_BOOK");
        err.statusCode = 404;
        throw err;
    }

    const postReviews = await placeDao.postReviews(booking_id, place_id, rate, comment);

    return postReviews;
};

const getAmenities = async () => {
    const getAmenities = placeDao.getAmenities();

    return getAmenities;
}

const searchWithPriceRangeAndAmenities = async (minimum_price, maximum_price, amenity_ids) => {
    const min_price = Number(minimum_price);
    const max_price = Number(maximum_price);

    if (min_price > max_price) {
        const err = new Error("WRONG_PRICE_RANGE");
        err.statusCode = 404;
        throw err;
    }

    const searchWithPriceRangeAndAmenities = placeDao.searchWithPriceRangeAndAmenities(min_price, max_price, amenity_ids);

    return searchWithPriceRangeAndAmenities;
};


module.exports = {
    getPlaces,
    getPlaceByPlaceId,
    postPlace,
    postImages,
    postAmenityBunches,
    deletePlaceWithPlaceId,
    getReviewsByPlaceId,
    postReviews,
    getAmenities,
    searchWithPriceRangeAndAmenities
}
