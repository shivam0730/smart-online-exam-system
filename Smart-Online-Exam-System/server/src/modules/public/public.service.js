const prisma = require("../../lib/prisma");

const getHomeData = async () => {

    // Count registered students
    const totalStudents = prisma.user.count({
        where: {
            role: "STUDENT",
            isActive: true,
        },
    });

    // Count registered teachers
    const totalTeachers = prisma.user.count({
        where: {
            role: "TEACHER",
            isActive: true,
        },
    });

    // Count published exams
    const totalPublishedExams = prisma.exam.count({
        where: {
            status: "PUBLISHED",
            isDeleted: false,
        },
    });

    // Count questions
    const totalQuestions = prisma.question.count();

    // Get latest published exams
    const latestExams = prisma.exam.findMany({
        where: {
            status: "PUBLISHED",
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
            createdAt: true,
        },
    });

    // Fetch all results for pass rate calculation
    const results = prisma.result.findMany({
        select: {
            isPassed: true,
        },
    });

    const [
        students,
        teachers,
        publishedExams,
        questions,
        recentExams,
        examResults,
    ] = await Promise.all([
        totalStudents,
        totalTeachers,
        totalPublishedExams,
        totalQuestions,
        latestExams,
        results,
    ]);

    const totalAttempts = examResults.length;

    const passedAttempts = examResults.filter(
        (result) => result.isPassed
    ).length;

    const successRate =
        totalAttempts === 0
            ? 0
            : Math.round((passedAttempts / totalAttempts) * 100);

    return {
        statistics: {
            students,
            teachers,
            publishedExams,
            questions,
            successRate,
        },
        recentExams,
    };
};

module.exports = {
    getHomeData,
};