const getReservationDao = require('../models/reservationDao');
const BaseError = require('../utils/baseError');

const getReservation = async(userId, placeId , availableFrom, availableUntil, guestNumber) => {
        const checkInReservation = new Date(availableFrom)
        const checkOutReservation = new Date(availableUntil)
        const bookingsDay = (checkOutReservation.getTime()-checkInReservation.getTime())/(1000*60*60*24);

        const maxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil = await getReservationDao.getMaxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil(placeId)
        const reservationSchedule = await getReservationDao.getScheduleReservation(placeId)

        const maxCapacity = Object.values(maxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil[0])[0]
        const maxDays = Object.values(maxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil[0])[1]
        const price = Object.values(maxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil[0])[2]
        const rentFrom = Object.values(maxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil[0])[3]
        const rentTo = Object.values(maxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil[0])[4]
        
        const totalPrice = bookingsDay*price;

        if (guestNumber > maxCapacity ){
            throw new BaseError("EXCEEDING_THE_NUMBER_OF_PEOPLE", 400)
        }
        if (bookingsDay === 0 ||
            bookingsDay > maxDays){
            throw new BaseError("RESERVATION_DAYS_ARE_NOT_CORRECT", 400)
            }
        if (rentFrom > checkInReservation ||
            rentTo < checkOutReservation
            ){
            throw new BaseError("RESERVATION_SCHEDULE_DOES_NOT_MATCH", 400)
        }
        
        return await getReservationDao.getReservation(userId, placeId, availableFrom, availableUntil, guestNumber, totalPrice);
}

module.exports = {
    getReservation
}