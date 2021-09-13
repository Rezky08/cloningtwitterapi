const Response = require("../responses");
const Tweet = require("../models/Tweet");
const mongoose = require("mongoose");
const User = require("../models/User");
const { errorResponse } = require("../responses/responseFormatter");
const ObjectId = mongoose.Types.ObjectId;

const index = (req, res) => {
  const q = req.query?.q;

  User.aggregate([
    {
      $match: { username: { $regex: `.*${q}.*` } },
    },
    {
      $lookup: {
        from: "userdetails",
        localField: "_id",
        foreignField: "user",
        as: "detail",
      },
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
      $unwind: "$detail",
    },
    {
      $unwind: "$follows",
    },
    {
      $project: {
        username: 1,
        description: "$detail.description",
        location: "$detail.location",
        link: "$detail.link",
        followers: { $size: "$follows.followers" },
        following: { $size: "$follows.following" },
      },
    },
    { $limit: 5 },
  ])
    .then((user) => {
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        user
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
module.exports = { index };
