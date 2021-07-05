const PREFIX = "/user";

const express = require("express");

const router = express.Router();

const UserController = require("../controllers/userController");

/**
 * method   : GET
 * endpoint : "/user"
 * return   : users[]
 * */
router.get("/", UserController.index);

/**
 * method   : GET
 * endpoint : "/user/:userId"
 * return   : user{}
 * */
router.get("/:userId", UserController.show);

/**
 * method   : PUT
 * endpoint : "/user/:userId"
 * return   : user{}
 * */
router.put("/:userId", UserController.update);

module.exports = {
  prefix: PREFIX,
  router: router,
};
