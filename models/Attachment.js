const mongoose = require("mongoose");

const AttachmentSchema = mongoose.Schema({
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  path: {
    type: String,
  },
});

module.exports = mongoose.model("Attachment", AttachmentSchema);
