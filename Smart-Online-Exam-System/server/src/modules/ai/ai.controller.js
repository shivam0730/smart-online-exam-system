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

const saveGeneratedQuestions = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await aiService.saveGeneratedQuestions(
                req.body,
                req.user
            );

        return res.status(201).json({
            success: true,
            message:
                `${result.totalSaved} AI-generated questions saved successfully.`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateQuestions,
    saveGeneratedQuestions,
};