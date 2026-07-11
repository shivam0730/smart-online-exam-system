const asyncHandler = require(
    "../utils/asyncHandler"
);

const ApiResponse = require(
    "../utils/ApiResponse"
);

const teacherResultService = require(
    "../services/teacherResult.service"
);

/*
|--------------------------------------------------------------------------
| Get All Teacher Results
|--------------------------------------------------------------------------
*/

const getAllTeacherResults =
    asyncHandler(
        async (req, res) => {
            const teacherId =
                req.user.id;

            const data =
                await teacherResultService
                    .getAllTeacherResults(
                        teacherId
                    );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Teacher results fetched successfully.",
                        data
                    )
                );
        }
    );

/*
|--------------------------------------------------------------------------
| Get Results for One Exam
|--------------------------------------------------------------------------
*/

const getExamResults =
    asyncHandler(
        async (req, res) => {
            const {
                examId,
            } = req.params;

            const teacherId =
                req.user.id;

            const data =
                await teacherResultService
                    .getExamResults(
                        examId,
                        teacherId
                    );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Exam results fetched successfully.",
                        data
                    )
                );
        }
    );

/*
|--------------------------------------------------------------------------
| Get Exam Performance Statistics
|--------------------------------------------------------------------------
*/

const getExamPerformance =
    asyncHandler(
        async (req, res) => {
            const {
                examId,
            } = req.params;

            const teacherId =
                req.user.id;

            const data =
                await teacherResultService
                    .getExamPerformance(
                        examId,
                        teacherId
                    );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        "Exam performance statistics fetched successfully.",
                        data
                    )
                );
        }
    );

module.exports = {
    getAllTeacherResults,
    getExamResults,
    getExamPerformance,
};