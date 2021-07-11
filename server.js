const express = require("express");
const jwt = require("express-jwt");

const mongoose = require("mongoose");
const database = require("./config/database");
const middlewares = require("./middlewares");
const { ResponseFormatter, ResponseCode } = require("./responses");
require("dotenv/config");

const app = express();

const PORT = process.env.APP_PORT || 5000;

mongoose.Promise = global.Promise;
mongoose
  .connect(database.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log(`Cannot connected to database ${error}`);
    process.exit();
  });

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(middlewares.logger);
app.use(
  jwt({ secret: process.env.TOKEN_SECRET_KEY, algorithms: ["HS256"] }).unless({
    path: ["/auth/login", "/auth/token"],
  })
);

// routes
const UserRouter = require("./routes/userRoute");
const AuthRouter = require("./routes/authRoute");

app.get("/test", (req, res) => {
  res.json("test");
});
app.use(UserRouter.prefix, UserRouter.router);
app.use(AuthRouter.prefix, AuthRouter.router);

// 404 exception

// error handler
app.use(function (error, req, res, next) {
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
});

// app listener
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
