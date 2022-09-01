const getReservationService = require("../services/reservationService")
const {BaseError} = require('../utils/baseError')

const getReservation = async (req, res) => {
    const {userId, placeId, availableFrom, availableUntil ,guestNumber} = req.body;
    
    if(!userId || !placeId || !guestNumber || !availableFrom || !availableUntil){
        throw new BaseError("KEY_ERROR", 400, "KEY_ERROR")
}   
    await getReservationService.getReservation(userId, placeId, availableFrom, availableUntil, guestNumber);
    res.status(201).json({message: "SUCCESS_RESERVATION"})
}

module.exports = { 
    getReservation
}