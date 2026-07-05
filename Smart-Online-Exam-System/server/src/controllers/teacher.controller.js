const teacherService = require("../services/teacher.service");

/*
|--------------------------------------------------------------------------
| Teacher Profile
|--------------------------------------------------------------------------
*/

const profile = async (req, res, next) => {
    try {

        const data = await teacherService.getProfile(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Teacher profile fetched successfully.",
            data,
        });

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| Teacher Dashboard
|--------------------------------------------------------------------------
*/

const dashboard = async (req, res, next) => {
    try {

        const data = await teacherService.getDashboard(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Teacher dashboard fetched successfully.",
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