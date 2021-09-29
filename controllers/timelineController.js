const Response = require("../responses");
const Tweet = require("../models/Tweet");
const mongoose = require("mongoose");
const User = require("../models/User");
const { errorResponse } = require("../responses/responseFormatter");
const ObjectId = mongoose.Types.ObjectId;

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

const timelineFilter = [
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
        graphReplies,
        {
          $lookup: {
            from: "users",
            let: {
              replyuser: "$replies.user",
            },
            pipeline: [
              {
                $match: { $expr: { $in: ["$_id", "$$replyuser"] } },
              },
            ],
            as: "replyUsers",
          },
        },
        {
          $project: {
            username: 1,
            text: 1,
            attachments: 1,
            replyPermission: 1,
            replies: 1,
            "replyUsers._id": 1,
            "replyUsers.username": 1,
            replyTo: 1,
            created_at: 1,
            likes: 1,
            retweet: 1,
          },
        },
      ],
      as: "tweets",
    },
  },

  {
    $project: {
      _id: 0,
      tweets: {
        $filter: {
          input: "$tweets",
          as: "tweet",
          cond: {
            $not: [{ $in: ["$$tweet.replyTo", "$tweets._id"] }],
          },
        },
      },
    },
  },
  {
    $limit: 1,
  },
];

const preparedTweetBeforeShow = (tweets) => {
  tweets?.map((tweet) => {
    tweet.replies = tweet?.replies?.map((reply) => {
      reply.user = tweet?.replyUsers?.find(
        (replyUser) => String(reply.user) === String(replyUser._id)
      );
      return reply;
    });
    tweet.replies = tweet?.replies?.sort(function (a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return tweet;
  });
  return tweets;
};

const index = (req, res) => {
  User.aggregate([
    {
      $match: { _id: ObjectId(req?.user?._id) },
    },
    ...timelineFilter,
  ])
    .then((tweets) => {
      tweets = tweets[0]?.tweets;
      tweets = preparedTweetBeforeShow(tweets);

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
    ...timelineFilter,
  ])
    .then((tweets) => {
      tweets = tweets[0]?.tweets;
      tweets = preparedTweetBeforeShow(tweets);
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
