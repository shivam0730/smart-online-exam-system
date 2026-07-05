const dotenv = require("dotenv");

dotenv.config({
    quiet: true,
});

const config = {
    PORT: process.env.PORT || 5000,

    NODE_ENV: process.env.NODE_ENV || "development",

    APP_NAME:
        process.env.APP_NAME ||
        "Smart Online Examination System",

    API_PREFIX:
        process.env.API_PREFIX ||
        "/api/v1",

    JWT_SECRET:
        process.env.JWT_SECRET,

    JWT_EXPIRES_IN:
        process.env.JWT_EXPIRES_IN || "7d",
};

module.exports = config;