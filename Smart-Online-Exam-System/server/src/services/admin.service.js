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

module.exports = {
  getDashboard,
};

