const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
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

/**
 * Validate username is unique
 */
UserSchema.path("username").validate(async (username) => {
  let documentCount = await mongoose.model("User").countDocuments({ username });
  return !(documentCount > 0);
}, "Username {VALUE} already exists");

/**
 * Encrypt password if value was changed or created
 */
UserSchema.pre("save", (done) => {
  if (this.isModified("password")) {
  }
});

module.exports = mongoose.model("User", UserSchema);
