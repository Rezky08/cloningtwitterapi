const PREFIX = "/like";

const express = require("express");

const router = express.Router();

const tweetLikeController = require("../controllers/tweetLikeController");

/**
 * method   : POST
 * endpoint : "/tweet"
 * return   : tweet
 * */
router.post("/:tweetId", tweetLikeController.store);

module.exports = {
  prefix: PREFIX,
  router: router,
};
