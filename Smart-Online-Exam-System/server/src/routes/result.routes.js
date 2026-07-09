const express = require("express");

const resultController = require(
    "../controllers/result.controller"
);

const auth = require(
    "../middleware/auth.middleware"
);

const authorize = require(
    "../middleware/authorize.middleware"
);

const router = express.Router();

/**

* Get the logged-in student's exam history
  */
router.get(
    "/history",
    auth,
    authorize("STUDENT"),
    resultController.getExamHistory
);

/**

* Get the logged-in student's performance statistics
  */
router.get(
    "/statistics",
    auth,
    authorize("STUDENT"),
    resultController.getPerformanceStatistics
);




/**
* Get the logged-in student's result
* for a specific exam
  */
router.get(
    "/exams/:examId",
    auth,
    authorize("STUDENT"),
    resultController.getExamResult
);

module.exports = router;
