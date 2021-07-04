require("dotenv/config");
const DB_CONNECTION = `${process.env.DB_DRIVER}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

module.exports = {
  DB_CONNECTION: DB_CONNECTION,
};
