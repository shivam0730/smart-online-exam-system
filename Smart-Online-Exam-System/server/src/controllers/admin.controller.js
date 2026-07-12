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

module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
};