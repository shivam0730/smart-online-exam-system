const prisma = require("../../lib/prisma");

const findUserByEmail = (email) => {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
};

const createUser = (data) => {
    return prisma.user.create({
        data,
    });
};

const findUserById = (id) => {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
};

module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
};