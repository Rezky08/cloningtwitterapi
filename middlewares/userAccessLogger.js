const AccessLog = require("../models/AccessLog");

const logger = (req, res, next) => {
  if (req.accessLog) {
    req.accessLog.user = req.user._id;
    req.accessLog.save();
  }
  next();
};

module.exports = logger;
