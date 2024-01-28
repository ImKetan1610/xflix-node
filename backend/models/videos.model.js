// const mongoose = require("mongoose");

// const videoSchema = mongoose.Schema({
//   videoLink: {
//     type: String,
//     required: [true, "Youtube video link is required."],
//     unique: true,
//     trim: true,
//   },
//   title: {
//     type: String,
//     required: true, 
//   },
//   genre: {
//     type: String,
//     required: true,
//     enum: ["Education", "Sports", "Movies", "Comedy", "Lifestyle", "All"],
//   },
//   contentRating: {
//     type: String,
//     required: true,
//     enum: ["Anyone", "7+", "12+", "16+", "18+"],
//   },
//   releaseDate: {
//     type: String,
//     required: true,
//   },
//   previewImage: {
//     type: String,
//     required: true,
//   },
//   votes: {
//     upVotes: {
//       type: Number,
//       default: 0,
//     },
//     downVotes: {
//       type: Number,
//       default: 0,
//     },
//   },
//   viewCount: {
//     type: Number,
//     default: 0,
//   },
// });

// const videos = mongoose.model("videos", videoSchema);
// module.exports = { videos };

const mongoose = require("mongoose");

// const votesSchema = new mongoose.Schema(
//   {
//     upVotes: { type: Number, default: 0 },
//     downVotes: { type: Number, default: 0 },
//   },
//   {
//     _id: false,
//   }
// );

const videoSchema = new mongoose.Schema({
  videoLink: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    trim: true,
    default: "All",
  },
  contentRating: {
    type: String,
    trim: true,
    default: "Anyone",
    
  },
  releaseDate: {
    type: String,
    trim: true,
    required: true,
  },
  previewImage: {
    type: String,
    trim: true,
    // required: true,
  },
  votes: {
    upVotes: {
      type: Number,
      default: 0,
      required : true
    },
    downVotes: {
      type: Number,
      default: 0,
      required : true
    },
  },
  viewCount: {
    type: Number,
    default: 0,
  },
});

const Video = mongoose.model("video", videoSchema);

module.exports = Video;
