const PREFIX = "/like";

const express = require("express");

const router = express.Router();

const tweetLikeController = require("../controllers/tweetLikeController");

/**
 * method   : POST
 * endpoint : "/like/:tweetId"
 * return   : tweet
 * */
router.post("/:tweetId", tweetLikeController.store);

/**
 * method   : DELETE
 * endpoint : "/unlike/:tweetId"
 * return   : tweet
 * */
router.delete("/:tweetId", tweetLikeController.destroy);

module.exports = {
  prefix: PREFIX,
  router: router,
};
