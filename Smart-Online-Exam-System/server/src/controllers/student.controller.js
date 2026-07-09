const studentService = require("../services/student.service");

const profile = async (req, res, next) => {
    try {

        const data = await studentService.getProfile(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Student profile fetched successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};

const dashboard = async (req, res, next) => {
    try {

        const data = await studentService.getDashboard(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Student dashboard fetched successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};


const availableExams = async (req, res, next) => {
    try {
        const data = await studentService.getAvailableExams(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Available exams fetched successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};

const examDetails = async (req, res, next) => {
    try {
        const data = await studentService.getExamById(
            req.params.examId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Exam details fetched successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};


const startExam = async (req, res, next) => {
    try {
        const data = await studentService.startExam(
            req.params.examId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: data.resumed
                ? "Exam attempt resumed successfully."
                : "Exam started successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};


const saveAnswer = async (req, res, next) => {
    try {
        const data = await studentService.saveAnswer(
            req.params.attemptId,
            req.user.id,
            req.body.questionId,
            req.body.selectedOptionId
        );

        return res.status(200).json({
            success: true,
            message: "Answer saved successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};

const submitExam = async (req, res, next) => {
    try {
        const data = await studentService.submitExam(
            req.params.attemptId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Exam submitted successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    profile,
    dashboard,
    availableExams,
    examDetails,
    startExam,
    saveAnswer,
    submitExam,
};