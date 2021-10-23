const Response = require("../responses");
const Tweet = require("../models/Tweet");
const mongoose = require("mongoose");
const User = require("../models/User");
const UserQuery = require("../queries/User");
const { errorResponse } = require("../responses/responseFormatter");
const ObjectId = mongoose.Types.ObjectId;

const index = (req, res) => {
  User.aggregate(UserQuery.searchAggregate(req))
    .then((user) => {
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        user
      );
    })
    .catch((err) => {
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        err
      );
    });
};
module.exports = { index };
