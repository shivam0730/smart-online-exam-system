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

const securityViolationSchema = Joi.object({
    type: Joi.string()
        .valid(
            "TAB_SWITCH",
            "FULLSCREEN_EXIT"
        )
        .required()
        .messages({
            "any.only":
                "Violation type must be TAB_SWITCH or FULLSCREEN_EXIT.",
            "any.required":
                "Violation type is required.",
        }),
});

module.exports = {
    saveAnswerSchema,
    securityViolationSchema,
};