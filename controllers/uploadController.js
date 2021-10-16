require("dotenv");
const Response = require("../responses");
const path = require("path");
const fs = require("fs");
const Tweet = require("../models/Tweet");
const mongoose = require("mongoose");
const TweetQueries = require("../queries/Tweet");
const Attachment = require("../models/Attachment");
const ImageUploadPath = `${process.env.UPLOAD_PATH}/images`;

const getUserImageUploadPath = (user) => {
  return `${ImageUploadPath}/${user?._id}/`;
};

const store = async (req, res, next) => {
  const image = req.files?.image;
  try {
    const imagePath = getUserImageUploadPath(req.user) + image.name;
    image.mv(path.resolve(imagePath));

    const attachment = new Attachment({
      user: req.user._id,
      path: imagePath,
    });

    attachment
      .save()
      .then((attachment) => {
        Response.ResponseFormatter.jsonResponse(res, undefined, {
          _id: attachment._id,
        });
      })
      .catch((err) => {
        fs.unlinkSync(imagePath);
        Response.ResponseFormatter.invalidValidationResponse(err, res);
      });
  } catch (err) {
    Response.ResponseFormatter.invalidValidationResponse(err, res);
  }
};
const show = async (req, res, next) => {
  const attachment = await Attachment.findById(req?.params?.attachmentId);

  try {
    switch (attachment.permission) {
      case "Everyone":
        res.sendFile(getUserImageUploadPath(req.user) + req?.params?.fileName);
        break;

      default:
        break;
    }
  } catch (err) {
    Response.ResponseFormatter.invalidValidationResponse(err, res);
  }
};

module.exports = { store, show };
