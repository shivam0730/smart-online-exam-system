const ApiError = require("../errors/ApiError");

const authorize = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return next(
                new ApiError(401, "Unauthorized.")
            );
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    "You are not allowed to access this resource."
                )
            );
        }

        next();
    };
};

module.exports = authorize;