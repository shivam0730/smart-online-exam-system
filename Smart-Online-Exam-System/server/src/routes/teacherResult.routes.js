const express = require(
    "express"
);

const auth = require(
    "../middleware/auth.middleware"
);

const authorize = require(
    "../middleware/role.middleware"
);

const {
    getAllTeacherResults,
    getExamResults,
    getExamPerformance,
} = require(
    "../controllers/teacherResult.controller"
);

const router =
    express.Router();

/*
|--------------------------------------------------------------------------
| Authentication and Authorization
|--------------------------------------------------------------------------
*/

router.use(auth);

router.use(
    authorize("TEACHER")
);

/*
|--------------------------------------------------------------------------
| Teacher Result Routes
|--------------------------------------------------------------------------
*/

// Get results from all exams
// created by the logged-in teacher

router.get(
    "/results",
    getAllTeacherResults
);

// Get all student results
// for one teacher-owned exam

router.get(
    "/exams/:examId/results",
    getExamResults
);

// Get performance statistics
// for one teacher-owned exam

router.get(
    "/exams/:examId/performance",
    getExamPerformance
);

module.exports = router;