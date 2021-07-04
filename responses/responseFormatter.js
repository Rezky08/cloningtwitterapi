const ResponseCode = require("./responseCode");

const jsonResponse = (
  res,
  data,
  code = ResponseCode.RESPONSE_CODE.RC_SUCCESS
) => {
  let codeDetail = ResponseCode.getCodeDetail(code);
  res.status(codeDetail.status).json(formatResponse(data, codeDetail));
};

const formatResponse = (data, codeDetail) => {
  return {
    ...codeDetail,
    data: data,
  };
};

module.exports = {
  jsonResponse,
  formatResponse,
};
