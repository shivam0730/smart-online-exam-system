const prisma = require("../lib/prisma");
const ApiError = require("../errors/ApiError");

//Get Teacher Profile

const getProfile = async (userId) => {

    const teacher = await prisma.user.findUnique({
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

    if (!teacher) {
        throw new ApiError(404, "Teacher not found.");
    }

    return teacher;
};

//teacher dashboard

const getDashboard = async (userId) => {

    const teacher = await getProfile(userId);

    return {
        teacher,

        stats: {
            totalExams: 0,
            activeExams: 0,
            draftExams: 0,
            totalQuestions: 0,
            publishedResults: 0,
        },

        recentExams: [],
    };
};

module.exports = {
    getProfile,
    getDashboard,
};