const express = require("express");

const healthRoutes = require("./health.routes");
const authRoutes = require("../modules/auth/auth.routes");

const userRoutes = require("./user.routes");

const studentRoutes = require("./student.routes");

const studentExamRoutes = require("./studentExam.routes");

const resultRoutes = require("./result.routes");

const teacherResultRoutes = require("./teacherResult.routes");

const teacherRoutes = require("./teacher.routes");

const questionRoutes = require("./question.routes");

const examRoutes = require("../modules/exam/exam.routes");

const router = express.Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/student/exams", studentExamRoutes);
router.use("/student/results", resultRoutes);
router.use("/student", studentRoutes);
router.use("/teacher",teacherResultRoutes);
router.use("/teacher", teacherRoutes);
router.use("/teacher", questionRoutes);
router.use("/exams", examRoutes);


module.exports = router;