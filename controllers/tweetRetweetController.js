const Response = require("../responses");
const Tweet = require("../models/Tweet");
const TweetController = require("./tweetController");

const store = async (req, res) => {
  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return errorResponse(
      new Error("Cannot find tweet"),
      res,
      Response.ResponseCode.RESPONSE_CODE.RC_INVALID_DATA
    );
  }

  tweet
    .updateOne({
      $addToSet: {
        retweet: req.user._id,
      },
    })
    .then(() => {
      TweetController.show(req, res);
    })
    .catch((err) => {
      Response.ResponseFormatter.invalidValidationResponse(err, res);
    });
};

const destroy = async (req, res) => {
  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return errorResponse(
      new Error("Cannot find tweet"),
      res,
      Response.ResponseCode.RESPONSE_CODE.RC_INVALID_DATA
    );
  }

  tweet
    .updateOne({
      $pull: {
        retweet: req.user._id,
      },
    })
    .then(() => {
      TweetController.show(req, res);
    })
    .catch((err) => {
      Response.ResponseFormatter.invalidValidationResponse(err, res);
    });
};

module.exports = { store, destroy };
