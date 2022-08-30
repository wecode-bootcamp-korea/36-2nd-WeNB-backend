const express = require("express");
const router = express.Router();

const placeRouter = require('./placeRouter.js');

router.use('/places', placeRouter.router);

module.exports = router;