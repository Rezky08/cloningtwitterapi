const express = require("express");
const mongoose = require("mongoose");
const database = require("./config/database");
const middlewares = require("./middlewares");
require("dotenv/config");

const app = express();

const PORT = process.env.PORT || 5000;

mongoose.Promise = global.Promise;
mongoose.connect(
  database.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connect to the database")
);

// middleware
app.use(middlewares.logger);

// routes
const UserRouter = require("./routes/userRoute");

app.use(UserRouter.prefix, UserRouter.router);

// 404 exception

// error handler

// app listener
app.listen(PORT, () => console.log(`App started on port ${PORT}`));
