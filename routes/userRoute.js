const PREFIX = "/user";

const express = require("express");
const ResponseFormatter = require("../responses/responseFormatter");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(
    ResponseFormatter.successResponse({
      user: {
        name: "test",
      },
    })
  );
});

module.exports = {
  prefix: PREFIX,
  router: router,
};
