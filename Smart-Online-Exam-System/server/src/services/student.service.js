const prisma = require("../lib/prisma");
const ApiError = require("../errors/ApiError");
const {
    calculateResult,
} = require("../utils/scoreCalculator");

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

const getAvailableExams = async (studentId) => {
    const currentTime = new Date();

    const exams = await prisma.exam.findMany({
        where: {
            status: "PUBLISHED",
            isDeleted: false,
            endTime: {
                gt: currentTime,
            },
        },

        select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            duration: true,
            totalMarks: true,
            passingMarks: true,
            startTime: true,
            endTime: true,
            status: true,

            _count: {
                select: {
                    questions: {
                        where: {
                            isActive: true,
                        },
                    },
                },
            },

            attempts: {
                where: {
                    studentId,
                },

                select: {
                    id: true,
                    startedAt: true,
                    submittedAt: true,
                    isSubmitted: true,
                },

                take: 1,
            },
        },

        orderBy: {
            startTime: "asc",
        },
    });

    return exams.map((exam) => {
        const attempt = exam.attempts[0] || null;

        let availabilityStatus = "UPCOMING";

        if (
            currentTime >= exam.startTime &&
            currentTime <= exam.endTime
        ) {
            availabilityStatus = "AVAILABLE";
        }

        if (attempt?.isSubmitted) {
            availabilityStatus = "COMPLETED";
        } else if (attempt) {
            availabilityStatus = "IN_PROGRESS";
        }

        return {
            id: exam.id,
            title: exam.title,
            description: exam.description,
            instructions: exam.instructions,
            duration: exam.duration,
            totalMarks: exam.totalMarks,
            passingMarks: exam.passingMarks,
            startTime: exam.startTime,
            endTime: exam.endTime,
            status: exam.status,
            totalQuestions: exam._count.questions,
            availabilityStatus,
            attempt,
        };
    });
};

const getExamById = async (examId, studentId) => {
    const exam = await prisma.exam.findFirst({
        where: {
            id: examId,
            status: "PUBLISHED",
            isDeleted: false,
        },

        select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            duration: true,
            totalMarks: true,
            passingMarks: true,
            startTime: true,
            endTime: true,
            status: true,

            questions: {
                where: {
                    isActive: true,
                },

                select: {
                    id: true,
                    question: true,
                    marks: true,
                    order: true,

                    options: {
                        select: {
                            id: true,
                            option: true,
                        },
                    },
                },

                orderBy: {
                    order: "asc",
                },
            },

            attempts: {
                where: {
                    studentId,
                },

                select: {
                    id: true,
                    startedAt: true,
                    submittedAt: true,
                    isSubmitted: true,

                    answers: {
                        select: {
                            questionId: true,
                            selectedOptionId: true,
                        },
                    },
                },

                take: 1,
            },
        },
    });

    if (!exam) {
        throw new ApiError(
            404,
            "Published exam not found."
        );
    }

    const currentTime = new Date();

    let availabilityStatus = "UPCOMING";

    if (
        currentTime >= exam.startTime &&
        currentTime <= exam.endTime
    ) {
        availabilityStatus = "AVAILABLE";
    }

    if (currentTime > exam.endTime) {
        availabilityStatus = "EXPIRED";
    }

    const attempt = exam.attempts[0] || null;

    if (attempt?.isSubmitted) {
        availabilityStatus = "COMPLETED";
    } else if (attempt) {
        availabilityStatus = "IN_PROGRESS";
    }

    return {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        instructions: exam.instructions,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        startTime: exam.startTime,
        endTime: exam.endTime,
        status: exam.status,
        totalQuestions: exam.questions.length,
        availabilityStatus,
        questions: exam.questions,
        attempt,
    };
};

const startExam = async (examId, studentId) => {
    const exam = await prisma.exam.findFirst({
        where: {
            id: examId,
            status: "PUBLISHED",
            isDeleted: false,
        },

        select: {
            id: true,
            title: true,
            duration: true,
            startTime: true,
            endTime: true,
        },
    });

    if (!exam) {
        throw new ApiError(
            404,
            "Published exam not found."
        );
    }

    const currentTime = new Date();

    if (currentTime < exam.startTime) {
        throw new ApiError(
            400,
            "Exam has not started yet."
        );
    }

    if (currentTime > exam.endTime) {
        throw new ApiError(
            400,
            "Exam has already ended."
        );
    }

    const existingAttempt = await prisma.examAttempt.findUnique({
        where: {
            examId_studentId: {
                examId,
                studentId,
            },
        },
    });

    if (existingAttempt) {
        if (existingAttempt.isSubmitted) {
            throw new ApiError(
                400,
                "You have already submitted this exam."
            );
        }

        const durationDeadline = new Date(
            existingAttempt.startedAt.getTime() +
            exam.duration * 60 * 1000
        );

        const expiresAt =
            durationDeadline < exam.endTime
                ? durationDeadline
                : exam.endTime;

        return {
            attempt: existingAttempt,
            exam: {
                id: exam.id,
                title: exam.title,
                duration: exam.duration,
            },
            expiresAt,
            resumed: true,
        };
    }

    const attempt = await prisma.examAttempt.create({
        data: {
            examId,
            studentId,
        },
    });

    const durationDeadline = new Date(
        attempt.startedAt.getTime() +
        exam.duration * 60 * 1000
    );

    const expiresAt =
        durationDeadline < exam.endTime
            ? durationDeadline
            : exam.endTime;

    return {
        attempt,
        exam: {
            id: exam.id,
            title: exam.title,
            duration: exam.duration,
        },
        expiresAt,
        resumed: false,
    };
};


