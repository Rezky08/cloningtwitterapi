const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserDetailSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
    index: true,
  },
  description: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "",
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

UserDetailSchema.plugin(uniqueValidator);

module.exports = mongoose.model("UserDetail", UserDetailSchema);
