const ResponseCode = require("./responseCode");

const successResponse = (
  data,
  code = ResponseCode.RESPONSE_CODE.RC_SUCCESS
) => {
  return {
    ...ResponseCode.getCodeMessage(code),
    data: data,
  };
};
const errorResponse = (
  data,
  code = ResponseCode.RESPONSE_CODE.RC_INVALID_DATA,
  message
) => {
  return {
    ...ResponseCode.getCodeMessage(code),
    data: data,
  };
};

module.exports = {
  errorResponse,
  successResponse,
};
