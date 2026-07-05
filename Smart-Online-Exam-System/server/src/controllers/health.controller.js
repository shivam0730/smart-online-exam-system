const ApiResponse = require("../utils/ApiResponse");
const config = require("../config");

const healthCheck = (req, res) => {
    const response = new ApiResponse(
        200,
        "Server is running successfully.",
        {
            status: "OK",
            environment: config.NODE_ENV,
        }
    );

    res.status(response.statusCode).json(response);
};

module.exports = {
    healthCheck,
};