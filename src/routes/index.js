const express = require("express");
const router = express.Router();

const placeRouter = require('./placeRouter');
const imageUploaderRouter = require('./imageUploaderRouter');
router.use("/api", imageUploaderRouter.router)
router.use('/places', placeRouter.router)

module.exports = router;