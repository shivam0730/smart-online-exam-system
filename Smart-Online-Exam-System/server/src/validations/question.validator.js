const Joi = require("joi");

const createQuestionSchema = Joi.object({
    question: Joi.string()
        .trim()
        .min(5)
        .max(1000)
        .required(),

    marks: Joi.number()
        .integer()
        .min(1)
        .required(),

    explanation: Joi.string()
        .trim()
        .allow("")
        .optional(),

    options: Joi.array()
        .items(
            Joi.object({
                option: Joi.string()
                    .trim()
                    .min(1)
                    .max(500)
                    .required(),

                isCorrect: Joi.boolean()
                    .required(),
            })
        )
        .min(2)
        .max(6)
        .required(),
});


const updateQuestionSchema = Joi.object({
    question: Joi.string()
        .trim()
        .min(5)
        .max(1000),

    marks: Joi.number()
        .integer()
        .min(1),

    explanation: Joi.string()
        .trim()
        .allow(""),

    options: Joi.array()
        .items(
            Joi.object({
                id: Joi.string()
                    .optional(),

                option: Joi.string()
                    .trim()
                    .min(1)
                    .max(500)
                    .required(),

                isCorrect: Joi.boolean()
                    .required(),
            })
        )
        .min(2)
        .max(6),
});


const getQuestionsQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10),

    search: Joi.string()
        .trim()
        .allow("", null),

    isActive: Joi.boolean(),

    sortBy: Joi.string()
        .valid("createdAt", "updatedAt", "marks", "order")
        .default("createdAt"),

    order: Joi.string()
        .valid("asc", "desc")
        .default("desc"),
});

const updateQuestionStatusSchema = Joi.object({
    isActive: Joi.boolean().required(),
});

module.exports = {
    createQuestionSchema,
    updateQuestionSchema,
    getQuestionsQuerySchema,
    updateQuestionStatusSchema,
};