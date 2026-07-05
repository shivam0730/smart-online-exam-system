const express = require("express");

const examController = require("./exam.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const validateMiddleware = require("../../middleware/validate.middleware");

const {
    createExamSchema,
} = require("./exam.validation");

const router = express.Router();

router.post(
    "/",
    authMiddleware,

    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "TEACHER"
    ),
    
    validateMiddleware(createExamSchema),
    examController.createExam
);

router.get(
    "/",
    authMiddleware,
    examController.getAllExams
);

router.get(
    "/:id",
    authMiddleware,
    examController.getExamById
);

module.exports = router;