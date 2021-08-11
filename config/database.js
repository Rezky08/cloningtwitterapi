require("dotenv/config");
const DB_CONNECTION = `${process.env.DB_DRIVER}://${process.env.DB_USER ?? ""}${
  process.env.DB_PASSWORD ? ":" + process.env.DB_PASSWORD : ""
}@${process.env.DB_HOST}${
  process.env.DB_PORT ? ":" + process.env.DB_PORT : ""
}/${process.env.DB_NAME}${
  process.env.DB_PARAM ? "?" + process.env.DB_PARAM : ""
}`;

module.exports = {
  DB_CONNECTION: DB_CONNECTION,
};
