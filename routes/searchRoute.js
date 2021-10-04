const PREFIX = "/search";

const express = require("express");

const router = express.Router();

const SearchController = require("../controllers/searchController");

/**
 * method   : GET
 * endpoint : "/search"
 * return   :
 * */
router.get("/", SearchController.index);

module.exports = {
  prefix: PREFIX,
  router: router,
};
