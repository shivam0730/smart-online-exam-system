const Joi = require("joi");

const {
    AI_QUESTION_TYPES,
    AI_DIFFICULTY_LEVELS,
    AI_LIMITS,
} = require("./ai.constants");

const generateQuestionsSchema = Joi.object({
    topic: Joi.string()
        .trim()
        .min(AI_LIMITS.MIN_TOPIC_LENGTH)
        .max(AI_LIMITS.MAX_TOPIC_LENGTH)
        .required(),

    difficulty: Joi.string()
        .valid(...Object.values(AI_DIFFICULTY_LEVELS))
        .required(),

    questionType: Joi.string()
        .valid(...Object.values(AI_QUESTION_TYPES))
        .required(),

    numberOfQuestions: Joi.number()
        .integer()
        .min(AI_LIMITS.MIN_QUESTIONS)
        .max(AI_LIMITS.MAX_QUESTIONS)
        .required(),
});

module.exports = {
    generateQuestionsSchema,
};