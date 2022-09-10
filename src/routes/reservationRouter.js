const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController")
const errorHandler = require("../utils/errorHandler")
const jwt = require("../utils/jwt")


router.post("/reservation",jwt.validation ,errorHandler.errorHandlerAsync(reservationController.getReservation))

module.exports = {
    router
}
