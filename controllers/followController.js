const Response = require("../responses");
const User = require("../models/User");
const Follow = require("../models/Follow");

const index = (req, res) => {
  User.find()
    .then((users) => {
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        users
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
const show = (req, res) => {
  User.findById(req.params.userId)
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

const store = async (req, res, next) => {
  try {
    const username = req.params?.username ?? null;
    followUser = await User.findOne({ username });

    if (!followUser) {
      throw new Error("Cannot find this user");
    }

    following = new Follow({ user: req.user, userFollow: followUser });
    following
      .save()
      .then(() => {
        Response.ResponseFormatter.jsonResponse(
          res,
          Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
          { message: `${followUser?.username} followed!` }
        );
      })
      .catch((err) => {
        Response.ResponseFormatter.invalidValidationResponse(err, res);
      });
  } catch (error) {
    next({
      error: error,
      code: Response.ResponseCode.RESPONSE_CODE.RC_INVALID_DATA,
      data: req.params,
    });
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.params?.userId ?? req.user._id ?? null;
    if (!userId) {
      throw new Error("Require Credentials");
    }

    const findUser = await User.findOne({
      _id: req.params?.userId ?? req.user._id ?? null,
    });

    Object.keys(req.body).forEach((k) => {
      findUser[k] = req.body[k];
    });

    findUser
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

const destroy = async (req, res, next) => {
  try {
    const username = req.params?.username ?? null;
    followUser = await User.findOne({ username });

    if (!followUser) {
      throw new Error("Cannot find this user");
    }

    following = await Follow.findOne({
      user: req.user._id,
      userFollow: followUser._id,
    }).populate([
      { path: "user", select: "username -_id" },
      { path: "userFollow", select: "username -_id" },
    ]);

    following
      .delete()
      .then(() => {
        Response.ResponseFormatter.jsonResponse(
          res,
          Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
          following
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
  index,
  show,
  update,
  store,
  destroy,
};
