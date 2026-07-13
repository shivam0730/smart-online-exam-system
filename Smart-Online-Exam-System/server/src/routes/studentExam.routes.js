const express = require("express");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const validate = require("../middleware/validate.middleware");

const {
    saveAnswerSchema,
    securityViolationSchema,
} = require("../validations/studentExam.validator");

const {
    getAvailableExams,
    startExam,
    getActiveAttempt,
    saveAnswer,
    recordSecurityViolation,
    submitExam,
} = require("../controllers/studentExam.controller");

const router = express.Router();

// Authentication
router.use(auth);

// Authorization - Student only
router.use(authorize("STUDENT"));

// Get all currently available exams
router.get(
    "/available",
    getAvailableExams
);

// Start an exam
router.post(
    "/:examId/start",
    startExam
);

// Get student's active exam attempt
router.get(
    "/:examId/attempt",
    getActiveAttempt
);

// Save or update student's answer
router.put(
    "/:examId/answer",
    validate(saveAnswerSchema),
    saveAnswer
);

// Record tab switching or fullscreen exit
router.post(
    "/:examId/security-violation",
    validate(
        securityViolationSchema
    ),
    recordSecurityViolation
);

// Submit exam and generate result
router.post(
    "/:examId/submit",
    submitExam
);

module.exports = router;