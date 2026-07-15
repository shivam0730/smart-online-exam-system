const Joi = require("joi");

const createExamSchema = Joi.object({
    title: Joi.string().trim().min(5).max(100).required(),

    description: Joi.string().allow("", null),

    instructions: Joi.string().allow("", null),

    duration: Joi.number().integer().min(1).max(600).required(),

    totalMarks: Joi.number().integer().min(1).required(),

    passingMarks: Joi.number()
        .integer()
        .min(1)
        .required(),

    startTime: Joi.date().required(),

    endTime: Joi.date().greater(Joi.ref("startTime")).required(),
}).custom((value, helpers) => {
    if (value.passingMarks > value.totalMarks) {
        return helpers.message(
            "Passing marks cannot be greater than total marks."
        );
    }

    return value;
});

const updateExamSchema = Joi.object({
    title: Joi.string().trim().min(5).max(100),

    description: Joi.string().allow("", null),

    instructions: Joi.string().allow("", null),

    duration: Joi.number().integer().min(1).max(600),

    totalMarks: Joi.number().integer().min(1),

    passingMarks: Joi.number().integer().min(1),

    startTime: Joi.date(),

    endTime: Joi.date(),

    status: Joi.string().valid(
        "DRAFT",
        "PUBLISHED",
        "COMPLETED",
        "ARCHIVED"
    ),
}).custom((value, helpers) => {
    if (
        value.totalMarks !== undefined &&
        value.passingMarks !== undefined &&
        value.passingMarks > value.totalMarks
    ) {
        return helpers.message(
            "Passing marks cannot be greater than total marks."
        );
    }

    return value;
});

module.exports = {
    createExamSchema,
    updateExamSchema,
};