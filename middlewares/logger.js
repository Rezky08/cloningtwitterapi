require("dotenv/config");
const moment = require("moment");
const geoip = require("geoip-lite");
const AccessLog = require("../models/AccessLog");
const fs = require("fs");
const path = require("path");
const drivers = process.env.LOG_DRIVER.split(",");
const accessLogStream = fs.createWriteStream(
  path.join(process.env.LOG_PATH, "access.log"),
  {
    flags: "a",
  }
);

const logger = (req, res, next) => {
  const useragent = req.headers["user-agent"];
  const method = req.method;
  const statuscode = res.statusCode;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const geoIp = geoip.lookup(ip) ?? "";
  let geo = null;
  if (geoIp) {
    geo = {
      type: "Point",
      coordinates: geoIp.ll,
    };
  }
  const logMessage = `${ip}\t"${method} ${url} ${statuscode}"\t[${moment().format()}]\t"${useragent}"\t"${
    geo?.coordinates ?? ""
  }"`;
  req.logMessage = logMessage;
  console.log(logMessage);

  if (drivers.includes("database")) {
    const accessLog = new AccessLog({
      ip,
      method,
      url,
      geo,
      statuscode,
      useragent,
    });
    accessLog.save().then((data) => {
      req.accessLog = accessLog;
    });
  }

  if (drivers.includes("file")) {
    accessLogStream.write(logMessage + "\n");
  }

  next();
};

module.exports = logger;
