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
  const aggregateQuery = [
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
      $addFields: {
        following: "$follows.following",
        followers: "$follows.followers",
      },
    },
    {
      $unwind: "$following",
    },
    {
      $unwind: "$followers",
    },
    {
      $project: {
        username: true,
        followers: { $size: "$followers" },
        following: { $size: "$following" },
      },
    },
    // { $limit: 1 },
  ];
  User.aggregate(aggregateQuery)
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
