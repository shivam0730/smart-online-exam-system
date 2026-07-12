const prisma = require("../lib/prisma");
const ApiError = require("../errors/ApiError");

const createQuestion = async (examId, user, payload) => {
    // 1. Check if exam exists
    const exam = await prisma.exam.findUnique({
        where: {
            id: examId,
        },
        select: {
            id: true,
            createdById: true,
            status: true,
        },
    });

    if (!exam) {
        throw new ApiError(404, "Exam not found.");
    }



    // 2. Check ownership (Admins can access everything)

    if (
        user.role === "TEACHER" &&
        exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized to modify this exam."
        );
    }

    // 3. Prevent editing archived exams
    if (exam.status === "ARCHIVED") {
        throw new ApiError(
            400,
            "Archived exams cannot be modified."
        );
    }

    // 4. Exactly one correct option
    const correctOptions = payload.options.filter(
        (option) => option.isCorrect
    );

    if (correctOptions.length !== 1) {
        throw new ApiError(
            400,
            "Exactly one correct option is required."
        );
    }

    // 5. Get next question order
    const lastQuestion = await prisma.question.findFirst({
        where: {
            examId,
        },
        orderBy: {
            order: "desc",
        },
        select: {
            order: true,
        },
    });

    const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

    // 6. Create question with options
    const question = await prisma.question.create({
        data: {
            question: payload.question,
            marks: payload.marks,
            explanation: payload.explanation,
            examId,
            order: nextOrder,

            options: {
                create: payload.options,
            },
        },

        include: {
            options: true,
        },
    });

    return question;

};


const getAllQuestions = async (examId, user) => {

    const exam = await prisma.exam.findUnique({
        where: {
            id: examId,
        },
        select: {
            id: true,
            createdById: true,
        },
    });

    if (!exam) {
        throw new ApiError(404, "Exam not found.");
    }

    if (
        user.role === "TEACHER" &&
        exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized to view this exam."
        );
    }

    return prisma.question.findMany({
        where: {
            examId,
        },

        include: {
            options: true,
        },

        orderBy: {
            order: "asc",
        },
    });

};


const getQuestionStats = async (examId, user) => {

    const exam = await prisma.exam.findUnique({
        where: {
            id: examId,
        },
        select: {
            id: true,
            createdById: true,
        },
    });

    if (!exam) {
        throw new ApiError(404, "Exam not found.");
    }

    if (
        user.role === "TEACHER" &&
        exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized to view this exam."
        );
    }

    const questions = await prisma.question.findMany({
        where: {
            examId,
        },
        select: {
            marks: true,
            isActive: true,
        },
    });

    const totalQuestions = questions.length;

    const activeQuestions = questions.filter(
        (q) => q.isActive
    ).length;

    const inactiveQuestions =
        totalQuestions - activeQuestions;

    const totalMarks = questions.reduce(
        (sum, q) => sum + q.marks,
        0
    );

    return {
        totalQuestions,
        activeQuestions,
        inactiveQuestions,
        totalMarks,
    };
};


const getQuestionById = async (questionId, user) => {

    const question = await prisma.question.findUnique({

        where: {
            id: questionId,
        },

        include: {
            exam: {
                select: {
                    createdById: true,
                },
            },

            options: true,
        },
    });

    if (!question) {
        throw new ApiError(
            404,
            "Question not found."
        );
    }

    if (
        user.role === "TEACHER" &&
        question.exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized."
        );
    }

    return question;

};

