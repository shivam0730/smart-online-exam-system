const prisma = require("../../lib/prisma");

const createExam = (data) => {
    return prisma.exam.create({
        data,
    });
};


const findExamById = (id) => {
    return prisma.exam.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
};


const findExamByTitle = (title) => {
    return prisma.exam.findFirst({
        where: {
            title,
            isDeleted: false,
        },
    });
};

const getAllExams = ({
    skip,
    take,
    search,
    status,
    orderBy,
}) => {
    return prisma.exam.findMany({
        where: {
            isDeleted: false,

            ...(search && {
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            }),

            ...(status && {
                status,
            }),
        },

    include: {
        createdBy: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            },
        },
    },

        skip,
        take,

        orderBy,
    });
};

const countExams = ({
    search,
    status,
}) => {
    return prisma.exam.count({
        where: {
            isDeleted: false,

            ...(search && {
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            }),

            ...(status && {
                status,
            }),
        },
    });
};

const updateExam = (id, data) => {
    return prisma.exam.update({
        where: {
            id,
        },

        data,
    });
};

const findExamByTitleExcludingId = (title, id) => {
    return prisma.exam.findFirst({
        where: {
            title,
            isDeleted: false,
            NOT: {
                id,
            },
        },
    });
};

const softDeleteExam = (id) => {
    return prisma.exam.update({
        where: {
            id,
        },

        data: {
            isDeleted: true,
        },
    });
};


const publishExam = (id) => {
    return prisma.exam.update({
        where: {
            id,
        },
        data: {
            status: "PUBLISHED",
        },
    });
};

const unpublishExam = (id) => {
    return prisma.exam.update({
        where: {
            id,
        },
        data: {
            status: "DRAFT",
        },
    });
};

module.exports = {
    createExam,
    findExamById,
    findExamByTitle,
    findExamByTitleExcludingId,
    getAllExams,
    countExams,
    updateExam,
    softDeleteExam,
    publishExam,
    unpublishExam,
};