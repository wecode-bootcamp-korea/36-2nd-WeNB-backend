const express = require("express");
const router = express.Router();
const jwt = require("../utils/jwt")
const errorHandler = require("../utils/errorHandler")
const hostController = require('../controllers/hostController')

router.patch("/register", jwt.validation, errorHandler.errorHandlerAsync(hostController.getPrivilegesOnTheHost))

module.exports = {
    router
}