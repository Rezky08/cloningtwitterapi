const mongoose = require("mongoose");
const Pagination = require("./Pagination");

const graphLookupTweetRepliesOnly = [
  {
    $graphLookup: {
      from: "tweets",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "replyTo",
      depthField: "depth",
      maxDepth: 2,
      as: "replies",
    },
  },
  {
    $addFields: {
      repliesCount: { $size: "$replies" },
    },
  },
];
const tweetDisplay = (user_id = null) => {
  return {
    $project: {
      name: 1,
      username: 1,
      text: 1,
      attachments: 1,
      replyPermission: 1,
      replies: 1,
      "replyUsers._id": 1,
      "replyUsers.username": 1,
      replyTo: 1,
      created_at: 1,
      userFlag: 1,
      flag: {
        liked: { $in: [mongoose.Types.ObjectId(user_id), "$likes"] },
        retweeted: { $in: [mongoose.Types.ObjectId(user_id), "$retweet"] },
      },
      count: {
        replies: "$repliesCount",
        likes: { $size: "$likes" },
        retweet: { $size: "$retweet" },
      },
    },
  };
};

const tweetDisplayFiltered = (req) => {
  const filtered = Object.entries(tweetDisplay(req?.user?._id).$project).filter(
    ([key, value]) => key !== "replies"
  );
  return Object.fromEntries(filtered);
};

const graphLookupTweetReplies = (req, needPagination = false) => [
  ...graphLookupTweetRepliesOnly,
  {
    $lookup: {
      from: "tweets",
      let: {
        repliesid: "$replies._id",
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$_id", "$$repliesid"],
            },
          },
        },
        ...graphLookupTweetRepliesOnly,
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        ...(needPagination
          ? Pagination.pagination(req?.query?.page, req?.query?.perpage)
          : Pagination.pagination()),
        {
          $project: {
            ...tweetDisplayFiltered(req),
            username: { $first: "$user.username" },
          },
        },
      ].filter((value) => value != null),
      as: "replies",
    },
  },
];

const tweetPipelines = (req) => {
  return [
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userTweet",
      },
    },
    {
      $lookup: {
        from: "userdetails",
        localField: "user",
        foreignField: "user",
        as: "userDetailTweet",
      },
    },
    {
      $unwind: "$userTweet",
    },
    {
      $addFields: {
        username: "$userTweet.username",
        name: {
          $cond: {
            if: {
              $or: [
                { $eq: [{ $type: "$userDetailTweet.name" }, "missing"] },
                { $eq: ["$userDetailTweet.name", null] },
              ],
            },
            then: "$userDetailTweet.name",
            else: "$userTweet.username",
          },
        },
      },
    },
    ...graphLookupTweetReplies(req),
    {
      $lookup: {
        from: "users",
        let: {
          replyuser: "$replies.user",
        },
        pipeline: [
          {
            $match: { $expr: { $in: ["$_id", "$$replyuser"] } },
          },
        ],
        as: "replyUsers",
      },
    },
    tweetDisplay(req?.user?._id),
  ];
};

const timelinePipelines = (req, needPagination = false) => [
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
      following: "$follows.following.user",
      tweets: "$tweets",
    },
  },
  {
    $unwind: {
      path: "$following",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "tweets",
      let: {
        followinguser: {
          $cond: {
            if: {
              $eq: [mongoose.Types.ObjectId(req?.user?._id), "$_id"],
            },
            then: { $concatArrays: ["$following", ["$_id"]] },
            else: { $concatArrays: [["$_id"]] },
            // else: ["$_id"],
          },
        },
        userid: "$_id",
      },
      pipeline: [
        {
          $match: {
            $and: [
              {
                $or: [
                  { $expr: { $in: ["$user", "$$followinguser"] } },
                  {
                    $expr: {
                      $and: [
                        { $setIsSubset: ["$$followinguser", "$likes"] },
                        {
                          $and: [
                            {
                              $gt: [{ $size: "$likes" }, 0],
                            },
                            {
                              $gt: [{ $size: "$$followinguser" }, 0],
                            },
                          ],
                        },
                      ],
                    },
                  },
                  {
                    $expr: { $eq: ["$$userid", "$user"] },
                  },
                ],
              },
              {
                $or: [
                  {
                    $and: [
                      {
                        $expr: {
                          $not: [
                            {
                              $or: [
                                { $eq: [{ $type: "$replyTo" }, "missing"] },
                                { $eq: ["$replyTo", null] },
                              ],
                            },
                          ],
                        },
                      },
                      {
                        $expr: {
                          $in: ["$$followinguser", "$likes"],
                        },
                      },
                    ],
                  },
                  {
                    $expr: {
                      $cond: {
                        if: {
                          $or: [
                            { $eq: [{ $type: "$replyTo" }, "missing"] },
                            { $eq: ["$replyTo", null] },
                          ],
                        },
                        then: true,
                        else: false,
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          $addFields: {
            userFlag: {
              $cond: {
                if: {
                  $ne: [mongoose.Types.ObjectId(req?.user?._id), "$$userid"],
                },
                then: {
                  liked: { $in: ["$$userid", "$likes"] },
                  retweeted: { $in: ["$$userid", "$retweet"] },
                },
                else: null,
              },
            },
          },
        },

        ...tweetPipelines(req),
        {
          $sort: {
            _id: -1,
          },
        },
        ...(needPagination
          ? Pagination.pagination(req?.query?.page, req?.query?.perpage)
          : Pagination.pagination()),
      ],
      as: "tweets",
    },
  },

  {
    $project: {
      _id: 0,
      tweets: 1,
    },
  },
];

const repliesSort = (tweet) => {
  tweet.replies = tweet?.replies?.map((reply) => {
    reply.user = tweet?.replyUsers?.find(
      (replyUser) => String(reply.user) === String(replyUser._id)
    );
    return reply;
  });
  tweet.replies = tweet?.replies?.sort(function (a, b) {
    return new Date(a.created_at) - new Date(b.created_at);
  });
  return tweet;
};

const tweetsRepliesSort = (tweets) => {
  if (Array.isArray(tweets)) {
    return tweets?.map((tweet) => {
      return repliesSort(tweet);
    });
  } else {
    return repliesSort(tweets);
  }
};

const tweetFilter = (req) => [
  ...tweetPipelines(req),
  {
    $match: { _id: mongoose.Types.ObjectId(req?.params?.tweetId) },
  },
  {
    $limit: 1,
  },
];

module.exports = {
  graphLookupTweetReplies,
  tweetDisplay,
  timelinePipelines,
  tweetPipelines,
  tweetsRepliesSort,
  tweetFilter,
};
