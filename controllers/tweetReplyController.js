const Response = require("../responses");
const Tweet = require("../models/Tweet");
const TweetQueries = require("../queries/Tweet");
const PaginationQueries = require("../queries/Pagination");
const mongoose = require("mongoose");

const store = async (req, res) => {
  const tweet = await Tweet.findById(req.params.tweetId);
  if (!tweet) {
    return errorResponse(
      new Error("Cannot find tweet"),
      res,
      Response.ResponseCode.RESPONSE_CODE.RC_INVALID_DATA
    );
  }

  const tweetData = { user: req.user, replyTo: tweet, ...req.body };

  const replyTweet = new Tweet(tweetData);
  replyTweet
    .save()
    .then((replyTweet) => {
      Response.ResponseFormatter.jsonResponse(res, undefined, {
        replyTweet,
      });
    })
    .catch((err) => {
      Response.ResponseFormatter.invalidValidationResponse(err, res);
    });
};

const show = async (req, res) => {
  Tweet.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.tweetId) } },
    ...TweetQueries.graphLookupTweetReplies(
      req,
      req?.query?.hasOwnProperty("page")
    ),
  ])
    .then((tweets) => {
      tweet = tweets[0] ?? {};
      Response.ResponseFormatter.jsonResponse(res, undefined, tweet?.replies);
    })
    .catch((err) => {
      Response.ResponseFormatter.invalidValidationResponse(err, res);
    });
};

module.exports = { store, show };
