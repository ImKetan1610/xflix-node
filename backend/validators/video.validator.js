// const { required } = require("joi");
// const Joi = require("joi");

// const bodyValidation = Joi.object().keys({
//   videoLink: Joi.string()
//     .required()
//     .regex(/youtube\.com\/embed\/?([a-zA-Z0-9-_]+)$/),
//   title: Joi.string().required(),
//   genre: Joi.string()
//     .required()
//     .valid("Education", "Sports", "Movies", "Comedy", "Lifestyle", "All"),
//   contentRating: Joi.string()
//     .required()
//     .allow("Anyone", "7+", "12+", "16+", "18+"),
//   releaseDate: Joi.string().required(),
//   previewImage: Joi.string().required(),
// });

// const videoValidation = Joi.object().keys({
//   videoId: Joi.string()
//     .required()
//     .regex(/^[0-9a-fA-F]{24}$/),
// });

// module.exports = { bodyValidation, videoValidation };

const Joi = require("joi");

const postVideo = {
  body: Joi.object().keys({
    videoLink: Joi.string()
      .required()
      .custom((value, helpers) => {
        return value;
      }),
    title: Joi.string().required(),
    genre: Joi.string()
      .valid("Education", "Sports", "Movies", "Comedy", "Lifestyle", "All")
      .required(),
    contentRating: Joi.string()
      .valid("Anyone", "7+", "12+", "16+", "18+")
      .required(),
    releaseDate: Joi.date().required(),
    previewImage: Joi.string().required(),
  }), 
};

const getVideos = {
  query: Joi.object().keys({
    title: Joi.string(),
    genre: Joi.string(),
    contentRating: Joi.string().valid("Anyone","7+","12+","16+","18+"),
    sortBy: Joi.string().valid("viewCount","releaseDate")
  })
}

const getVideoById = {
  params: Joi.object().keys({
    videoId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!value.match(/^[0-9a-fA-F]{24}$/)) {
          return helpers.message('"{{#label}}" must be a valid mongo id');
        }
        return value;
      }),
  }),
};

module.exports = { postVideo, getVideos, getVideoById };
