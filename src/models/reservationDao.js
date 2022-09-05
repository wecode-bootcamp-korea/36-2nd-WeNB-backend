const { BaseError } = require("../utils/baseError");
const { appDataSource } = require("./datasource");
const BaseError = require('../utils/baseError')

const getReservation = async (userId, placeId, availableFrom, availableUntil, guestNumber, totalPrice) => {
    try {
        return await appDataSource.query(
            `
            INSERT INTO bookings(
                user_id,
                place_id,
                rent_from,
                rent_to,
                guest_number,
                total_price
            ) VALUES (?, ?, ?, ?, ? ,?)
            `,
            [userId, placeId, availableFrom, availableUntil, guestNumber, totalPrice]
        )
    } catch (err){
        throw new BaseError("put the value right", 500)
    }
}

const getMaxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil = async(placeId) => {
    try {
        return await appDataSource.query(
            `
            SELECT 
                max_capacity,
                max_days,
                price,
                available_from,
                available_until
            FROM places
            WHERE id=?
            `,
            [placeId]
        )
    } catch (err) {
        throw new BaseError("put the value right", 500)
    }
}
module.exports = {
    getReservation,
    getMaxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil,
}