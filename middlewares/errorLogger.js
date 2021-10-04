const { ResponseCode, ResponseFormatter } = require("../responses");
const fs = require("fs");
const path = require("path");
const errorLogStream = fs.createWriteStream(
  path.join(process.env.LOG_PATH, "error.log"),
  {
    flags: "a",
  }
);

const logger = (error, req, res, next) => {
  errorLogStream.write(JSON.stringify(error));
  let code =
    Object.values(ResponseCode.RESPONSE_CODE).indexOf(error.code) > -1
      ? error.code
      : null;
  let data = error.data;

  if (!code) {
    switch (error.status) {
      case ResponseCode.HTTP_RESPONSE.UNAUTHORIZED:
        code = ResponseCode.RESPONSE_CODE.RC_UNAUTHORIZED;
        data = { message: error.message };
        break;

      default:
        break;
    }
  }
  ResponseFormatter.errorResponse(error.error, res, code, data);
};

module.exports = logger;
