const express = require("express");

const aiController = require("./ai.controller");

const authMiddleware = require(
    "../../middleware/auth.middleware"
);

const roleMiddleware = require(
    "../../middleware/role.middleware"
);

const validateMiddleware = require(
    "../../middleware/validate.middleware"
);

const {
    generateQuestionsSchema,
    saveGeneratedQuestionsSchema,
} = require("./ai.validation");

const router = express.Router();

router.post(
    "/questions/generate",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "TEACHER"
    ),
    validateMiddleware(
        generateQuestionsSchema
    ),
    aiController.generateQuestions
);

router.post(
    "/questions/save",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "ADMIN",
        "TEACHER"
    ),
    validateMiddleware(
        saveGeneratedQuestionsSchema
    ),
    aiController.saveGeneratedQuestions
);

module.exports = router;