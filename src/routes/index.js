const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const placeRouter = require('./placeRouter');
const imageUploaderRouter = require('./imageUploaderRouter');

router.use("/api", imageUploaderRouter.router);
router.use('/places', placeRouter.router);
router.use("/kakao", userRouter.router);

const reservationRouter = require('./reservationRouter');
router.use("/place", reservationRouter.router)
const hostRouter = require("./hostRouter")
router.use('/host', hostRouter.router)

module.exports = router;
