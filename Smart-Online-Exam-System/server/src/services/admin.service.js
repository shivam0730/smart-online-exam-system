const prisma = require("../lib/prisma");

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



module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
};
