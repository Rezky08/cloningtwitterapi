const PREFIX = "/user";

const express = require("express");

const router = express.Router();

const UserController = require("../controllers/userController");
const UserProfileRoute = require("./userProfileRoute");

router.use(UserProfileRoute.prefix, UserProfileRoute.router);

/**
 * method   : GET
 * endpoint : "/user"
 * return   : users[]
 * */
router.get("/", UserController.index);

/**
 * method   : GET
 * endpoint : "/user/:username"
 * return   : user{}
 * */
router.get("/:username", UserController.show);

/**
 * method   : PUT
 * endpoint : "/user/:userId"
 * return   : user{}
 * */
router.put("/:userId", UserController.update);

/**
 * method   : PUT
 * endpoint : "/user/:userId"
 * return   : user{}
 * */
router.put("/", UserController.update);

/**
 * method   : PUT
 * endpoint : "/user/:userId"
 * return   : user{}
 * */
router.delete("/:userId", UserController.destroy);

module.exports = {
  prefix: PREFIX,
  router: router,
};
