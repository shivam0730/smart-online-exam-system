const adminService = require("../services/admin.service");

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await adminService.getDashboard();

    return res.status(200).json({
      success: true,
      message: "Admin dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const usersData =
      await adminService.getUsers({
        search: req.query.search,
        role: req.query.role,
        status: req.query.status,
        page: req.query.page,
        limit: req.query.limit,
      });

    return res.status(200).json({
      success: true,
      message:
        "Users fetched successfully",
      data: usersData,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (
  req,
  res,
  next
) => {
  try {
    const updatedUser =
      await adminService.updateUserStatus({
        userId: req.params.userId,

        isActive:
          req.body.isActive,

        currentUser: req.user,
      });

    return res.status(200).json({
      success: true,

      message: updatedUser.isActive
        ? "User account activated successfully"
        : "User account deactivated successfully",

      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const getExams = async (
  req,
  res,
  next
) => {
  try {
    const examsData =
      await adminService.getExams({
        search:
          req.query.search,

        status:
          req.query.status,

        page:
          req.query.page,

        limit:
          req.query.limit,
      });

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Exams fetched successfully",

        data: examsData,
      });
  } catch (error) {
    next(error);
  }
};


const getExamById = async (
  req,
  res,
  next
) => {
  try {
    const exam =
      await adminService.getExamById(
        req.params.examId
      );

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Exam details fetched successfully",

        data: exam,
      });
  } catch (error) {
    next(error);
  }
};


const archiveExam = async (
  req,
  res,
  next
) => {
  try {
    const archivedExam =
      await adminService.archiveExam(
        req.params.examId
      );

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Exam archived successfully",

        data:
          archivedExam,
      });
  } catch (error) {
    next(error);
  }
};


const deleteExam = async (
  req,
  res,
  next
) => {
  try {
    const deletedExam =
      await adminService.deleteExam(
        req.params.examId
      );

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Exam deleted successfully",

        data:
          deletedExam,
      });
  } catch (error) {
    next(error);
  }
};

const getResults = async (
  req,
  res,
  next
) => {
  try {
    const resultsData =
      await adminService.getResults({
        search:
          req.query.search,

        status:
          req.query.status,

        page:
          req.query.page,

        limit:
          req.query.limit,
      });

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Results fetched successfully",

        data:
          resultsData,
      });
  } catch (error) {
    next(error);
  }
};

const getResultById = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await adminService.getResultById(
        req.params.resultId
      );

    return res
      .status(200)
      .json({
        success: true,

        message:
          "Result details fetched successfully",

        data: result,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
  getExams,
  getExamById,
  archiveExam,
  deleteExam,
  getResults,
  getResultById,
};