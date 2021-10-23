const mongoose = require("mongoose");
const PaginationQuery = require("./Pagination");

const userAggregate = (req) => [
  {
    $lookup: {
      from: "follows",
      localField: "_id",
      foreignField: "user",
      as: "follows",
    },
  },
  {
    $lookup: {
      from: "userdetails",
      localField: "_id",
      foreignField: "user",
      as: "detail",
    },
  },
  {
    $unwind: "$follows",
  },
  {
    $unwind: "$detail",
  },

  {
    $project: {
      username: true,
      description: "$detail.description",
      location: "$detail.location",
      link: "$detail.link",
      followers: { $size: "$follows.followers" },
      following: { $size: "$follows.following" },
      followed: {
        $cond: {
          if: {
            $in: [
              mongoose.Types.ObjectId(req?.user?._id),
              "$follows.followers.user",
            ],
          },
          then: true,
          else: false,
        },
      },
      followedback: {
        $cond: {
          if: {
            $in: [
              mongoose.Types.ObjectId(req?.user?._id),
              "$follows.following.user",
            ],
          },
          then: true,
          else: false,
        },
      },
    },
  },
  // { $limit: 1 },
];

const searchAggregate = (req) => [
  {
    $match: { username: { $regex: `.*${req.query.q}.*`, $options: "i" } },
  },
  {
    $lookup: {
      from: "userdetails",
      localField: "_id",
      foreignField: "user",
      as: "detail",
    },
  },
  {
    $lookup: {
      from: "follows",
      localField: "_id",
      foreignField: "user",
      as: "follows",
    },
  },
  {
    $unwind: "$detail",
  },
  {
    $unwind: "$follows",
  },
  {
    $project: {
      username: 1,
      description: "$detail.description",
      location: "$detail.location",
      link: "$detail.link",
      followers: { $size: "$follows.followers" },
      following: { $size: "$follows.following" },
    },
  },
  ...PaginationQuery.pagination(req?.query?.page, req?.query?.perpage),
];

module.exports = {
  userAggregate,
  searchAggregate,
};
