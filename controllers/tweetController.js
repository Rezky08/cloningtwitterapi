const Response = require("../responses");
const Tweet = require("../models/Tweet");
const mongoose = require("mongoose");
const TweetQueries = require("../queries/Tweet");

const index = (req, res) => {
  Tweet.aggregate(TweetQueries.tweetPipelines(req))
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

const show = (req, res) => {
  Tweet.aggregate(TweetQueries.tweetFilter(req))
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
