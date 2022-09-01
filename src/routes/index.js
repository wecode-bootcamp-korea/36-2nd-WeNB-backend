const express = require("express");
const router = express.Router();

const imageUploaderRouter = require('./imageUploaderRouter');
router.use("/api", imageUploaderRouter.router)

module.exports = router;