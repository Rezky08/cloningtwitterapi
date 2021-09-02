require("dotenv/config");
const Response = require("../responses");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
moment.locale("id");

const throwCredentials = (status) => {
  if (status) {
    throw new Error("Please check your credentials");
  }
};

const getToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  )
    return req.headers.authorization.split(" ")[1];
  else if (req.query && req.query.token) return req.query.token;

  return null;
};

const me = async (req, res, next) => {
  try {
    const decode = req.user;
    Response.ResponseFormatter.jsonResponse(res, undefined, {
      ...decode,
      iat: moment(decode.iat * 1000).format("LLLL"),
      exp: moment(decode.exp * 1000).format("LLLL"),
    });
  } catch (error) {
    next({
      error: error,
      code: Response.ResponseCode.RESPONSE_CODE.RC_UNAUTHENTICATED,
      data: req.body,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select(
      "+password"
    );
    throwCredentials(!user);

    bcrypt
      .compare(req.body.password, user.password)
      .then((value) => {
        throwCredentials(!value);

        const token = jwt.sign(
          {
            _id: user._id,
            username: user.username,
          },
          process.env.TOKEN_SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        Response.ResponseFormatter.jsonResponse(res, undefined, { token });
      })
      .catch((err) => {
        next({
          error: err,
          code: Response.ResponseCode.RESPONSE_CODE.RC_UNAUTHENTICATED,
          data: req.body,
        });
      });
  } catch (error) {
    next({
      error: error,
      code: Response.ResponseCode.RESPONSE_CODE.RC_UNAUTHENTICATED,
      data: req.body,
    });
  }
};

const register = (req, res, next) => {
  try {
    const user = new User(req.body);
    user
      .save()
      .then((data) => {
        Response.ResponseFormatter.jsonResponse(
          res,
          Response.ResponseCode.RESPONSE_CODE.RC_SUCCESS,
          data
        );
      })
      .catch((err) => {
        Response.ResponseFormatter.invalidValidationResponse(err, res);
      });
  } catch (error) {
    next({
      error: error,
      code: Response.ResponseCode.RESPONSE_CODE.RC_INVALID_DATA,
      data: req.body,
    });
  }
};

const refresh = async (req, res) => {
  const jwt = await new SignJWT({ username: "test" });
  Response.ResponseFormatter.jsonResponse(res, undefined, jwt);
};

const logout = async (req, res) => {
  const jwt = await new SignJWT({ username: "test" });
  Response.ResponseFormatter.jsonResponse(res, undefined, jwt);
};

module.exports = {
  login,
  register,
  refresh,
  logout,
  me,
};
