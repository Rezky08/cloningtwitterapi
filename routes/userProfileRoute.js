const PREFIX = "/profile";

const express = require("express");

const router = express.Router();

const UserProfileController = require("../controllers/userProfileController");

/**
 * method   : PUT
 * endpoint : "/user/profile"
 * return   : user{}
 * */
router.put("/", UserProfileController.update);

/**
 * method   : GET
 * endpoint : "/user/profile/:username"
 * return   : user{}
 * */
router.get("/:username", UserProfileController.show);

module.exports = {
  prefix: PREFIX,
  router: router,
};
