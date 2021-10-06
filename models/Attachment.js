const mongoose = require("mongoose");

const AttachmentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  permission: {
    type: String,
    enum: ["Everyone", "People you follow", "People you mention", "You"],
    default: "Everyone",
  },
  path: {
    type: String,
  },
});

module.exports = mongoose.model("Attachment", AttachmentSchema);
