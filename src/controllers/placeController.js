const placeService = require('../services/placeService');

const getPlaces = async (req, res) => {
    try {
        const limit = req.query.limit || 30;
        const offset = req.query.offset || 0;

        const getPlaces = await placeService.getPlaces(limit, offset);

        return res.status(200).json(getPlaces);
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        res.status(err.statusCode).json({ message: err.message });
    }
};

const getPlaceByPlaceId = async (req, res) => {
    try {
        const { place_id } = req.params;

        if (!place_id) {
            return res.status(400).json({message: 'KEY_ERROR'});
        }

        const getPlaceByPlaceId = await placeService.getPlaceByPlaceId(place_id);

        return res.status(200).json(getPlaceByPlaceId);
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        res.status(err.statusCode).json({ message: err.message });
    }
};


const postPlace = async (req, res) => {
    try {
        const { user_id, name, price, max_capacity, latitude, longitude, available_from, available_until, max_days } = req.body;
    
        if (!user_id || !name || !price || !max_capacity || !latitude || !longitude || !available_from || !available_until || !max_days) {
            return res.status(400).json({message: 'KEY_ERROR'});
        }
    
        const postPlace = await placeService.postPlace(user_id, name, price, max_capacity, latitude, longitude, available_from, available_until, max_days);
    
        return res.status(201).json({message: `place with ${postPlace} place_id = Created`, place_id: postPlace});
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        res.status(err.statusCode).json({ message: err.message });
    }
};



const postAmenityBunches = async(req, res) => {
    try {
        const { place_id, amenity_ids } = req.body;
    
        if (!place_id || !amenity_ids) {
            return res.status(400).json({ message: 'KEY_ERROR' });
        }
    
        await placeService.postAmenityBunches(place_id, amenity_ids);
    
        return res.status(201).json({message: 'amenitiesRegistered'});
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        res.status(err.statusCode).json({ message: err.message });
    }
};


module.exports = {
    getPlaces,
    getPlaceByPlaceId,
    postPlace,
    postAmenityBunches
}