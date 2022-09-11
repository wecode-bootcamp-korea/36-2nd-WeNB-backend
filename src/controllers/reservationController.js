const getReservationService = require("../services/reservationService")
const {BaseError} = require('../utils/baseError')

const getReservation = async (req, res) => {
    const {user_id, placeId, availableFrom, availableUntil ,guestNumber} = req.body;
    
    if(!user_id || !placeId || !guestNumber || !availableFrom || !availableUntil){
        throw new BaseError("KEY_ERROR", 400, "KEY_ERROR")
}   
    await getReservationService.getReservation(user_id, placeId, availableFrom, availableUntil, guestNumber);
    res.status(201).json({message: "SUCCESS_RESERVATION"})
}

module.exports = { 
    getReservation
}
