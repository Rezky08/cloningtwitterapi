const Response = require("../responses");
const Tweet = require("../models/Tweet");
const mongoose = require("mongoose");
const User = require("../models/User");
const { errorResponse } = require("../responses/responseFormatter");
const ObjectId = mongoose.Types.ObjectId;

const index = (req, res) => {
  User.aggregate([
    {
      $match: { _id: ObjectId(req?.user?._id) },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "user",
        as: "follows",
      },
    },
    {
      $addFields: {
        following: "$follows.following.user",
        tweets: "$tweets",
      },
    },
    {
      $unwind: "$following",
    },
    {
      $lookup: {
        from: "tweets",
        let: { followinguser: { $concatArrays: ["$following", ["$_id"]] } },
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "userTweet",
            },
          },
          {
            $unwind: "$userTweet",
          },
          {
            $addFields: {
              username: "$userTweet.username",
            },
          },
          {
            $match: { $expr: { $in: ["$user", "$$followinguser"] } },
          },
          {
            $project: {
              username: 1,
              text: 1,
              attachments: 1,
              replyPermission: 1,
              created_at: 1,
            },
          },
        ],
        as: "tweets",
      },
    },
    {
      $project: {
        _id: 0,
        tweets: 1,
      },
    },
    {
      $limit: 1,
    },
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
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "user",
        as: "follows",
      },
    },
    {
      $addFields: {
        following: "$follows.following.user",
        tweets: "$tweets",
      },
    },
    {
      $unwind: "$following",
    },
    {
      $lookup: {
        from: "tweets",
        let: { followinguser: { $concatArrays: ["$following", ["$_id"]] } },
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "userTweet",
            },
          },
          {
            $unwind: "$userTweet",
          },
          {
            $addFields: {
              username: "$userTweet.username",
            },
          },
          {
            $match: { $expr: { $in: ["$user", "$$followinguser"] } },
          },
          {
            $project: {
              username: 1,
              text: 1,
              attachments: 1,
              replyPermission: 1,
              created_at: 1,
            },
          },
        ],
        as: "tweets",
      },
    },
    {
      $project: {
        _id: 0,
        tweets: 1,
      },
    },
    {
      $limit: 1,
    },
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
