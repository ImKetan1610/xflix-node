// const {
//   getAllVideos,
//   getVideosByFilter,
//   getVideosById,
//   createVideo,
//   updateVotes,
//   updateViews,
// } = require("../services/index.services");

// const httpStatus = require("http-status");

// const getVideos = async (req, res) => {
//   let { title, genre, contentRating, sortBy } = req.query;
//   console.log("title",req.query)
//   if (title || genre || contentRating || sortBy) {
//     const titleSearch = title ? title : "";
//     const genreSearch = genre ? genre : "All";
//     const contentRatingSearch = contentRating ? contentRating : ["All"];
//     const sortBySearch = sortBy ? sortBy : "releaseDate";

//     const result = await getVideosByFilter(
//       titleSearch,
//       genreSearch,
//       contentRatingSearch,
//       sortBySearch
//     );
//     return res.status(httpStatus.OK).json({ videos: result });
//   } else {
//     const videos = await getAllVideos();
//     return res.status(httpStatus.OK).json({ videos });
//   }
// };

// const getVideoById = async (req, res) => {
//   let { videoId } = req.params;

//   let video = await getVideosById(videoId);
//   if (!video) {
//     return res.status(httpStatus.NOT_FOUND).json({
//       code: 404,
//       message: "No video found for this ID",
//     });
//   } else {
//     return res.status(httpStatus.OK).json(video);
//   }
// };

// const postNewVideo = async (req, res) => {
//   try {
//     let newVideo = await createVideo(req.body);
//     return res.status(httpStatus.CREATED).json(newVideo);
//   } catch (error) {
//     return res
//       .status(httpStatus.BAD_REQUEST)
//       .json({ code: 400, message: error.message });
//   }
// };

// const updateVote = async (req, res) => {
//   let { videoId } = req.params;
//   try {
//     const updateVote = await updateVotes(videoId, req.body);
//     return res.status(204).end();
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ code: 400, message: "No video found with this ID" });
//   }
// };

// const updateView = async (req, res) => {
//   let { videoId } = req.params;
//   try {
//     const updateView = await updateViews(videoId);
//     return res.status(204).end();
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ code: 400, message: "No video found with this ID" });
//   }
// };

// module.exports = {
//   getVideos,
//   getVideoById,
//   postNewVideo,
//   updateVote,
//   updateView,
// };

const catchAsync = require("../utils/CatchAsync");
const videoServices = require("../services/index.services");

const getVideos = catchAsync(async (req, res) => {
  try {
    const { query } = req;
    // console.log("index.controller.getVideos", req);
    const videos = await videoServices.getVideos(query);
    res.status(200).send({ videos });
  } catch (error) {
    const { statusCode, message } = error;
    if (!statusCode) {
      return res.status(500).send({ message: "Internal server Error" });
    }
    res.status(statusCode).send({ statusCode, message });
  }
});

const getVideoById = catchAsync(async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await videoServices.getVideoById(videoId);
    res.status(200).send(video);
  } catch (error) {
    const { statusCode, message } = error;
    if (!statusCode) {
      return res.status(500).send({ message: "Internal server Error" });
    }
    res.status(statusCode).send({ statusCode, message });
  }
});

const postVideo = catchAsync(async (req, res) => {
  console.log("post.controller", req.body);
  // try {
    const { body } = req;
    const video = await videoServices.postVideo(body);
    console.log(video)
    res.status(201).send(video);
  // } catch (error) {
  //   // const { statusCode, message } = error;
  //   // if (!statusCode) {
  //   //   return res.status(505).send({ message: "Internal server Error" });
  //   // }
  //   res.status(200).send("Error bro");
  // }
});

const patchVotes = catchAsync(async (req, res) => {
  try {
    const {videoId} = req.params;
    const {vote,change} = req.body;
    await videoServices.patchVotes(videoId, vote, change)
    res.sendStatus(204)
  } catch (error) {
    const  { statusCode, message }= error
    if(!statusCode){
      return res.status(500).send({message: "Internal server Error"})
    }
    res.status(statusCode).send({statusCode,message})
  }
});

const patchViews = catchAsync(async (req,res) => {
  try {
    const {videoId} = req.params;
    await videoServices.patchViews(videoId)
    res.sendStatus(204)
  } catch (error) {
    const {statusCode, message} = error
    if(!statusCode) {
      return res.status(500).send("Internal server Error")
    }
    res.status(statusCode).send({statusCode, message})
  }
})

module.exports = { getVideos, postVideo, getVideoById, patchVotes, patchViews };
