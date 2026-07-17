const prisma = require("../lib/prisma");

const { hashPassword } = require("../utils/password");

const getDashboard = async () => {
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalAdmins,
    totalSuperAdmins,
    activeUsers,
    inactiveUsers,
    totalExams,
    draftExams,
    publishedExams,
    completedExams,
    archivedExams,
    totalAttempts,
    submittedAttempts,
    totalResults,
    recentUsers,
    recentExams,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "STUDENT",
      },
    }),

    prisma.user.count({
      where: {
        role: "TEACHER",
      },
    }),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    prisma.user.count({
      where: {
        role: "SUPER_ADMIN",
      },
    }),

    prisma.user.count({
      where: {
        isActive: true,
      },
    }),

    prisma.user.count({
      where: {
        isActive: false,
      },
    }),

    prisma.exam.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.exam.count({
      where: {
        status: "DRAFT",
        isDeleted: false,
      },
    }),

    prisma.exam.count({
      where: {
        status: "PUBLISHED",
        isDeleted: false,
      },
    }),

    prisma.exam.count({
      where: {
        status: "COMPLETED",
        isDeleted: false,
      },
    }),

    prisma.exam.count({
      where: {
        status: "ARCHIVED",
        isDeleted: false,
      },
    }),

    prisma.examAttempt.count(),

    prisma.examAttempt.count({
      where: {
        isSubmitted: true,
      },
    }),

    prisma.result.count(),

    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),

    prisma.exam.findMany({
      where: {
        isDeleted: false,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        status: true,
        totalMarks: true,
        passingMarks: true,
        startTime: true,
        endTime: true,
        createdAt: true,

        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

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
    userStatistics: {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalSuperAdmins,
      activeUsers,
      inactiveUsers,
    },

    examStatistics: {
      totalExams,
      draftExams,
      publishedExams,
      completedExams,
      archivedExams,
    },

    activityStatistics: {
      totalAttempts,
      submittedAttempts,
      totalResults,
    },

    recentUsers,

    recentExams,
  };
};

const createTeacher = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password
  ) {
    const error = new Error(
      "First name, last name, email and password are required"
    );

    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

  if (existingUser) {
    const error = new Error(
      "Email already exists"
    );

    error.statusCode = 409;
    throw error;
  }

  const hashedPassword =
    await hashPassword(password);

  const teacher =
    await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "TEACHER",
        isActive: true,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

  return teacher;
};

