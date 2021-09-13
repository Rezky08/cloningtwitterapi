const PREFIX = "/timeline";

const express = require("express");

const router = express.Router();

const TimelineController = require("../controllers/timelineController");

/**
 * method   : GET
 * endpoint : "/timeline"
 * return   : self timeline
 * */
router.get("/", TimelineController.index);

/**
 * method   : GET
 * endpoint : "/timeline/:username"
 * return   : user timeline
 * */
router.get("/:username", TimelineController.show);

module.exports = {
  prefix: PREFIX,
  router: router,
};
