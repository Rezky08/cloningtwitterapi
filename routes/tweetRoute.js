const PREFIX = "/tweet";

const express = require("express");

const router = express.Router();

const TweetController = require("../controllers/tweetController");

const TweetReplyRoute = require("./tweetReplyRoute");
const TweetLikeRoute = require("./tweetLikeRoute");
const TweetRetweetRoute = require("./tweetRetweetRoute");

/**
 * method   : GET
 * endpoint : "/tweet"
 * return   : tweet
 * */
router.get("/", TweetController.index);

/**
 * method   : GET
 * endpoint : "/tweet/:tweetId"
 * return   : tweet
 * */
router.get("/:tweetId", TweetController.show);

/**
 * method   : POST
 * endpoint : "/tweet"
 * return   : tweet
 * */
router.post("/", TweetController.store);

router.use(TweetReplyRoute.prefix, TweetReplyRoute.router);
router.use(TweetLikeRoute.prefix, TweetLikeRoute.router);
router.use(TweetRetweetRoute.prefix, TweetRetweetRoute.router);

module.exports = {
  prefix: PREFIX,
  router: router,
};
