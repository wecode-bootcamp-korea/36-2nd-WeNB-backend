const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController")
const errorhandler = require("../middlewares/errorhandler")


router.post("/reservation", errorhandler(reservationController.getReservation))

module.exports = {
    router
}