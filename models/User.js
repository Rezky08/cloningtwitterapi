const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const Follow = require("./Follow");
const UserDetail = require("./UserDetail");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
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

UserSchema.plugin(uniqueValidator);

// /**
//  * Validate username is unique
//  */
// UserSchema.path("username").validate(async (username) => {
//   let documentCount = await mongoose.model("User").countDocuments({ username });
//   console.log(documentCount);
//   return !(documentCount > 0);
// }, "Username {VALUE} already exists");

/**
 * Encrypt password if value was changed or created
 */
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.post("save", async function () {
  let userFollow = await Follow.findOne({ user: this._id });
  let userDetail = await UserDetail.findOne({ user: this._id });
  if (!userFollow) {
    new Follow({ user: this }).save();
  }
  if (!userDetail) {
    new UserDetail({ user: this }).save();
  }
});
module.exports = mongoose.model("User", UserSchema);
