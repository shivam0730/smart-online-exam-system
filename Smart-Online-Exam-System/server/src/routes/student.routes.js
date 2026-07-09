const express = require("express");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const validateMiddleware = require(
    "../middleware/validate.middleware"
);

const {
    saveAnswerSchema,
} = require("../validations/student.validator");

const {
    profile,
    dashboard,
    availableExams,
    examDetails,
    startExam,
    saveAnswer,
    submitExam,
} = require("../controllers/student.controller");

const router = express.Router();

router.use(auth);

router.use(authorize("STUDENT"));

router.get(
    "/profile",
    profile
);

router.get(
    "/dashboard",
    dashboard
);

router.get(
    "/exams",
    availableExams
);

router.get(
    "/exams/:examId",
    examDetails
);

router.post(
    "/exams/:examId/start",
    startExam
);

router.put(
    "/attempts/:attemptId/answers",
    validateMiddleware(saveAnswerSchema),
    saveAnswer
);


router.post(
    "/attempts/:attemptId/submit",
    submitExam
);


module.exports = router;