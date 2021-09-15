const PREFIX = "/retweet";

const express = require("express");

const router = express.Router();

const tweetRetweetController = require("../controllers/tweetRetweetController");

/**
 * method   : POST
 * endpoint : "/retweet"
 * return   : tweet
 * */
router.post("/:tweetId", tweetRetweetController.store);

/**
 * method   : DELETE
 * endpoint : "/retweet"
 * return   : tweet
 * */
router.delete("/:tweetId", tweetRetweetController.destroy);

module.exports = {
  prefix: PREFIX,
  router: router,
};
