const PREFIX = "/follow";

const express = require("express");

const router = express.Router();

const FollowController = require("../controllers/followController");

/**
 * method   : GET
 * endpoint : "/follow"
 * return   : follows[]
 * */
router.get("/", FollowController.index);

/**
 * method   : GET
 * endpoint : "/follow/:userId"
 * return   : follow{}
 * */
router.get("/:userId", FollowController.show);

/**
 * method   : POST
 * endpoint : "/follow/:userId"
 * return   : follow{}
 * */
router.post("/:userId", FollowController.store);

/**
 * method   : DELETE
 * endpoint : "/follow/:userId"
 * return   : follow{}
 * */
router.delete("/:userId", FollowController.destroy);

module.exports = {
  prefix: PREFIX,
  router: router,
};