const updateQuestion = async (
    questionId,
    user,
    payload
) => {

    const question = await prisma.question.findUnique({
        where: {
            id: questionId,
        },
        include: {
            exam: {
                select: {
                    id: true,
                    createdById: true,
                    status: true,
                },
            },
            options: true,
        },
    });

    if (!question) {
        throw new ApiError(
            404,
            "Question not found."
        );
    }

    if (
        user.role === "TEACHER" &&
        question.exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized to update this question."
        );
    }

    if (question.exam.status === "ARCHIVED") {
        throw new ApiError(
            400,
            "Archived exams cannot be modified."
        );
    }

    if (payload.options) {

        const correctOptions =
            payload.options.filter(
                (option) => option.isCorrect
            );

        if (correctOptions.length !== 1) {
            throw new ApiError(
                400,
                "Exactly one correct option is required."
            );
        }

        const existingOptionIds =
            new Set(
                question.options.map(
                    (option) => option.id
                )
            );

        const receivedOptionIds =
            payload.options
                .filter(
                    (option) => option.id
                )
                .map(
                    (option) => option.id
                );

        const hasInvalidOption =
            receivedOptionIds.some(
                (optionId) =>
                    !existingOptionIds.has(
                        optionId
                    )
            );

        if (hasInvalidOption) {
            throw new ApiError(
                400,
                "One or more options do not belong to this question."
            );
        }
    }

    const updatedQuestion =
        await prisma.question.update({

            where: {
                id: questionId,
            },

            data: {

                question:
                    payload.question ??
                    question.question,

                marks:
                    payload.marks ??
                    question.marks,

                explanation:
                    payload.explanation ??
                    question.explanation,

                options: payload.options
                    ? {
                        update:
                            payload.options
                                .filter(
                                    (option) =>
                                        option.id
                                )
                                .map(
                                    (option) => ({
                                        where: {
                                            id:
                                                option.id,
                                        },

                                        data: {
                                            option:
                                                option.option,

                                            isCorrect:
                                                option.isCorrect,
                                        },
                                    })
                                ),

                        create:
                            payload.options
                                .filter(
                                    (option) =>
                                        !option.id
                                )
                                .map(
                                    (option) => ({
                                        option:
                                            option.option,

                                        isCorrect:
                                            option.isCorrect,
                                    })
                                ),
                    }
                    : undefined,
            },

            include: {
                options: true,
            },
        });

    return updatedQuestion;
};


const updateQuestionStatus = async (
    questionId,
    user,
    isActive
) => {

    const question = await prisma.question.findUnique({
        where: {
            id: questionId,
        },
        include: {
            exam: {
                select: {
                    createdById: true,
                    status: true,
                },
            },
        },
    });

    if (!question) {
        throw new ApiError(
            404,
            "Question not found."
        );
    }

    if (
        user.role === "TEACHER" &&
        question.exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized to update this question."
        );
    }

    if (question.exam.status === "ARCHIVED") {
        throw new ApiError(
            400,
            "Archived exams cannot be modified."
        );
    }





    const updatedQuestion = await prisma.question.update({
        where: {
            id: questionId,
        },
        data: {
            isActive,
        },
        select: {
            id: true,
            question: true,
            isActive: true,
        },
    });

    return updatedQuestion;
};


const duplicateQuestion = async (questionId, user) => {

    const question = await prisma.question.findUnique({
        where: {
            id: questionId,
        },
        include: {
            exam: true,
            options: true,
        },
    });

    if (!question) {
        throw new ApiError(
            404,
            "Question not found."
        );
    }

    if (
        user.role === "TEACHER" &&
        question.exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized to duplicate this question."
        );
    }

    if (question.exam.status === "ARCHIVED") {
        throw new ApiError(
            400,
            "Archived exams cannot be modified."
        );
    }

    const lastQuestion = await prisma.question.findFirst({
        where: {
            examId: question.examId,
        },
        orderBy: {
            order: "desc",
        },
        select: {
            order: true,
        },
    });

    const nextOrder = lastQuestion
        ? lastQuestion.order + 1
        : 1;

    const duplicatedQuestion =
        await prisma.question.create({

            data: {
                question:
                    question.question + " (Copy)",

                marks: question.marks,

                explanation:
                    question.explanation,

                examId: question.examId,

                order: nextOrder,

                isActive: true,

                options: {
                    create: question.options.map(
                        (option) => ({
                            option: option.option,
                            isCorrect:
                                option.isCorrect,
                        })
                    ),
                },
            },

            include: {
                options: true,
            },
        });

    return duplicatedQuestion;
};


const deleteQuestion = async (
    questionId,
    user
) => {

    const question =
        await prisma.question.findUnique({

            where: {
                id: questionId,
            },

            include: {
                exam: {
                    select: {
                        createdById: true,
                        status: true,
                    },
                },
            },
        });

    if (!question) {
        throw new ApiError(
            404,
            "Question not found."
        );
    }

    if (
        user.role === "TEACHER" &&
        question.exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized to delete this question."
        );
    }

    if (question.exam.status === "ARCHIVED") {
        throw new ApiError(
            400,
            "Archived exams cannot be modified."
        );
    }

    await prisma.question.delete({
        where: {
            id: questionId,
        },
    });

    return;
};


module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionStats,
    getQuestionById,
    updateQuestion,
    updateQuestionStatus,
    duplicateQuestion,
    deleteQuestion,
};