const prisma = require("../lib/prisma");

const ApiError = require(
    "../errors/ApiError"
);

/*
|--------------------------------------------------------------------------
| Verify Teacher Exam Ownership
|--------------------------------------------------------------------------
*/

const getTeacherExam = async (
    examId,
    teacherId
) => {
    const exam =
        await prisma.exam.findFirst({
            where: {
                id: examId,
                createdById: teacherId,
                isDeleted: false,
            },

            select: {
                id: true,
                title: true,
                description: true,
                duration: true,
                totalMarks: true,
                passingMarks: true,
                status: true,
                startTime: true,
                endTime: true,
            },
        });

    if (!exam) {
        throw new ApiError(
            404,
            "Exam not found or you do not have permission to view its results."
        );
    }

    return exam;
};

/*
|--------------------------------------------------------------------------
| Get All Results for Teacher Exams
|--------------------------------------------------------------------------
*/

const getAllTeacherResults = async (
    teacherId
) => {
    const results =
        await prisma.result.findMany({
            where: {
                exam: {
                    createdById:
                        teacherId,

                    isDeleted: false,
                },
            },

            select: {
                id: true,
                score: true,
                totalMarks: true,
                percentage: true,
                isPassed: true,
                createdAt: true,

                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },

                exam: {
                    select: {
                        id: true,
                        title: true,
                        passingMarks: true,
                        status: true,
                    },
                },

                attempt: {
                    select: {
                        id: true,
                        startedAt: true,
                        submittedAt: true,
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

    return {
        totalResults:
            results.length,

        results,
    };
};

/*
|--------------------------------------------------------------------------
| Get Results for One Teacher Exam
|--------------------------------------------------------------------------
*/

const getExamResults = async (
    examId,
    teacherId
) => {
    const exam =
        await getTeacherExam(
            examId,
            teacherId
        );

    const results =
        await prisma.result.findMany({
            where: {
                examId,
            },

            select: {
                id: true,
                score: true,
                totalMarks: true,
                percentage: true,
                isPassed: true,
                createdAt: true,

                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },

                attempt: {
                    select: {
                        id: true,
                        startedAt: true,
                        submittedAt: true,
                    },
                },
            },

            orderBy: [
                {
                    percentage:
                        "desc",
                },

                {
                    createdAt:
                        "desc",
                },
            ],
        });

    return {
        exam,

        totalResults:
            results.length,

        results,
    };
};

/*
|--------------------------------------------------------------------------
| Get Performance Statistics for One Exam
|--------------------------------------------------------------------------
*/

const getExamPerformance = async (
    examId,
    teacherId
) => {
    const exam =
        await getTeacherExam(
            examId,
            teacherId
        );

    const results =
        await prisma.result.findMany({
            where: {
                examId,
            },

            select: {
                percentage: true,
                isPassed: true,
            },
        });

    const totalAttempts =
        results.length;

    const totalPassed =
        results.filter(
            (result) =>
                result.isPassed
        ).length;

    const totalFailed =
        totalAttempts -
        totalPassed;

    if (
        totalAttempts === 0
    ) {
        return {
            exam,

            statistics: {
                totalAttempts: 0,
                totalPassed: 0,
                totalFailed: 0,
                passPercentage: 0,
                averagePercentage: 0,
                highestPercentage: 0,
                lowestPercentage: 0,
            },
        };
    }

    const percentages =
        results.map(
            (result) =>
                result.percentage
        );

    const totalPercentage =
        percentages.reduce(
            (
                total,
                percentage
            ) =>
                total +
                percentage,
            0
        );

    const averagePercentage =
        Number(
            (
                totalPercentage /
                totalAttempts
            ).toFixed(2)
        );

    const passPercentage =
        Number(
            (
                (
                    totalPassed /
                    totalAttempts
                ) *
                100
            ).toFixed(2)
        );

    return {
        exam,

        statistics: {
            totalAttempts,

            totalPassed,

            totalFailed,

            passPercentage,

            averagePercentage,

            highestPercentage:
                Math.max(
                    ...percentages
                ),

            lowestPercentage:
                Math.min(
                    ...percentages
                ),
        },
    };
};

module.exports = {
    getAllTeacherResults,
    getExamResults,
    getExamPerformance,
};