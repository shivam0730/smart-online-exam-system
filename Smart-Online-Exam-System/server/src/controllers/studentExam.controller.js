const studentExamService = require("../services/studentExam.service");

/**
 * Get all available exams for students
 */
const getAvailableExams = async (req, res, next) => {
    try {
        const exams = await studentExamService.getAvailableExams();

        return res.status(200).json({
            success: true,
            message: "Available exams fetched successfully.",
            data: {
                exams,
                count: exams.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Start an exam attempt
 */
const startExam = async (req, res, next) => {
    try {
        const { examId } = req.params;

        const studentId = req.user.id;

        const attempt =
            await studentExamService.startExam(
                examId,
                studentId
            );

        return res.status(201).json({
            success: true,
            message: "Exam started successfully.",
            data: {
                attempt,
            },
        });
    } catch (error) {
        next(error);
    }
};


/**
 * Get student's active exam attempt
 */
const getActiveAttempt = async (req, res, next) => {
    try {
        const { examId } = req.params;

        const studentId = req.user.id;

        const attempt =
            await studentExamService.getActiveAttempt(
                examId,
                studentId
            );

        return res.status(200).json({
            success: true,
            message:
                "Active exam attempt fetched successfully.",
            data: {
                attempt,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Save or update student's answer
 */
const saveAnswer = async (req, res, next) => {
    try {
        const { examId } = req.params;

        const studentId = req.user.id;

        const answer =
            await studentExamService.saveAnswer(
                examId,
                studentId,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Answer saved successfully.",
            data: {
                answer,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Submit exam and generate result
 */
const submitExam = async (req, res, next) => {
    try {
        const { examId } = req.params;

        const studentId = req.user.id;

        const result =
            await studentExamService.submitExam(
                examId,
                studentId
            );

        return res.status(200).json({
            success: true,
            message:
                "Exam submitted successfully.",
            data: {
                result,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAvailableExams,
    startExam,
    getActiveAttempt,
    saveAnswer,
    submitExam,
};