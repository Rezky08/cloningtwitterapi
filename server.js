const express = require("express");
const jwt = require("express-jwt");
const cors = require("cors");

const mongoose = require("mongoose");
const database = require("./config/database");
const middlewares = require("./middlewares");
require("dotenv/config");

const app = express();
app.use(cors());

const PORT = process.env.PORT || process.env.APP_PORT || 5000;
console.log(database.DB_CONNECTION);
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
    path: ["/auth/login", "/auth/register", "/auth/token"],
  })
);
app.use(middlewares.userAccessLogger);

// routes
const UserRouter = require("./routes/userRoute");
const AuthRouter = require("./routes/authRoute");
const TweetRouter = require("./routes/tweetRoute");

app.get("/test", (req, res) => {
  res.json("test");
});
app.use(UserRouter.prefix, UserRouter.router);
app.use(AuthRouter.prefix, AuthRouter.router);
app.use(TweetRouter.prefix, TweetRouter.router);

// 404 exception

// error handler
app.use(middlewares.errorLogger);

// app listener
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
