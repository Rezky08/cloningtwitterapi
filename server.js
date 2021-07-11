const express = require("express");
const mongoose = require("mongoose");
const database = require("./config/database");
const middlewares = require("./middlewares");
const { ResponseFormatter } = require("./responses");
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

// routes
const UserRouter = require("./routes/userRoute");

app.get("/test", (req, res) => {
  res.json("test");
});
app.use(UserRouter.prefix, UserRouter.router);

// 404 exception

// error handler
app.use(function (error, req, res, next) {
  ResponseFormatter.errorResponse(error.error, res, error.code, error.data);
});

// app listener
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
