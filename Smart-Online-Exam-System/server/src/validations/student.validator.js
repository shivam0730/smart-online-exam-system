const Joi = require("joi");

const saveAnswerSchema = Joi.object({
    questionId: Joi.string()
        .trim()
        .required(),

    selectedOptionId: Joi.string()
        .trim()
        .required(),
});

module.exports = {
    saveAnswerSchema,
};