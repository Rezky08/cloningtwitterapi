const PREFIX = "/tweet";

const express = require("express");

const router = express.Router();

const TweetController = require("../controllers/tweetController");

const TweetReplyRoute = require("./tweetReplyRoute");

/**
 * method   : GET
 * endpoint : "/tweet"
 * return   : tweet
 * */
router.get("/", TweetController.index);

/**
 * method   : POST
 * endpoint : "/tweet"
 * return   : tweet
 * */
router.post("/", TweetController.store);

router.use(TweetReplyRoute.prefix, TweetReplyRoute.router);

module.exports = {
  prefix: PREFIX,
  router: router,
};
