const PREFIX = "/upload";

const express = require("express");

const router = express.Router();

const UploadController = require("../controllers/uploadController");

/**
 * method   : POST
 * endpoint : "/upload"
 * return   : message
 * */
router.post("/", UploadController.store);

/**
 * method   : GET
 * endpoint : "/upload/:attachmentId"
 * return   : Image
 * */
router.get("/:attachmentId", UploadController.show);

module.exports = {
  prefix: PREFIX,
  router: router,
};
