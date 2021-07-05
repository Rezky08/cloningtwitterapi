const RESPONSE_CODE = {
  RC_SUCCESS: "0000",
  RC_INVALID_DATA: "1000",
};

const HTTP_RESPONSE = {
  BAD_REQUEST: 400,
  SUCCESS: 200,
};

const availableCodes = [
  // success response
  {
    status: HTTP_RESPONSE.SUCCESS,
    code: RESPONSE_CODE.RC_SUCCESS,
    message: "RC_SUCCESS",
  },
  // error response
  {
    status: HTTP_RESPONSE.BAD_REQUEST,
    code: RESPONSE_CODE.RC_INVALID_DATA,
    message: "RC_INVALID_DATA",
  },
];

const getCodeDetail = (code) => {
  return availableCodes.find((o) => o.code == code);
};

module.exports = {
  RESPONSE_CODE,
  availableCodes,
  getCodeDetail,
};
