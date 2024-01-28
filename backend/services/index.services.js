// const { videos } = require("../models/videos.model");

// const httpStatus = require("http-status");

// const getAllVideos = async () => {
//   let result = await videos.find({});
//   return result;
// };

// const getVideosByFilter = async (title, genre, contentRating, sortBy) => {
//   const titleMatch = { title: { $regex: title, $options: "i" } };
//   console.log("titleMatch", titleMatch);

//   if (title === 'video18') {
//     // Filter and return videos with the top title
//     // const topVideos = await videos.filter(video => video.title === 'Video 1');
//     const topVideos = await videos.find({title})
//     console.log("topVideos",topVideos)
//     return topVideos;
//   }

//   let contentRatingArr = getPossibleContentRating(contentRating);
//   const contentRatingM = { contentRating: { $in: contentRatingArr } };

//   let genreMatchArr = genreMatch(genre);
//   const genreM = { genre: { $in: genreMatchArr } };

//   console.log(contentRating, genreMatchArr)

//   const getVideosFromDB = await videos.find({
//     ...titleMatch,
//     ...contentRatingM,
//     ...genreM,
//   });
//   console.log("videosFromDb", getVideosFromDB);

//   const result = sortVideosByFilter(getVideosFromDB, sortBy);
//   console.log("result", result);

//   return result;
// };

// const getPossibleContentRating = (contentRating) => {
//   if (contentRating[0] === "All") {
//     return ["Anyone", "7+", "12+", "16+", "18+"];
//   } else {
//     return [contentRating];
//   }
// };

// const genreMatch = (genre) => {
//   if (genre[0] === "All") {
//     return ["Education", "Sports", "Movies", "Comedy", "Lifestyle"];
//   } else {
//     return genre.split(",");
//   }
// };

// const sortVideosByFilter = (videos, sortBy) => {
//   if (videos.length !== 0 && sortBy == "releaseDate") {
//     let result = videos.sort((a, b) => {
//       return new Date(b.releaseDate) - new Date(a.releaseDate);
//     });
//     return result;
//   } else if (videos.length !== 0) {
//     let result = videos.sort((a, b) => {
//       return b.viewCount - a.viewCount;
//     });
//     return result;
//   } else {
//     return videos;
//   }
// };

// const getVideosById = async (id) => {
//   console.log("id", id);
//   const video = await videos.findOne({ _id: id });
//   return video;
// };

// const createVideo = async (details) => {
//   const newVideo = new videos(details);
//   const result = await newVideo.save();
//   return result;
// };

// const updateVotes = async (videoId, body) => {
//   let video = await videos.findOne({ _id: videoId });

//   if (body.vote == "upVote") {
//     if (body.change == "increase") {
//       video.votes.upVotes += 1;
//     } else if (body.change == "decrease") {
//       video.votes.upVotes -= 1;
//     }
//   } else if (body.vote == "downVote") {
//     if (body.change == "increase") {
//       video.votes.downVotes += 1;
//     } else if (body.change == "decrease") {
//       video.votes.downVotes -= 1;
//     }
//   }

//   const result = await video.save();
//   return result;
// };

// const updateViews = async (videoId) => {
//   let video = await videos.findOne({ _id: videoId });
//   video.viewCount += 1;
//   const result = await video.save();
//   return result;
// };

// module.exports = {
//   getAllVideos,
//   getVideosByFilter,
//   getVideosById,
//   createVideo,
//   updateVotes,
//   updateViews,
// };

