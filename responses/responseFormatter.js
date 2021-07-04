const ResponseCode = require("./responseCode");

const jsonResponse = (
  res,
  data,
  code = ResponseCode.RESPONSE_CODE.RC_SUCCESS
) => {
  let httpStatus = ResponseCode.getResponseGroup(code);
  res.status(httpStatus).json(formatResponse(data, code));
};

const formatResponse = (data, code = ResponseCode.RESPONSE_CODE.RC_SUCCESS) => {
  return {
    ...ResponseCode.getCodeMessage(code),
    data: data,
  };
};

module.exports = {
  jsonResponse,
  formatResponse,
};
