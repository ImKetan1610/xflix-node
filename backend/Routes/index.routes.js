// const express = require("express");
// const router = express.Router();
// const {
//   getVideos,
//   getVideoById,
//   postNewVideo,
//   updateVote,
//   updateView,
// } = require("../controllers/index.controllers");

// const { verifyBody, verifyVideoId } = require("../middleware/validate");

// router.get("/:videoId", getVideoById);
// router.get("/", getVideos);
// router.post("/", verifyBody, postNewVideo);
// router.patch("/:videoId/votes", updateVote);
// router.patch("/:videoId/views", verifyVideoId, updateView);

// module.exports = router;

const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate")
const videoValidation = require('../validators/video.validator')
const videoController = require("../controllers/index.controllers");

router.get("/", videoController.getVideos);
router.get("/:videoId", validate(videoValidation.getVideoById), videoController.getVideoById); 
router.post("/", videoController.postVideo);
router.patch("/:videoId/votes", videoController.patchVotes);
router.patch("/:videoId/views", videoController.patchViews);

module.exports = router;
