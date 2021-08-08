const mongoose = require("mongoose");

const TweetSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tweet: {
    type: String,
    required: true,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    required: true,
  },
  attachments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Attachment",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tweet", TweetSchema);
