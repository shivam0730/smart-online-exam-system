const profile = async (req, res) => {

    return res.status(200).json({
        success: true,
        message: "Profile fetched successfully.",
        data: req.user,
    });

};

const adminDashboard = async (req, res) => {

    return res.status(200).json({
        success: true,
        message: "Welcome Admin",
    });

};

module.exports = {
    profile,
    adminDashboard,
};