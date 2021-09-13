const PREFIX = "/reply";

const express = require("express");

const router = express.Router();

const tweetReplyController = require("../controllers/tweetReplyController");

/**
 * method   : POST
 * endpoint : "/tweet"
 * return   : tweet
 * */
router.post("/:tweetId", tweetReplyController.store);

module.exports = {
  prefix: PREFIX,
  router: router,
};
