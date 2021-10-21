const PREFIX = "/reply";

const express = require("express");

const router = express.Router();

const tweetReplyController = require("../controllers/tweetReplyController");

/**
 * method   : POST
 * endpoint : "/reply"
 * return   : tweet
 * */
router.post("/:tweetId", tweetReplyController.store);

/**
 * method   : POST
 * endpoint : "/reply"
 * return   : tweet
 * */
router.get("/:tweetId", tweetReplyController.show);

module.exports = {
  prefix: PREFIX,
  router: router,
};
