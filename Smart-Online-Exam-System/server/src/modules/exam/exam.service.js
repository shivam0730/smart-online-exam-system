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

const getExamById = async (id, user) => {
    const exam = await examRepository.findExamById(id);

    if (!exam) {
        throw new ApiError(404, "Exam not found.");
    }

    if (
        user.role === "TEACHER" &&
        exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized."
        );
    }

    return exam;
};


const updateExam = async (id, payload, user) => {
    const exam = await examRepository.findExamById(id);

    if (!exam) {
        throw new ApiError(404, "Exam not found.");
    }

    if (
        user.role === "TEACHER" &&
        exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized."
        );
    }

    if (exam.status === EXAM_STATUS.COMPLETED) {
        throw new ApiError(
            400,
            "Completed exams cannot be updated."
        );
    }

    if (payload.title) {
        const existingExam =
            await examRepository.findExamByTitleExcludingId(
                payload.title,
                id
            );

        if (existingExam) {
            throw new ApiError(
                409,
                "Another exam with this title already exists."
            );
        }
    }

    return examRepository.updateExam(id, payload);
};


const deleteExam = async (id, user) => {
    const exam = await examRepository.findExamById(id);

    if (!exam) {
        throw new ApiError(404, "Exam not found.");
    }

    if (
        user.role === "TEACHER" &&
        exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized."
        );
    }

    if (exam.status === EXAM_STATUS.COMPLETED) {
        throw new ApiError(
            400,
            "Completed exams cannot be deleted."
        );
    }

    await examRepository.softDeleteExam(id);

    return {
        message: "Exam deleted successfully.",
    };
};


const publishExam = async (id, user) => {
    const exam = await examRepository.findExamById(id);

    if (!exam) {
        throw new ApiError(404, "Exam not found.");
    }

    if (
        user.role === "TEACHER" &&
        exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized."
        );
    }

    if (exam.status === EXAM_STATUS.PUBLISHED) {
        throw new ApiError(
            400,
            "Exam is already published."
        );
    }

    if (exam.status === EXAM_STATUS.COMPLETED) {
        throw new ApiError(
            400,
            "Completed exam cannot be published."
        );
    }

    return examRepository.publishExam(id);
};


const unpublishExam = async (id, user) => {
    const exam = await examRepository.findExamById(id);

    if (!exam) {
        throw new ApiError(404, "Exam not found.");
    }
    if (
        user.role === "TEACHER" &&
        exam.createdById !== user.id
    ) {
        throw new ApiError(
            403,
            "You are not authorized."
        );
    }
    if (exam.status === EXAM_STATUS.DRAFT) {
        throw new ApiError(
            400,
            "Exam is already in draft state."
        );
    }

    if (exam.status === EXAM_STATUS.COMPLETED) {
        throw new ApiError(
            400,
            "Completed exam cannot be unpublished."
        );
    }

    return examRepository.unpublishExam(id);
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
    updateExam,
    deleteExam,
    publishExam,
    unpublishExam,
};