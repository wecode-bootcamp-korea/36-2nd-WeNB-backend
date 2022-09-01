const { appDataSource } = require("./datasource");


const getReservation = async (userId, placeId, availableFrom, availableUntil, guestNumber, totalPrice) => {
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
}

const getMaxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil = async(placeId) => {
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
}
module.exports = {
    getReservation,
    getMaxCapacityAndDaysAndPriceAvailableFromAndAvailableUntil,
}