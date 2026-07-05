const studentService = require("../services/student.service");

const profile = async (req, res, next) => {
    try {

        const data = await studentService.getProfile(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Student profile fetched successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};

const dashboard = async (req, res, next) => {
    try {

        const data = await studentService.getDashboard(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Student dashboard fetched successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    profile,
    dashboard,
};