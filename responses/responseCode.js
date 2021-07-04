const RESPONSE_CODE = {
  // success response
  RC_SUCCESS: "0000",
  // user failed 1000 - 1999
  RC_INVALID_DATA: "1000",
};

const RESPONSE_GROUP = {
  // http status : [codes]
  200: [RESPONSE_CODE.RC_SUCCESS],
  400: [RESPONSE_CODE.RC_INVALID_DATA],
};

const getResponseGroup = (code = RESPONSE_CODE.RC_SUCCESS) => {
  for (const httpStatus in RESPONSE_GROUP) {
    if (RESPONSE_GROUP[httpStatus].indexOf(code) > -1) {
      return httpStatus;
    }
  }
};

const getCodeMessage = (code) => {
  let keys = Object.keys(RESPONSE_CODE);
  let codes = Object.values(RESPONSE_CODE);
  let index = codes.indexOf(code);
  return {
    code: codes[index],
    message: keys[index],
  };
};

module.exports = {
  RESPONSE_CODE,
  RESPONSE_GROUP,
  getResponseGroup,
  getCodeMessage,
};
