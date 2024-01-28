const express = require("express");
const router = express.Router();
const videoRoute = require("./index.routes");

router.use("/videos", videoRoute);

module.exports = router;