const getUsers = async ({
  search = "",
  role = "",
  status = "",
  page = 1,
  limit = 10,
}) => {
  const pageNumber = Math.max(
    Number.parseInt(page, 10) || 1,
    1
  );

  const limitNumber = Math.min(
    Math.max(
      Number.parseInt(limit, 10) || 10,
      1
    ),
    100
  );

  const where = {};

  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    where.OR = [
      {
        firstName: {
          contains: trimmedSearch,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: trimmedSearch,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: trimmedSearch,
          mode: "insensitive",
        },
      },
    ];
  }

  const allowedRoles = [
    "STUDENT",
    "TEACHER",
    "ADMIN",
    "SUPER_ADMIN",
  ];

  const normalizedRole =
    role.trim().toUpperCase();

  if (
    normalizedRole &&
    allowedRoles.includes(normalizedRole)
  ) {
    where.role = normalizedRole;
  }

  const normalizedStatus =
    status.trim().toLowerCase();

  if (normalizedStatus === "active") {
    where.isActive = true;
  }

  if (normalizedStatus === "inactive") {
    where.isActive = false;
  }

  const skip =
    (pageNumber - 1) * limitNumber;

  const [users, totalUsers] =
    await Promise.all([
      prisma.user.findMany({
        where,

        skip,

        take: limitNumber,

        orderBy: {
          createdAt: "desc",
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
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

  const totalPages = Math.ceil(
    totalUsers / limitNumber
  );

  return {
    users,

    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalUsers,
      limit: limitNumber,
      hasNextPage:
        pageNumber < totalPages,
      hasPreviousPage:
        pageNumber > 1,
    },

    filters: {
      search: trimmedSearch,
      role: normalizedRole,
      status: normalizedStatus,
    },
  };
};

const updateUserStatus = async ({
  userId,
  isActive,
  currentUser,
}) => {
  if (
    typeof isActive !== "boolean"
  ) {
    const error = new Error(
      "isActive must be a boolean value"
    );

    error.statusCode = 400;

    throw error;
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

  if (!user) {
    const error = new Error(
      "User not found"
    );

    error.statusCode = 404;

    throw error;
  }

  if (
    user.id === currentUser.id
  ) {
    const error = new Error(
      "You cannot change the status of your own account"
    );

    error.statusCode = 403;

    throw error;
  }

  if (
    currentUser.role === "ADMIN" &&
    (
      user.role === "ADMIN" ||
      user.role === "SUPER_ADMIN"
    )
  ) {
    const error = new Error(
      "Admin accounts cannot modify other administrator accounts"
    );

    error.statusCode = 403;

    throw error;
  }

  if (
    user.role === "SUPER_ADMIN"
  ) {
    const error = new Error(
      "Super Admin account status cannot be changed"
    );

    error.statusCode = 403;

    throw error;
  }

  const updatedUser =
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        isActive,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

  return updatedUser;
};

const getExams = async ({
  search = "",
  status = "",
  page = 1,
  limit = 10,
}) => {
  const pageNumber = Math.max(
    Number.parseInt(page, 10) || 1,
    1
  );

  const limitNumber = Math.min(
    Math.max(
      Number.parseInt(limit, 10) || 10,
      1
    ),
    100
  );

  const trimmedSearch =
    search.trim();

  const normalizedStatus =
    status.trim().toUpperCase();

  const allowedStatuses = [
    "DRAFT",
    "PUBLISHED",
    "COMPLETED",
    "ARCHIVED",
  ];

  const where = {
    isDeleted: false,
  };

  if (trimmedSearch) {
    where.OR = [
      {
        title: {
          contains: trimmedSearch,
          mode: "insensitive",
        },
      },

      {
        description: {
          contains: trimmedSearch,
          mode: "insensitive",
        },
      },

      {
        createdBy: {
          is: {
            OR: [
              {
                firstName: {
                  contains:
                    trimmedSearch,
                  mode: "insensitive",
                },
              },

              {
                lastName: {
                  contains:
                    trimmedSearch,
                  mode: "insensitive",
                },
              },

              {
                email: {
                  contains:
                    trimmedSearch,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      },
    ];
  }

  if (
    normalizedStatus &&
    allowedStatuses.includes(
      normalizedStatus
    )
  ) {
    where.status =
      normalizedStatus;
  }

  const skip =
    (pageNumber - 1) *
    limitNumber;

  const [exams, totalExams] =
    await Promise.all([
      prisma.exam.findMany({
        where,

        skip,

        take: limitNumber,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          title: true,
          description: true,
          instructions: true,
          duration: true,
          totalMarks: true,
          passingMarks: true,
          status: true,
          startTime: true,
          endTime: true,
          createdAt: true,
          updatedAt: true,

          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },

          _count: {
            select: {
              questions: true,
              attempts: true,
              results: true,
            },
          },
        },
      }),

      prisma.exam.count({
        where,
      }),
    ]);

  const totalPages =
    Math.ceil(
      totalExams /
        limitNumber
    );

  return {
    exams,

    pagination: {
      currentPage:
        pageNumber,

      totalPages,

      totalExams,

      limit:
        limitNumber,

      hasNextPage:
        pageNumber <
        totalPages,

      hasPreviousPage:
        pageNumber > 1,
    },

    filters: {
      search:
        trimmedSearch,

      status:
        normalizedStatus,
    },
  };
};


const getExamById = async (
  examId
) => {
  const exam =
    await prisma.exam.findFirst({
      where: {
        id: examId,
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
        status: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        updatedAt: true,

        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        questions: {
          where: {
            isActive: true,
          },

          orderBy: {
            createdAt: "asc",
          },

          select: {
            id: true,
            question: true,
            explanation: true,
            marks: true,
            isActive: true,
            createdAt: true,

            options: {
              select: {
                id: true,
                option: true,
              },
            },
          },
        },

        _count: {
          select: {
            questions: true,
            attempts: true,
            results: true,
          },
        },
      },
    });

  if (!exam) {
    const error =
      new Error(
        "Exam not found"
      );

    error.statusCode = 404;

    throw error;
  }

  return exam;
};


const archiveExam = async (
  examId
) => {
  const exam =
    await prisma.exam.findFirst({
      where: {
        id: examId,
        isDeleted: false,
      },

      select: {
        id: true,
        title: true,
        status: true,
      },
    });

  if (!exam) {
    const error =
      new Error(
        "Exam not found"
      );

    error.statusCode = 404;

    throw error;
  }

  if (
    exam.status ===
    "ARCHIVED"
  ) {
    const error =
      new Error(
        "Exam is already archived"
      );

    error.statusCode = 400;

    throw error;
  }

  const updatedExam =
    await prisma.exam.update({
      where: {
        id: examId,
      },

      data: {
        status:
          "ARCHIVED",
      },

      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    });

  return updatedExam;
};


const deleteExam = async (
  examId
) => {
  const exam =
    await prisma.exam.findFirst({
      where: {
        id: examId,
        isDeleted: false,
      },

      select: {
        id: true,
        title: true,
        status: true,

        _count: {
          select: {
            attempts: true,
            results: true,
          },
        },
      },
    });

  if (!exam) {
    const error =
      new Error(
        "Exam not found"
      );

    error.statusCode = 404;

    throw error;
  }

  const deletedExam =
    await prisma.exam.update({
      where: {
        id: examId,
      },

      data: {
        isDeleted: true,
      },

      select: {
        id: true,
        title: true,
        isDeleted: true,
        updatedAt: true,
      },
    });

  return deletedExam;
};

const getResults = async ({
  search = "",
  status = "",
  page = 1,
  limit = 10,
}) => {
  const pageNumber = Math.max(
    Number.parseInt(page, 10) || 1,
    1
  );

  const limitNumber = Math.min(
    Math.max(
      Number.parseInt(limit, 10) || 10,
      1
    ),
    100
  );

  const trimmedSearch =
    search.trim();

  const normalizedStatus =
    status.trim().toLowerCase();

  const where = {};

  if (trimmedSearch) {
    where.OR = [
      {
        student: {
          is: {
            OR: [
              {
                firstName: {
                  contains:
                    trimmedSearch,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains:
                    trimmedSearch,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains:
                    trimmedSearch,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      },

      {
        exam: {
          is: {
            title: {
              contains:
                trimmedSearch,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  if (
    normalizedStatus === "passed"
  ) {
    where.isPassed = true;
  }

  if (
    normalizedStatus === "failed"
  ) {
    where.isPassed = false;
  }

  const skip =
    (pageNumber - 1) *
    limitNumber;

  const [
    results,
    totalResults,
    passedResults,
    failedResults,
  ] = await Promise.all([
    prisma.result.findMany({
      where,

      skip,

      take: limitNumber,

      orderBy: {
        createdAt: "desc",
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

            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    }),

    prisma.result.count({
      where,
    }),

    prisma.result.count({
      where: {
        ...where,
        isPassed: true,
      },
    }),

    prisma.result.count({
      where: {
        ...where,
        isPassed: false,
      },
    }),
  ]);

  const totalPages =
    Math.ceil(
      totalResults /
        limitNumber
    );

  return {
    results,

    summary: {
      totalResults,
      passedResults,
      failedResults,
    },

    pagination: {
      currentPage:
        pageNumber,

      totalPages,

      totalResults,

      limit:
        limitNumber,

      hasNextPage:
        pageNumber <
        totalPages,

      hasPreviousPage:
        pageNumber > 1,
    },

    filters: {
      search:
        trimmedSearch,

      status:
        normalizedStatus,
    },
  };
};

const getResultById = async (
  resultId
) => {
  const result =
    await prisma.result.findUnique({
      where: {
        id: resultId,
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
            description: true,
            duration: true,
            totalMarks: true,
            passingMarks: true,
            status: true,
            startTime: true,
            endTime: true,

            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },

        attempt: {
          select: {
            id: true,
            startedAt: true,
            submittedAt: true,
            isSubmitted: true,
            tabSwitchCount: true,
            fullscreenExitCount: true,

            answers: {
              orderBy: {
                createdAt: "asc",
              },

              select: {
                id: true,
                isCorrect: true,
                marksAwarded: true,
                createdAt: true,

                question: {
                  select: {
                    id: true,
                    question: true,
                    marks: true,
                    explanation: true,

                    options: {
                      orderBy: {
                        createdAt: "asc",
                      },

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
                    isCorrect: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!result) {
    const error =
      new Error(
        "Result not found"
      );

    error.statusCode = 404;

    throw error;
  }

  return result;
};

module.exports = {
  getDashboard,
  getUsers,
  createTeacher,
  updateUserStatus,
  getExams,
  getExamById,
  archiveExam,
  deleteExam,
  getResults,
  getResultById,
};