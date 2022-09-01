const placeService = require('../services/placeService');

const getPlaces = async (req, res) => {
    try {
        const limit = req.query.limit;
        const offset = req.query.offset;

        if (!offset) {
            return res.status(400).json({message: 'KEY_ERROR'});
        }

        const getPlaces = await placeService.getPlaces(limit, offset);

        return res.status(200).json(getPlaces);
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        res.status(err.statusCode).json({ message: err.message });
    }
};

module.exports = {
    getPlaces
}