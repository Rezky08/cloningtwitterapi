require("dotenv/config");
const ResponseCode = require("./responseCode");

const jsonResponse = (
  res,
  code = ResponseCode.RESPONSE_CODE.RC_SUCCESS,
  data
) => {
  let codeDetail = ResponseCode.getCodeDetail(code);
  res.status(codeDetail.status).json(formatResponse(codeDetail, data));
};

const errorResponse = (
  error = new Error(),
  res,
  code = ResponseCode.RESPONSE_CODE.RC_INVALID_DATA,
  data
) => {
  let codeDetail = ResponseCode.getCodeDetail(code);
  if (process.env.APP_ENV === "dev" || process.env.APP_ENV === "staging") {
    res
      .status(codeDetail.status)
      .json(formatErrorResponse(error, codeDetail, data));
  } else {
    res.status(500).json(formatResponse(codeDetail, "SERVER ERROR"));
  }
};

const formatErrorResponse = (error = new Error(), codeDetail, data = {}) => {
  return {
    ...codeDetail,
    message: error.message,
    data: data,
  };
};
const formatResponse = (codeDetail, data = {}) => {
  return {
    ...codeDetail,
    data: data,
  };
};

module.exports = {
  jsonResponse,
  formatResponse,
  errorResponse,
};
