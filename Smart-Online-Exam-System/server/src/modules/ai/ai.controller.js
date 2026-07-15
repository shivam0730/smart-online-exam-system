const aiService = require("./ai.service");

const generateQuestions = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await aiService.generateQuestions(
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Questions generated successfully using AI.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateQuestions,
};