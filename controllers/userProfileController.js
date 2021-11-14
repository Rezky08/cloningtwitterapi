const Response = require("../responses");
const User = require("../models/User");
const mongoose = require("mongoose");
const UserQuery = require("../queries/User");
const UserDetail = require("../models/UserDetail");

const show = (req, res) => {
  User.aggregate([
    { $match: { username: req?.params?.username } },
    ...UserQuery.userAggregate(req),
  ])
    .then((user) => {
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        user[0] ?? {}
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

const update = async (req, res, next) => {
  try {
    const userId = req.user._id ?? null;
    if (!userId) {
      throw new Error("Require Credentials");
    }

    const findUserDetail = await UserDetail.findOne({
      user: mongoose.Types.ObjectId(userId),
    });

    Object.keys(req.body).forEach((k) => {
      findUserDetail[k] = req.body[k];
    });

    findUserDetail
      .save()
      .then((user) => {
        Response.ResponseFormatter.jsonResponse(
          res,
          Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
          user
        );
      })
      .catch((err) => {
        Response.ResponseFormatter.invalidValidationResponse(err, res);
      });
  } catch (error) {
    next({
      error: error,
      code: Response.ResponseCode.RESPONSE_CODE.RC_INVALID_DATA,
      data: req.body,
    });
  }
};

module.exports = {
  show,
  update,
};
