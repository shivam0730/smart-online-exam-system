const express = require("express");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  getDashboard,
  getUsers,
  createTeacher,
  updateUserStatus,
  getExams,
  getExamById,
  archiveExam,
  deleteExam,
  getResults,
  getResultById,
} = require("../controllers/admin.controller");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication & Authorization
|--------------------------------------------------------------------------
*/

router.use(auth);
router.use(
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  )
);

/*
|--------------------------------------------------------------------------
| Admin Dashboard Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  getDashboard
);

/*
|--------------------------------------------------------------------------
| Admin User Management Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/users",
  getUsers
);

router.post(
  "/users/teachers",
  createTeacher
);

router.patch(
  "/users/:userId/status",
  updateUserStatus
);

/*
|--------------------------------------------------------------------------
| Admin Exam Management Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/exams",
  getExams
);

router.get(
  "/exams/:examId",
  getExamById
);

router.patch(
  "/exams/:examId/archive",
  archiveExam
);

router.delete(
  "/exams/:examId",
  deleteExam
);

/*
|--------------------------------------------------------------------------
| Admin Result Monitoring Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/results",
  getResults
);

router.get(
  "/results/:resultId",
  getResultById
);

module.exports = router;