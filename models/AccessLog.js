const mongoose = require("mongoose");
const Point = require("./Point");

const AccessLogSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ip: {
    type: String,
  },
  method: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  statuscode: {
    type: Number,
    required: true,
  },
  geo: {
    type: Point,
  },
  useragent: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AccessLog", AccessLogSchema);
