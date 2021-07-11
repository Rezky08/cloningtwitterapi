const moment = require("moment");
const geoip = require("geoip-lite");

const logger = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(
    `${ip}\t${req.protocol}://${req.get("host")}${
      req.originalUrl
    }\t${moment().format()}\t${geoip.lookup(ip)}`
  );
  next();
};

module.exports = logger;
