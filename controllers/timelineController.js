const Response = require("../responses");
const Tweet = require("../models/Tweet");
const mongoose = require("mongoose");
const User = require("../models/User");
const { errorResponse } = require("../responses/responseFormatter");
const ObjectId = mongoose.Types.ObjectId;
const TweetQueries = require("../queries/Tweet");

const index = (req, res) => {
  User.aggregate([
    {
      $match: { _id: ObjectId(req?.user?._id) },
    },
    ...TweetQueries.timelinePipelines(req),
  ])
    .then((tweets) => {
      tweets = tweets[0]?.tweets;

      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        tweets
      );
    })
    .catch((err) => {
      console.log(err);
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        err
      );
    });
};

const show = async (req, res) => {
  const user = await User.findOne({ username: req?.params?.username });

  if (!user) {
    return errorResponse(
      new Error("Cannot find this user"),
      res,
      Response.ResponseCode.RESPONSE_CODE.RC_INVALID_DATA
    );
  }

  User.aggregate([
    {
      $match: { _id: user._id },
    },
    ...TweetQueries.timelinePipelines,
  ])
    .then((tweets) => {
      tweets = tweets[0]?.tweets;
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        tweets
      );
    })
    .catch((err) => {
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        err
      );
    });
};

module.exports = { show, index };
