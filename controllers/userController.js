const Response = require("../responses");
const User = require("../models/User");

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
  User.aggregate([
    { $match: { username: req.params.username } },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "user",
        as: "follows",
      },
    },
    {
      $unwind: "$follows",
    },
    {
      $lookup: {
        from: "users",
        localField: "follows.followings.user",
        foreignField: "_id",
        as: "follows.followings.user",
      },
    },
    {
      $unwind: {
        path: "$follows.followings.user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$follows.followers.user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        __v: false,
        password: false,
        created_at: false,
        updated_at: false,
        "follows.__v": false,
        "follows.followings.__v": false,
        "follows.followings.user.__v": false,
        "follows.followings.user._id": false,
        "follows.followers.__v": false,
        "follows.followers.user.__v": false,
        "follows.followers.user._id": false,
        "follows._id": false,
        "follows.followings.created_at": false,
        "follows.followings.updated_at": false,
        "follows.followings.user.created_at": false,
        "follows.followings.user.updated_at": false,
        "follows.followings.user.password": false,
        "follows.followers.created_at": false,
        "follows.followers.updated_at": false,
        "follows.followers.user.created_at": false,
        "follows.followers.user.updated_at": false,
        "follows.followers.user.password": false,
      },
    },
  ])
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

const destroy = (req, res, next) => {
  try {
    User.findByIdAndRemove(req.params.userId).then((user) => {
      Response.ResponseFormatter.jsonResponse(
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
        user
      );
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
  destroy,
};
