const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const FollowSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
    unique: true,
  },

  following: [
    {
      user: {
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
    },
  ],
  followers: [
    {
      user: {
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
    },
  ],
});

FollowSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Follow", FollowSchema);
