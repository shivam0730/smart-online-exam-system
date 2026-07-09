const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const resultService = require(
    "../services/result.service"
);

/**

* Get the logged-in student's detailed exam result
  */
const getExamResult = asyncHandler(
    async (req, res) => {
        const { examId } = req.params;

        const studentId = req.user.id;

        const result =
            await resultService.getExamResult(
                examId,
                studentId
            );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Exam result fetched successfully.",
                    result
                )
            );
    }
);

/**

* Get the logged-in student's exam history
  */
const getExamHistory = asyncHandler(
    async (req, res) => {
        const studentId = req.user.id;

        const history =
            await resultService.getExamHistory(
                studentId
            );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Exam history fetched successfully.",
                    history
                )
            );
    }
);


/**

* Get the logged-in student's performance statistics
  */
const getPerformanceStatistics = asyncHandler(
    async (req, res) => {
        const studentId = req.user.id;

        const statistics =
            await resultService
                .getPerformanceStatistics(
                    studentId
                );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Performance statistics fetched successfully.",
                    statistics
                )
            );
    }
);



module.exports = {
    getExamResult,
    getExamHistory,
    getPerformanceStatistics,
};
