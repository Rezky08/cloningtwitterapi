const getToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  )
    return req.headers.authorization.split(" ")[1];
  else if (req.query && req.query.token) return req.query.token;

  return null;
};
const verifyToken = function (req, res, next) {
  const token = getToken(req);
  const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  req.auth = decode;
  next();
};

module.exports = function () {
  verifyToken.unless = require("express-unless");
  return verifyToken;
};
