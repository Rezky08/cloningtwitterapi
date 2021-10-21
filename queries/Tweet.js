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
      username: 1,
      text: 1,
      attachments: 1,
      replyPermission: 1,
      replies: 1,
      "replyUsers._id": 1,
      "replyUsers.username": 1,
      replyTo: 1,
      created_at: 1,
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

const graphLookupTweetReplies = (req) => [
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
          $sort: {
            _id: 1,
          },
        },
        ...Pagination.pagination(req?.query?.page, req?.query?.perpage),
        {
          $project: tweetDisplayFiltered(req),
        },
      ],
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
      $unwind: "$userTweet",
    },
    {
      $addFields: {
        username: "$userTweet.username",
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

const timelinePipelines = (req) => [
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
    $unwind: "$following",
  },
  {
    $lookup: {
      from: "tweets",
      let: { followinguser: { $concatArrays: ["$following", ["$_id"]] } },
      pipeline: [
        {
          $match: { $expr: { $in: ["$user", "$$followinguser"] } },
        },
        ...tweetPipelines(req),
      ],
      as: "tweets",
    },
  },

  {
    $project: {
      _id: 0,
      tweets: {
        $filter: {
          input: "$tweets",
          as: "tweet",
          cond: {
            $not: [{ $in: ["$$tweet.replyTo", "$tweets._id"] }],
          },
        },
      },
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
