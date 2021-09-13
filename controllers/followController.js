const Response = require("../responses");
const User = require("../models/User");
const Follow = require("../models/Follow");
const { errorResponse } = require("../responses/responseFormatter");

const store = async (req, res, next) => {
  try {
    // find user by username
    const userWantToFollow = await User.findOne({
      username: req.params?.username ?? null,
    });
    if (!userWantToFollow) {
      throw new Error("Require user want to follow");
    }
    // find current user
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(
        new Error("Require Credentials"),
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_UNAUTHENTICATED
      );
    }

    // abort if follow self
    if (user.equals(userWantToFollow)) {
      return errorResponse(
        new Error("Cannot follow yourself"),
        res,
        Response.ResponseCode.RESPONSE_CODE.RC_INVALID_FOLLOW
      );
    }

    // find current user follows
    let followUser = await Follow.findOne({
      user: user,
    });

    // if doesnt exist create one
    if (!followUser) {
      followUser = await new Follow({ user: user }).save();
    }

    // find follows of user want to follow
    let followUserWantToFollow = await Follow.findOne({
      user: userWantToFollow,
    });

    // if doesnt exist create one
    if (!followUserWantToFollow) {
      followUserWantToFollow = await new Follow({
        user: userWantToFollow,
      }).save();
    }

    await Follow.updateOne(
      { _id: followUser._id, "following.user": { $ne: userWantToFollow } },
      {
        $addToSet: { following: { user: userWantToFollow } },
      }
    );

    // push to followers
    await Follow.updateOne(
      { _id: followUserWantToFollow._id, "followers.user": { $ne: user } },
      {
        $addToSet: { followers: { user: user } },
      }
    );

    // send response
    Response.ResponseFormatter.jsonResponse(
      res,
      Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
      {
        message: "Success follow " + userWantToFollow.username,
      }
    );
  } catch (error) {
    next({
      error: error,
      code: Response.ResponseCode.RESPONSE_CODE.RC_INVALID_DATA,
      data: req.params,
    });
  }
};

const destroy = async (req, res, next) => {
  try {
    // find user by username
    const userWantToUnfollow = await User.findOne({
      username: req.params?.username ?? null,
    });
    if (!userWantToUnfollow) {
      throw new Error("Require user want to follow");
    }
    // find current user
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("Require Credentials");
    }

    // find current user follows
    let followUser = await Follow.findOne({
      user: user,
    });

    // if doesnt exist create one
    if (!followUser) {
      followUser = await new Follow({ user: user }).save();
    }

    // find follows of user want to follow
    let followUserWantToUnfollow = await Follow.findOne({
      user: userWantToUnfollow,
    });

    // if doesnt exist create one
    if (!followUserWantToUnfollow) {
      followUserWantToUnfollow = await new Follow({
        user: userWantToUnfollow,
      }).save();
    }

    // filter to following
    followUser.following = followUser.following.filter(
      (following) => following.user == userWantToUnfollow._id
    );
    await followUser.save();
    console.log("Masuk");

    followUserWantToUnfollow.followers =
      followUserWantToUnfollow.followers.filter(
        (follower) => follower.user == user._id
      );

    await followUserWantToUnfollow.save();

    // send response
    Response.ResponseFormatter.jsonResponse(
      res,
      Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
      {
        message: "Success unfollow " + userWantToUnfollow.username,
      }
    );
  } catch (error) {
    console.log(error);
    next({
      error: error,
      code: Response.ResponseCode.RESPONSE_CODE.RC_INVALID_DATA,
      data: req.body,
    });
  }
};
module.exports = {
  store,
  destroy,
};
