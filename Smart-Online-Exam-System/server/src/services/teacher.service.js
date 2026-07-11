const prisma = require("../lib/prisma");
const ApiError = require("../errors/ApiError");

/*
|--------------------------------------------------------------------------
| Get Teacher Profile
|--------------------------------------------------------------------------
*/

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
        throw new ApiError(
            404,
            "Teacher not found."
        );
    }

    return teacher;
};

/*
|--------------------------------------------------------------------------
| Get Teacher Dashboard
|--------------------------------------------------------------------------
*/

const getDashboard = async (userId) => {
    const teacher = await getProfile(userId);

    const [
        totalExams,
        activeExams,
        draftExams,
        totalQuestions,
        publishedResults,
        recentExams,
    ] = await Promise.all([
        /*
        | Total Teacher Exams
        */

        prisma.exam.count({
            where: {
                createdById: userId,
                isDeleted: false,
            },
        }),

        /*
        | Published / Active Exams
        */

        prisma.exam.count({
            where: {
                createdById: userId,
                status: "PUBLISHED",
                isDeleted: false,
            },
        }),

        /*
        | Draft Exams
        */

        prisma.exam.count({
            where: {
                createdById: userId,
                status: "DRAFT",
                isDeleted: false,
            },
        }),

        /*
        | Total Questions
        */

        prisma.question.count({
            where: {
                exam: {
                    createdById: userId,
                    isDeleted: false,
                },
            },
        }),

        /*
        | Generated Results
        */

        prisma.result.count({
            where: {
                exam: {
                    createdById: userId,
                    isDeleted: false,
                },
            },
        }),

        /*
        | Recent Teacher Exams
        */

        prisma.exam.findMany({
            where: {
                createdById: userId,
                isDeleted: false,
            },

            orderBy: {
                createdAt: "desc",
            },

            take: 5,

            select: {
                id: true,
                title: true,
                duration: true,
                totalMarks: true,
                passingMarks: true,
                startTime: true,
                endTime: true,
                status: true,
                createdAt: true,

                _count: {
                    select: {
                        questions: true,
                        attempts: true,
                        results: true,
                    },
                },
            },
        }),
    ]);

    return {
        teacher,

        stats: {
            totalExams,
            activeExams,
            draftExams,
            totalQuestions,
            publishedResults,
        },

        recentExams,
    };
};

module.exports = {
    getProfile,
    getDashboard,
};