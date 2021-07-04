const PREFIX = "/user";

const express = require("express");
const Response = require("../responses");

const router = express.Router();

const User = require("../models/User");

router.get("/", (req, res) => {
  User.find()
    .then((users) => {
      Response.ResponseFormatter.jsonResponse(res, users);
    })
    .catch((err) => {
      Response.ResponseFormatter.jsonResponse(res, err);
    });
});

module.exports = {
  prefix: PREFIX,
  router: router,
};
