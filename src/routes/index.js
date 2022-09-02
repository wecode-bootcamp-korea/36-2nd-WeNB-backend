const express = require("express");
const userRouter = require("./userRouter")
const router = express.Router();

const placeRouter = require('./placeRouter');
const imageUploaderRouter = require('./imageUploaderRouter');
router.use("/api", imageUploaderRouter.router)
router.use('/places', placeRouter.router)
router.use("/kakao", userRouter.router);

module.exports = router;