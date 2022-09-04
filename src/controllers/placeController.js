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

module.exports = {
    getPlaces,
    getPlaceByPlaceId
}