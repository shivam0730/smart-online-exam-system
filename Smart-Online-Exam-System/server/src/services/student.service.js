const prisma = require("../lib/prisma");
const ApiError = require("../errors/ApiError");

const getProfile = async (userId) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new ApiError(404, "Student not found.");
    }

    return user;
};

const getDashboard = async (userId) => {

    const user = await getProfile(userId);

    return {
        student: user,

        stats: {
            totalExams: 0,
            completedExams: 0,
            pendingExams: 0,
            averageScore: 0,
        },

        recentExams: [],
    };
};

module.exports = {
    getProfile,
    getDashboard,
};