const express = require("express");
const userController = require("../controllers/userController")
const router = express.Router();
const jwt = require("../utils/jwt");
const errorHandler = require("../utils/errorHandler");

router.get("/auth", errorHandler.errorHandlerAsync(userController.kakaoCode));
router.post("/logout", jwt.validation ,errorHandler.errorHandlerAsync(userController.logOut));

module.exports = {
    router
}