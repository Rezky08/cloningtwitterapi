const Response = require("../responses");
const Tweet = require("../models/Tweet");

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
    .then((retweet) => {
      Response.ResponseFormatter.jsonResponse(res, undefined, {
        retweet,
      });
    })
    .catch((err) => {
      Response.ResponseFormatter.invalidValidationResponse(err, res);
    });
};

module.exports = { store };
