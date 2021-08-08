const PREFIX = "/auth";

const express = require("express");

const router = express.Router();

const AuthController = require("../controllers/authController");

/**
 * method   : GET
 * endpoint : "/logout"
 * return   : null
 * */
router.get("/me", AuthController.me);

/**
 * method   : POST
 * endpoint : "/login"
 * return   : token
 * */
router.post("/login", AuthController.login);

/**
 * method   : POST
 * endpoint : "/login"
 * return   : token
 * */
router.post("/register", AuthController.register);

/**
 * method   : GET
 * endpoint : "/logout"
 * return   : null
 * */
router.get("/logout", AuthController.logout);

/**
 * method   : POST
 * endpoint : "/login"
 * return   : token
 * */
router.post("/refresh", AuthController.refresh);

module.exports = {
  prefix: PREFIX,
  router: router,
};
