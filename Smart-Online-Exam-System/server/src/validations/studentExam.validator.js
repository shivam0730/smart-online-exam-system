const Joi = require("joi");

const saveAnswerSchema = Joi.object({
    questionId: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Question ID is required.",
            "any.required": "Question ID is required.",
        }),

    selectedOptionId: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty":
                "Selected option ID is required.",
            "any.required":
                "Selected option ID is required.",
        }),
});

module.exports = {
    saveAnswerSchema,
};