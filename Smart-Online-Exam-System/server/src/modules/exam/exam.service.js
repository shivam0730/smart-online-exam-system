const examRepository = require("./exam.repository");
const { EXAM_STATUS } = require("./exam.constants");
const ApiError = require("../../errors/ApiError");

const createExam = async (payload, user) => {
    // Check duplicate title
    const existingExam = await examRepository.findExamByTitle(payload.title);

    if (existingExam) {
        throw new ApiError(409, "Exam with this title already exists.");
    }

    const examData = {
        ...payload,
        createdById: user.id,
        status: EXAM_STATUS.DRAFT,
    };

    return examRepository.createExam(examData);
};

const getExamById = async (id) => {
    const exam = await examRepository.findExamById(id);

    if (!exam) {
        throw new ApiError(404, "Exam not found.");
    }

    return exam;
};



const getAllExams = async (query) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

    const skip = (page - 1) * limit;

    const search = query.search?.trim() || "";
    const status = query.status;

    const sortField = query.sortBy || "createdAt";
    const sortOrder = query.order === "asc" ? "asc" : "desc";

    const orderBy = {
        [sortField]: sortOrder,
    };

    const exams = await examRepository.getAllExams({
        skip,
        take: limit,
        search,
        status,
        orderBy,
    });

    const total = await examRepository.countExams({
        search,
        status,
    });

    return {
        items: exams,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};



module.exports = {
    createExam,
    getExamById,
    getAllExams,
};