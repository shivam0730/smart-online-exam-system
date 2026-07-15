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

const saveGeneratedQuestionsSchema = Joi.object({
    examId: Joi.string()
        .trim()
        .required(),

    questions: Joi.array()
        .items(
            Joi.object({
                questionText: Joi.string()
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
                            text: Joi.string()
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
            })
        )
        .min(1)
        .max(AI_LIMITS.MAX_QUESTIONS)
        .required(),
});

module.exports = {
    generateQuestionsSchema,
    saveGeneratedQuestionsSchema,
};