const prisma = require("../lib/prisma");
const ApiError = require("../errors/ApiError");
const { verifyToken } = require("../utils/jwt");

const auth = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;


        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Authentication token is missing.");
        }

        const token = authHeader.split(" ")[1];



        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });

        if (!user) {
            throw new ApiError(401, "User not found.");
        }

        if (!user.isActive) {
            throw new ApiError(
                403,
                "Your account has been deactivated. Please contact the administrator."
            );
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = auth;