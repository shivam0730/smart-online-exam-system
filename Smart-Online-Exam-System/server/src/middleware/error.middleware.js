const config = require("../config");
const ApiError = require("../errors/ApiError");

const errorMiddleware = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        error = new ApiError(
            500,
            error.message || "Internal Server Error"
        );
    }

    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors || [],
    };

    if (config.NODE_ENV === "development") {
        response.stack = error.stack;
    }

    return res.status(error.statusCode).json(response);
};

module.exports = errorMiddleware;