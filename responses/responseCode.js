const RESPONSE_CODE = {
  RC_SUCCESS: "0000",
  RC_INVALID_DATA: "1000",
  // Auth
  RC_UNAUTHENTICATED: "2001",
  RC_UNAUTHORIZED: "2002",
  // Follows
  RC_INVALID_FOLLOW: "3001",
};

const HTTP_RESPONSE = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
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
  // error auth
  {
    status: HTTP_RESPONSE.UNAUTHORIZED,
    code: RESPONSE_CODE.RC_UNAUTHENTICATED,
    message: "RC_UNAUTHENTICATED",
  },
  {
    status: HTTP_RESPONSE.UNAUTHORIZED,
    code: RESPONSE_CODE.RC_UNAUTHORIZED,
    message: "RC_UNAUTHORIZED",
  },
  // error follows
  {
    status: HTTP_RESPONSE.BAD_REQUEST,
    code: RESPONSE_CODE.RC_INVALID_FOLLOW,
    message: "RC_INVALID_FOLLOW",
  },
];

const getCodeDetail = (code) => {
  return availableCodes.find((o) => o.code == code);
};

module.exports = {
  HTTP_RESPONSE,
  RESPONSE_CODE,
  availableCodes,
  getCodeDetail,
};
