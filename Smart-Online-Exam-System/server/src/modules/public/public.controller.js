const publicService = require("./public.service");

const getHomeData = async (req, res, next) => {
    try {
        const data = await publicService.getHomeData();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHomeData,
};