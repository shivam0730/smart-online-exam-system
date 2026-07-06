const examService = require("./exam.service");

const createExam = async (req, res, next) => {
    try {
        const exam = await examService.createExam(req.body, req.user);

        return res.status(201).json({
            success: true,
            message: "Exam created successfully.",
            data: exam,
        });
    } catch (error) {
        next(error);
    }
};

const getAllExams = async (req, res, next) => {
    try {
        const result = await examService.getAllExams(req.query);

        return res.status(200).json({
            success: true,
            message: "Exams fetched successfully.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getExamById = async (req, res, next) => {
    try {
        const exam = await examService.getExamById(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Exam fetched successfully.",
            data: exam,
        });
    } catch (error) {
        next(error);
    }
};

const updateExam = async (req, res, next) => {
    try {
        const exam = await examService.updateExam(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Exam updated successfully.",
            data: exam,
        });
    } catch (error) {
        next(error);
    }
};

const deleteExam = async (req, res, next) => {
    try {
        const result = await examService.deleteExam(req.params.id);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};


const publishExam = async (req, res, next) => {
    try {
        const exam = await examService.publishExam(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Exam published successfully.",
            data: exam,
        });
    } catch (error) {
        next(error);
    }
};


const unpublishExam = async (req, res, next) => {
    try {
        const exam = await examService.unpublishExam(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Exam unpublished successfully.",
            data: exam,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
    publishExam,
    unpublishExam,
};