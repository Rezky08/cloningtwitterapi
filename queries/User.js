const mongoose = require("mongoose");

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

module.exports = {
  userAggregate,
};
