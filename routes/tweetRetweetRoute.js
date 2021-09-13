const PREFIX = "/retweet";

const express = require("express");

const router = express.Router();

const tweetRetweetController = require("../controllers/tweetRetweetController");

/**
 * method   : POST
 * endpoint : "/tweet"
 * return   : tweet
 * */
router.post("/:tweetId", tweetRetweetController.store);

module.exports = {
  prefix: PREFIX,
  router: router,
};
