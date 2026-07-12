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

module.exports = {
  getDashboard,
};