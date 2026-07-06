const questionService = require("../services/question.service");

const createQuestion = async (req, res, next) => {
    try {
        const question = await questionService.createQuestion(
            req.params.examId,
            req.user,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Question created successfully.",
            data: question,
        });
    } catch (error) {
        next(error);
    }
};

const getAllQuestions = async (req, res, next) => {
    try {
        const questions = await questionService.getAllQuestions(
            req.params.examId,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Questions fetched successfully.",
            data: questions,
        });
    } catch (error) {
        next(error);
    }
};


const getQuestionStats = async (req, res, next) => {
    try {
        const stats = await questionService.getQuestionStats(
            req.params.examId,
            req.user
        );

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Question statistics fetched successfully.",
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};


const getQuestionById = async (req, res, next) => {
    try {
        const question = await questionService.getQuestionById(
            req.params.questionId,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Question fetched successfully.",
            data: question,
        });
    } catch (error) {
        next(error);
    }
};

const updateQuestion = async (req, res, next) => {
    try {
        const question =
            await questionService.updateQuestion(
                req.params.questionId,
                req.user,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Question updated successfully.",
            data: question,
        });
    } catch (error) {
        next(error);
    }
};


const updateQuestionStatus = async (req, res, next) => {
    try {
        const question = await questionService.updateQuestionStatus(
            req.params.questionId,
            req.user,
            req.body.isActive
        );

        return res.status(200).json({
            success: true,
            message: "Question status updated successfully.",
            data: question,
        });
    } catch (error) {
        next(error);
    }
};


const duplicateQuestion = async (req, res, next) => {
    try {
        const question = await questionService.duplicateQuestion(
            req.params.questionId,
            req.user
        );

        return res.status(201).json({
            success: true,
            message: "Question duplicated successfully.",
            data: question,
        });
    } catch (error) {
        next(error);
    }
};


const deleteQuestion = async (req, res, next) => {
    try {
        await questionService.deleteQuestion(
            req.params.questionId,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Question deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
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