const Response = require("../responses");
const Tweet = require("../models/Tweet");
const mongoose = require("mongoose");

const index = (req, res) => {
  Tweet.find()
    .select("-__v")
    .populate({ path: "user", select: "username _id" })
    .exec()
    .then((tweets) => {
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

const graphReplies = {
  $graphLookup: {
    from: "tweets",
    startWith: "$_id",
    connectFromField: "_id",
    connectToField: "replyTo",
    depthField: "depth",
    as: "replies",
  },
};

const tweetFilter = (tweetId) => [
  graphReplies,
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
    $match: { _id: mongoose.Types.ObjectId(tweetId) },
  },
  {
    $sort: {
      created_at: -1,
    },
  },
  {
    $project: {
      username: 1,
      text: 1,
      attachments: 1,
      replyPermission: 1,
      replies: 1,
      replyTo: 1,
      created_at: 1,
      likes: 1,
      retweet: 1,
    },
  },
  {
    $limit: 1,
  },
];

const show = (req, res) => {
  Tweet.aggregate(tweetFilter(req.params?.tweetId))
    .then((tweets) => {
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        tweets.length > 0 ? tweets[0] : {}
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

const store = async (req, res, next) => {
  const tweetData = { user: req.user, ...req.body };
  const tweet = new Tweet(tweetData);
  tweet
    .save()
    .then((tweet) => {
      Response.ResponseFormatter.jsonResponse(res, undefined, {
        tweet,
      });
    })
    .catch((err) => {
      Response.ResponseFormatter.invalidValidationResponse(err, res);
    });
};

module.exports = { store, index, show };