const saveAnswer = async (
    attemptId,
    studentId,
    questionId,
    selectedOptionId
) => {
    const attempt = await prisma.examAttempt.findFirst({
        where: {
            id: attemptId,
            studentId,
        },

        include: {
            exam: {
                select: {
                    id: true,
                    duration: true,
                    endTime: true,
                },
            },
        },
    });

    if (!attempt) {
        throw new ApiError(
            404,
            "Exam attempt not found."
        );
    }

    if (attempt.isSubmitted) {
        throw new ApiError(
            400,
            "Cannot change answers after exam submission."
        );
    }

    const currentTime = new Date();

    const durationDeadline = new Date(
        attempt.startedAt.getTime() +
        attempt.exam.duration * 60 * 1000
    );

    const expiresAt =
        durationDeadline < attempt.exam.endTime
            ? durationDeadline
            : attempt.exam.endTime;

    if (currentTime > expiresAt) {
        throw new ApiError(
            400,
            "Exam attempt time has expired."
        );
    }

    const question = await prisma.question.findFirst({
        where: {
            id: questionId,
            examId: attempt.examId,
            isActive: true,
        },

        select: {
            id: true,
            marks: true,

            options: {
                where: {
                    id: selectedOptionId,
                },

                select: {
                    id: true,
                    isCorrect: true,
                },
            },
        },
    });

    if (!question) {
        throw new ApiError(
            404,
            "Question not found in this exam."
        );
    }

    const selectedOption = question.options[0];

    if (!selectedOption) {
        throw new ApiError(
            400,
            "Selected option does not belong to this question."
        );
    }

    const answer = await prisma.studentAnswer.upsert({
        where: {
            attemptId_questionId: {
                attemptId,
                questionId,
            },
        },

        update: {
            selectedOptionId,
            isCorrect: selectedOption.isCorrect,
            marksAwarded: selectedOption.isCorrect
                ? question.marks
                : 0,
        },

        create: {
            attemptId,
            questionId,
            selectedOptionId,
            isCorrect: selectedOption.isCorrect,
            marksAwarded: selectedOption.isCorrect
                ? question.marks
                : 0,
        },

        select: {
            id: true,
            attemptId: true,
            questionId: true,
            selectedOptionId: true,
            createdAt: true,
        },
    });

    return {
        answer,
        expiresAt,
    };
};


const submitExam = async (
    attemptId,
    studentId
) => {
    const attempt = await prisma.examAttempt.findFirst({
        where: {
            id: attemptId,
            studentId,
        },

        include: {
            exam: {
                select: {
                    id: true,
                    title: true,
                    totalMarks: true,
                    passingMarks: true,
                },
            },

            answers: {
                select: {
                    marksAwarded: true,
                },
            },

            result: true,
        },
    });

    if (!attempt) {
        throw new ApiError(
            404,
            "Exam attempt not found."
        );
    }

    if (attempt.isSubmitted) {
        throw new ApiError(
            400,
            "Exam has already been submitted."
        );
    }

    const calculatedResult = calculateResult(
        attempt.answers,
        attempt.exam.totalMarks,
        attempt.exam.passingMarks
    );

    const submission = await prisma.$transaction(
        async (transaction) => {
            const result = await transaction.result.create({
                data: {
                    examId: attempt.examId,
                    studentId,
                    attemptId: attempt.id,
                    score: calculatedResult.score,
                    totalMarks:
                        calculatedResult.totalMarks,
                    percentage:
                        calculatedResult.percentage,
                    isPassed:
                        calculatedResult.isPassed,
                },
            });

            const updatedAttempt =
                await transaction.examAttempt.update({
                    where: {
                        id: attempt.id,
                    },

                    data: {
                        isSubmitted: true,
                        submittedAt: new Date(),
                    },
                });

            return {
                result,
                attempt: updatedAttempt,
            };
        }
    );

    return {
        exam: {
            id: attempt.exam.id,
            title: attempt.exam.title,
        },

        result: submission.result,

        submittedAt:
            submission.attempt.submittedAt,
    };
};


module.exports = {
    getProfile,
    getDashboard,
    getAvailableExams,
    getExamById,
    startExam,
    saveAnswer,
    submitExam,
};