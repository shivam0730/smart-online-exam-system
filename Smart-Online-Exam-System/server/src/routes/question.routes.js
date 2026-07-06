const express = require("express");

console.log("Question Routes Loaded");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");

const {
    createQuestion,
    getAllQuestions,
    getQuestionStats,
    getQuestionById,
    updateQuestion,
    updateQuestionStatus,
    duplicateQuestion,
    deleteQuestion,
} = require("../controllers/question.controller");


const {
    createQuestionSchema,
    updateQuestionSchema,
    updateQuestionStatusSchema,
} = require("../validations/question.validator");



const router = express.Router();

// Authentication
router.use(auth);

// Authorization
router.use(authorize("TEACHER", "ADMIN", "SUPER_ADMIN"));

// Create Question
router.post(
    "/exams/:examId/questions",
    validate(createQuestionSchema),
    createQuestion
);

// Get All Questions of an Exam
router.get(
    "/exams/:examId/questions",
    getAllQuestions
);

// Get Question Statistics
router.get(
    "/exams/:examId/stats",
    getQuestionStats
);

// Get Question By ID
router.get(
    "/:questionId",
    getQuestionById
);

// Update Question
router.put(
    "/:questionId",
    validate(updateQuestionSchema),
    updateQuestion
);


router.patch(
    "/questions/:questionId/status",
    validate(updateQuestionStatusSchema),
    updateQuestionStatus
);

router.post(
    "/questions/:questionId/duplicate",
    duplicateQuestion
);

// Delete Question
router.delete(
    "/:questionId",
    deleteQuestion
);

module.exports = router;