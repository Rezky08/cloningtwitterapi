const mongoose = require("mongoose");

const TweetSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  replyPermission: {
    type: String,
    enum: ["Everyone", "People you follow", "People you mention"],
    default: "Everyone",
  },
  attachments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Attachment",
    default: [],
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