const Video = require("../models/videos.model");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const getVideos = async (queryObject) => {
  let videoCollection = await Video.find({});
  // console.log("videoCollection", videoCollection)

  const queryKeyArray = Object.keys(queryObject);
  // console.log("1",queryObject.hasOwnProperty("title"))

  if (queryKeyArray.length == 0) {
    return videoCollection;
  }

  if (queryObject.hasOwnProperty("title")) {
    console.log("title",queryObject.title)
    videoCollection = videoCollection.filter((video) => {
      return video.title.match(new RegExp(queryObject.title, "gi"));
      // video.title == queryObject.title
    });
    console.log("videoCollection", videoCollection)
  }

  if (queryObject.hasOwnProperty("genres")) {
    const genresArray = queryObject.genres.split(",");
    if (genresArray.includes("All")) {
    } else {
      let filteredByGenres = [];
      genresArray.forEach((genre) => {
        filteredByGenres = [
          ...filteredByGenres,
          ...videoCollection.filter((video) => video.genre == genre),
        ];
      });
      videoCollection = [...filteredByGenres];
    }
  }

  

  if (queryObject.hasOwnProperty("contentRating")) {
    const contentRatingArr = queryObject.contentRating.split(",");
    let filteredByContentRating = [];
    contentRatingArr.forEach((contentRating) => {
      filteredByContentRating = [
        ...filteredByContentRating,
        ...videoCollection.filter(
          (video) => video.contentRating == contentRating
        ),
      ];
    });
    videoCollection = [...filteredByContentRating];
  }

  if (queryObject.hasOwnProperty("sortBy")) {
    if (queryObject.sortBy == "viewCount") {
      videoCollection.sort((a, b) => b.viewCount - a.viewCount);
    } else if (queryObject.sortBy == "releaseDate") {
      // videoCollection.sort((a, b) => b.releaseDate - a.releaseDate);
      
      videoCollection.sort((video1, video2) => {
        let field1 = video1[ queryObject.sortBy];
        let field2 = video2[queryObject.sortBy];
        if (queryObject.sortBy === "releaseDate") {
          field1 = new Date(field1).getTime();
          field2 = new Date(field2).getTime();
        }
        if (field1 > field2) {
          return -1;
        }
        return 1;
      });
    }
  }

  return videoCollection;
};


const sortVideos = (videos, sortBy) => {
  videos.sort((video1, video2) => {
    let field1 = video1[sortBy];
    let field2 = video2[sortBy];
    if (sortBy === "releaseDate") {
      field1 = new Date(field1).getTime();
      field2 = new Date(field2).getTime();
    }
    if (field1 > field2) {
      return -1;
    }
    return 1;
  });
  return videos;
};



const postVideo = async (body) => {

  const res = await Video.create(body);
  return res;


  // try {
    // const video = await Video.create(body).catch((e) => {
    //   if(e.code == 11000){
    //     throw Error(400, "Video Link already exists")
    //   }
    // })
    // return video;
    // const video = await Video.create(body).catch((e) => {
    //   if (e.code === 11000) {
    //     throw new Error(400, "Video Link already exists");
    //   }
    // });
    
    // // Query the created document with lean()
    // const createdVideo = await Video.findOne({ _id: video._id }).lean();
    
    // // Exclude _id and __v fields
    // if (createdVideo) {
    //   createdVideo._id = undefined;
    //   createdVideo.__v = undefined;
    // }
    
    // return createdVideo;
  // } catch (error) {
  //   if (error.code === 11000) {
  //     throw new ApiError(httpStatus.CONFLICT, "Enter a unique video URL");
  //   } else {
  //     throw new ApiError(
  //       httpStatus.INTERNAL_SERVER_ERROR,
  //       "Internal Server Error"
  //     );
  //   }
  // }
};

const getVideoById = async (videoId) => {
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video exists");
  }
  console.log(video);
  return video;
};

const patchVotes = async (id, vote, change) => {
  const video = await Video.findById(id);
  if (!video) throw new ApiError(httpStatus.NOT_FOUND, "No such video exists");
  if (change == "increase") {
    video.votes[vote + "s"] = video.votes[vote + "s"] + 1;
  } else if (change == "decrease"){
    if(video.votes[vote+"s"]===0){
      throw new ApiError(httpStatus.BAD_REQUEST, "Upvotes or Downvotes cannot be less than 0")
    }
    video.votes[vote + "s"] = video.votes[vote + "s"] - 1;
  }
  await video.save()
};

const patchViews = async(id) => {
  const video = await Video.findById(id)
  if(!video){
    throw new ApiError(httpStatus.NOT_FOUND, "No video exist with this id")
  }
  video.viewCount = video.viewCount+1
  await video.save()
}

module.exports = { getVideos, postVideo, getVideoById, patchVotes, patchViews };
