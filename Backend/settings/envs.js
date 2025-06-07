const dotenv = require("dotenv");
dotenv.config();

const env = {
  PORT: process.env.PORT || 3002,
};

module.exports = { env };
