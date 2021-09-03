const PREFIX = "";

const express = require("express");

const router = express.Router();

const FollowController = require("../controllers/followController");

/**
 * method   : POST
 * endpoint : "/follow/:username"
 * return   : follow{}
 * */
router.post("/follow/:username", FollowController.store);

/**
 * method   : POST
 * endpoint : "/unfollow/:username"
 * return   : follow{}
 * */
router.post("/unfollow/:username", FollowController.destroy);

module.exports = {
  prefix: PREFIX,
  router: router,
};
