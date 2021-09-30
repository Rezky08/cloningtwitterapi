const graphLookupTweetReplies = {
  $graphLookup: {
    from: "tweets",
    startWith: "$_id",
    connectFromField: "_id",
    connectToField: "replyTo",
    depthField: "depth",
    as: "replies",
  },
};
const tweetDisplay = {
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
    likes: 1,
    retweet: 1,
  },
};

const timelinePipelines = [
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
        {
          $match: { $expr: { $in: ["$user", "$$followinguser"] } },
        },
        graphLookupTweetReplies,
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
        tweetDisplay,
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
    return new Date(b.created_at) - new Date(a.created_at);
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

module.exports = {
  graphLookupTweetReplies,
  tweetDisplay,
  timelinePipelines,
  tweetsRepliesSort,
};
