const prisma = require("../lib/prisma");

const ApiError = require("../errors/ApiError");

/**

* Get a student's detailed result for a specific exam
  */
const getExamResult = async (
    examId,
    studentId
) => {
    const result = await prisma.result.findFirst({
        where: {
            examId,
            studentId,
        },

        include: {
            exam: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    totalMarks: true,
                    passingMarks: true,
                },
            },

            attempt: {
                select: {
                    id: true,
                    startedAt: true,
                    submittedAt: true,


                    answers: {
                        select: {
                            id: true,
                            isCorrect: true,
                            marksAwarded: true,

                            question: {
                                select: {
                                    id: true,
                                    question: true,
                                    marks: true,
                                    explanation: true,

                                    options: {
                                        select: {
                                            id: true,
                                            option: true,
                                            isCorrect: true,
                                        },
                                    },
                                },
                            },

                            selectedOption: {
                                select: {
                                    id: true,
                                    option: true,
                                },
                            },
                        },
                    },
                },


            },
        },
    });

    if (!result) {
        throw new ApiError(
            404,
            "Result not found for this exam."
        );
    }

    const totalQuestions =
        await prisma.question.count({
            where: {
                examId,
                isActive: true,
            },
        });

    const attemptedQuestions =
        result.attempt.answers.length;

    const correctAnswers =
        result.attempt.answers.filter(
            (answer) => answer.isCorrect
        ).length;

    const incorrectAnswers =
        attemptedQuestions - correctAnswers;

    const unattemptedQuestions =
        totalQuestions - attemptedQuestions;

    return {
        id: result.id,


        exam: result.exam,

        performance: {
            score: result.score,
            totalMarks: result.totalMarks,
            percentage: result.percentage,
            isPassed: result.isPassed,
        },

        questionSummary: {
            totalQuestions,
            attemptedQuestions,
            unattemptedQuestions,
            correctAnswers,
            incorrectAnswers,
        },

        attempt: {
            id: result.attempt.id,
            startedAt: result.attempt.startedAt,
            submittedAt: result.attempt.submittedAt,
        },

        answers: result.attempt.answers,

        generatedAt: result.createdAt,


    };
};

/**

* Get the logged-in student's exam history
  */
const getExamHistory = async (
    studentId
) => {
    const results = await prisma.result.findMany({
        where: {
            studentId,
        },

        select: {
            id: true,
            score: true,
            totalMarks: true,
            percentage: true,
            isPassed: true,
            createdAt: true,

            exam: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    passingMarks: true,
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
        totalResults: results.length,


        results: results.map((result) => ({
            id: result.id,

            exam: result.exam,

            performance: {
                score: result.score,
                totalMarks: result.totalMarks,
                percentage: result.percentage,
                isPassed: result.isPassed,
            },

            attempt: result.attempt,

            generatedAt: result.createdAt,
        })),


    };
};


/**

* Get the logged-in student's performance statistics
  */
const getPerformanceStatistics = async (
    studentId
) => {
    const results = await prisma.result.findMany({
        where: {
            studentId,
        },

        select: {
            percentage: true,
            isPassed: true,
        },
    });

    const totalExamsAttempted =
        results.length;

    const totalExamsPassed =
        results.filter(
            (result) => result.isPassed
        ).length;

    const totalExamsFailed =
        totalExamsAttempted - totalExamsPassed;

    if (totalExamsAttempted === 0) {
        return {
            totalExamsAttempted: 0,
            totalExamsPassed: 0,
            totalExamsFailed: 0,
            averagePercentage: 0,
            highestPercentage: 0,
            lowestPercentage: 0,
        };
    }

    const percentages = results.map(
        (result) => result.percentage
    );

    const totalPercentage =
        percentages.reduce(
            (total, percentage) =>
                total + percentage,
            0
        );

    const averagePercentage = Number(
        (
            totalPercentage /
            totalExamsAttempted
        ).toFixed(2)
    );

    const highestPercentage =
        Math.max(...percentages);

    const lowestPercentage =
        Math.min(...percentages);

    return {
        totalExamsAttempted,
        totalExamsPassed,
        totalExamsFailed,
        averagePercentage,
        highestPercentage,
        lowestPercentage,
    };
};



module.exports = {
    getExamResult,
    getExamHistory,
    getPerformanceStatistics,
};

