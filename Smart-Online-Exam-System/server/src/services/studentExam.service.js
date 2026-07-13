const prisma = require("../lib/prisma");

const ApiError = require("../errors/ApiError");
const {
  getAttemptDeadline,
  isAttemptExpired,
} = require("../utils/examTimer");

/**
 * Get all currently available exams for students
 */
const getAvailableExams = async () => {
  const currentTime = new Date();

  const exams = await prisma.exam.findMany({
    where: {
      status: "PUBLISHED",
      isDeleted: false,
      startTime: {
        lte: currentTime,
      },
      endTime: {
        gte: currentTime,
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

      createdAt: true,
    },

    orderBy: {
      startTime: "asc",
    },
  });

  return exams;
};


/**
 * Start an exam attempt
 */
const startExam = async (examId, studentId) => {
    const currentTime = new Date();

    // Check whether the exam is available
    const exam = await prisma.exam.findFirst({
        where: {
            id: examId,
            status: "PUBLISHED",
            isDeleted: false,
            startTime: {
                lte: currentTime,
            },
            endTime: {
                gte: currentTime,
            },
        },
        select: {
            id: true,
            title: true,
            duration: true,
            totalMarks: true,
            passingMarks: true,
            endTime: true,
        },
    });

    if (!exam) {
        throw new ApiError(
            404,
            "Exam is not available or has expired."
        );
    }   

    // Check whether the student already started this exam
    const existingAttempt =
        await prisma.examAttempt.findUnique({
            where: {
                examId_studentId: {
                    examId,
                    studentId,
                },
            },
        });
    if (existingAttempt) {
        if (
            existingAttempt.isSubmitted
        ) {
            throw new ApiError(
                409,
                "You have already submitted this exam."
            );
        }

        return getActiveAttempt(
            examId,
            studentId
        );
    }

    try {
        // Create a new exam attempt
        const attempt =
            await prisma.examAttempt.create({
                data: {
                    examId,
                    studentId,
                },

                include: {
                    exam: {
                        select: {
                            id: true,
                            title: true,
                            duration: true,
                            totalMarks: true,
                            passingMarks: true,
                            endTime: true,
                        },
                    },
                },
            });

        return attempt;
    } catch (error) {
        if (
            error.code === "P2002"
        ) {
            return getActiveAttempt(
                examId,
                studentId
            );
        }

        throw error;
    }
};


/**
 * Get student's active exam attempt
 */
const getActiveAttempt = async (
    examId,
    studentId
) => {
    const attempt =
        await prisma.examAttempt.findUnique({
            where: {
                examId_studentId: {
                    examId,
                    studentId,
                },
            },

            include: {
                exam: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        instructions: true,
                        duration: true,
                        totalMarks: true,
                        passingMarks: true,
                        endTime: true,

                        questions: {
                            where: {
                                isActive: true,
                            },

                            orderBy: {
                                order: "asc",
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
                        },
                    },
                },

                answers: {
                    select: {
                        id: true,
                        questionId: true,
                        selectedOptionId: true,
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
            409,
            "This exam has already been submitted."
        );
    }


    const attemptDeadline = getAttemptDeadline(
        attempt.startedAt,
        attempt.exam.duration,
        attempt.exam.endTime
    );

    const expired = isAttemptExpired(
        attempt.startedAt,
        attempt.exam.duration,
        attempt.exam.endTime
    );

    return {
        ...attempt,
        attemptDeadline,
        isExpired: expired,
    };
};

/**
 * Save or update a student's answer
 */
const saveAnswer = async (
    examId,
    studentId,
    payload
) => {
    const {
        questionId,
        selectedOptionId,
    } = payload;

    // Check active exam attempt
    const attempt =
        await prisma.examAttempt.findUnique({
            where: {
                examId_studentId: {
                    examId,
                    studentId,
                },
            },
            select: {
                id: true,
                startedAt: true,
                isSubmitted: true,
                exam: {
                    select: {
                        duration: true,
                        endTime: true,
                    },
                },
            },
        });

    if (!attempt) {
        throw new ApiError(
            404,
            "Exam attempt not found. Start the exam first."
        );
    }

    if (attempt.isSubmitted) {
        throw new ApiError(
            409,
            "You cannot answer a submitted exam."
        );
    }

    if (
        isAttemptExpired(
            attempt.startedAt,
            attempt.exam.duration,
            attempt.exam.endTime
        )
    ) {
        throw new ApiError(
            403,
            "Your exam attempt time has expired."
        );
    }

    // Check question belongs to this exam
    const question =
        await prisma.question.findFirst({
            where: {
                id: questionId,
                examId,
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

    if (question.options.length === 0) {
        throw new ApiError(
            400,
            "Selected option does not belong to this question."
        );
    }

    const selectedOption =
        question.options[0];

    // Save new answer or update existing answer
    const answer =
        await prisma.studentAnswer.upsert({
            where: {
                attemptId_questionId: {
                    attemptId: attempt.id,
                    questionId,
                },
            },

            update: {
                selectedOptionId,
                isCorrect:
                    selectedOption.isCorrect,
                marksAwarded:
                    selectedOption.isCorrect
                        ? question.marks
                        : 0,
            },

            create: {
                attemptId: attempt.id,
                questionId,
                selectedOptionId,
                isCorrect:
                    selectedOption.isCorrect,
                marksAwarded:
                    selectedOption.isCorrect
                        ? question.marks
                        : 0,
            },

            select: {
                id: true,
                questionId: true,
                selectedOptionId: true,
                createdAt: true,
            },
        });

    return answer;
};


/**
 * Record an exam security violation
 */
const recordSecurityViolation = async (
    examId,
    studentId,
    violationType
) => {
    const attempt =
        await prisma.examAttempt.findUnique({
            where: {
                examId_studentId: {
                    examId,
                    studentId,
                },
            },

            select: {
                id: true,
                isSubmitted: true,
                startedAt: true,

                exam: {
                    select: {
                        duration: true,
                        endTime: true,
                    },
                },
            },
        });

    if (!attempt) {
        throw new ApiError(
            404,
            "Exam attempt not found. Start the exam first."
        );
    }

    if (attempt.isSubmitted) {
        throw new ApiError(
            409,
            "Security violations cannot be recorded after exam submission."
        );
    }

    if (
        isAttemptExpired(
            attempt.startedAt,
            attempt.exam.duration,
            attempt.exam.endTime
        )
    ) {
        throw new ApiError(
            403,
            "Your exam attempt time has expired."
        );
    }

    let updateData;

    if (
        violationType ===
        "TAB_SWITCH"
    ) {
        updateData = {
            tabSwitchCount: {
                increment: 1,
            },
        };
    } else if (
        violationType ===
        "FULLSCREEN_EXIT"
    ) {
        updateData = {
            fullscreenExitCount: {
                increment: 1,
            },
        };
    } else {
        throw new ApiError(
            400,
            "Invalid security violation type."
        );
    }

    const updatedAttempt =
        await prisma.examAttempt.update({
            where: {
                id: attempt.id,
            },

            data: updateData,

            select: {
                id: true,
                tabSwitchCount: true,
                fullscreenExitCount: true,
            },
        });

    return updatedAttempt;
};


/**
 * Submit exam and generate result
 */
const submitExam = async (
    examId,
    studentId
) => {
    const attempt =
        await prisma.examAttempt.findUnique({
            where: {
                examId_studentId: {
                    examId,
                    studentId,
                },
            },

            include: {
                exam: {
                    select: {
                        id: true,
                        totalMarks: true,
                        passingMarks: true,
                    },
                },

                answers: {
                    select: {
                        marksAwarded: true,
                    },
                },
            },
        });

    if (!attempt) {
        throw new ApiError(
            404,
            "Exam attempt not found. Start the exam first."
        );
    }

    if (attempt.isSubmitted) {
        throw new ApiError(
            409,
            "This exam has already been submitted."
        );
    }

    const score = attempt.answers.reduce(
        (total, answer) =>
            total + answer.marksAwarded,
        0
    );

    const totalMarks =
        attempt.exam.totalMarks;

    const percentage =
        totalMarks > 0
            ? Number(
                (
                    (score / totalMarks) *
                    100
                ).toFixed(2)
            )
            : 0;

    const isPassed =
        score >= attempt.exam.passingMarks;

    const result =
        await prisma.$transaction(
            async (transaction) => {
                await transaction.examAttempt.update({
                    where: {
                        id: attempt.id,
                    },

                    data: {
                        isSubmitted: true,
                        submittedAt: new Date(),
                    },
                });

                return transaction.result.create({
                    data: {
                        examId,
                        studentId,
                        attemptId: attempt.id,
                        score,
                        totalMarks,
                        percentage,
                        isPassed,
                    },
                });
            }
        );

    return result;
};

module.exports = {
    getAvailableExams,
    startExam,
    getActiveAttempt,
    saveAnswer,
    recordSecurityViolation,
    submitExam,
};



