const PREFIX = "/follow";

const express = require("express");

const router = express.Router();

const FollowController = require("../controllers/followController");

/**
 * method   : POST
 * endpoint : "/follow/:username"
 * return   : follow{}
 * */
router.post("/:username", FollowController.store);

/**
 * method   : DELETE
 * endpoint : "/follow/:username"
 * return   : follow{}
 * */
router.delete("/:username", FollowController.destroy);

module.exports = {
  prefix: PREFIX,
  router: router,
};
