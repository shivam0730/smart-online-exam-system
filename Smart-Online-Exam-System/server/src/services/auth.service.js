const prisma = require("../lib/prisma");
const ApiError = require("../errors/ApiError");

const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");





/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

const register = async (userData) => {
    const { firstName, lastName, email, password } = userData;

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new ApiError(409, "Email already exists.");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
        },
    });

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    };
};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

const login = async ({ email, password }) => {

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const isPasswordCorrect = await comparePassword(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const token = generateToken({
        id: user.id,
        role: user.role,
    });

    return {
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
    };
};



module.exports = {
    register,
    login,
};