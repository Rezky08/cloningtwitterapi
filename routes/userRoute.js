const PREFIX = "/user";

const express = require("express");
const Response = require("../responses");

const router = express.Router();

router.get("/", (req, res) => {
  Response.ResponseFormatter.jsonResponse(res, {
    user: {
      name: "bambang",
    },
  });
});

module.exports = {
  prefix: PREFIX,
  router: router,
};
