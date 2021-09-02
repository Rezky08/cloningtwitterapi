const mongoose = require("mongoose");

const FollowSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userFollow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

module.exports = mongoose.model("Follow", FollowSchema);
