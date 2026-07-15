const { GoogleGenAI } = require("@google/genai");

const config = require("../../config");
const ApiError = require("../../errors/ApiError");

const questionService = require(
    "../../services/question.service"
);

const {
    buildQuestionGenerationPrompt,
} = require("./ai.prompt");

const MAX_RETRIES = 2;

const wait = (milliseconds) =>
    new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });

const getErrorMessage = (error) =>
    error?.message ||
    JSON.stringify(error) ||
    "";

const isHighDemandError = (error) => {
    const errorMessage =
        getErrorMessage(error).toLowerCase();

    return (
        errorMessage.includes("503") ||
        errorMessage.includes("unavailable") ||
        errorMessage.includes("high demand")
    );
};

const isQuotaError = (error) => {
    const errorMessage =
        getErrorMessage(error).toLowerCase();

    return (
        errorMessage.includes("429") ||
        errorMessage.includes("quota")
    );
};

const generateContentWithRetry = async (
    ai,
    prompt
) => {
    for (
        let attempt = 0;
        attempt <= MAX_RETRIES;
        attempt += 1
    ) {
        try {
            return await ai.models.generateContent({
                model: config.GEMINI_MODEL,
                contents: prompt,
                config: {
                    responseMimeType:
                        "application/json",
                    temperature: 0.7,
                },
            });
        } catch (error) {
            const shouldRetry =
                isHighDemandError(error) &&
                attempt < MAX_RETRIES;

            if (!shouldRetry) {
                throw error;
            }

            const delay =
                1500 * (attempt + 1);

            console.warn(
                `Gemini is temporarily busy. Retrying request ${attempt + 1}/${MAX_RETRIES} in ${delay}ms.`
            );

            await wait(delay);
        }
    }

    throw new ApiError(
        503,
        "AI service is currently unavailable."
    );
};

const validateGeneratedQuestions = (
    questions,
    questionType,
    expectedCount
) => {
    if (!Array.isArray(questions)) {
        throw new ApiError(
            502,
            "AI returned an invalid questions format."
        );
    }

    if (questions.length !== expectedCount) {
        throw new ApiError(
            502,
            "AI did not generate the requested number of questions."
        );
    }

    questions.forEach((question, index) => {
        const expectedOptions =
            questionType === "MCQ" ? 4 : 2;

        if (
            !question.questionText ||
            !question.explanation ||
            !Array.isArray(question.options)
        ) {
            throw new ApiError(
                502,
                `AI returned invalid data for question ${index + 1}.`
            );
        }

        if (
            question.options.length !==
            expectedOptions
        ) {
            throw new ApiError(
                502,
                `Question ${index + 1} has an invalid number of options.`
            );
        }

        const correctOptions =
            question.options.filter(
                (option) =>
                    option.isCorrect === true
            );

        if (correctOptions.length !== 1) {
            throw new ApiError(
                502,
                `Question ${index + 1} must have exactly one correct option.`
            );
        }
    });
};

const generateQuestions = async (payload) => {
    if (!config.GEMINI_API_KEY) {
        throw new ApiError(
            500,
            "Gemini API key is not configured."
        );
    }

    const ai = new GoogleGenAI({
        apiKey: config.GEMINI_API_KEY,
    });

    const prompt =
        buildQuestionGenerationPrompt(payload);

    try {
        const response =
            await generateContentWithRetry(
                ai,
                prompt
            );

        const responseText =
            response.text;

        if (!responseText) {
            throw new ApiError(
                502,
                "AI returned an empty response."
            );
        }

        let parsedResponse;

        try {
            parsedResponse =
                JSON.parse(responseText);
        } catch {
            throw new ApiError(
                502,
                "AI returned invalid JSON."
            );
        }

        validateGeneratedQuestions(
            parsedResponse.questions,
            payload.questionType,
            payload.numberOfQuestions
        );

        return {
            topic:
                payload.topic,

            difficulty:
                payload.difficulty,

            questionType:
                payload.questionType,

            totalGenerated:
                parsedResponse.questions.length,

            questions:
                parsedResponse.questions,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        const errorMessage =
            getErrorMessage(error);

        if (isQuotaError(error)) {
            throw new ApiError(
                429,
                "Free AI usage limit has been reached. Please try again later."
            );
        }

        if (isHighDemandError(error)) {
            console.error(
                "Gemini remained unavailable after automatic retries:",
                errorMessage
            );

            throw new ApiError(
                503,
                "AI service is currently busy due to high demand. Please try again shortly."
            );
        }

        console.error(
            "Gemini question generation error:",
            errorMessage
        );

        throw new ApiError(
            502,
            "Unable to generate questions using AI. Please try again."
        );
    }
};

const saveGeneratedQuestions = async (
    payload,
    user
) => {
    const {
        examId,
        questions,
    } = payload;

    const savedQuestions = [];

    for (
        const generatedQuestion
        of questions
    ) {
        const questionData = {
            question:
                generatedQuestion.questionText,

            marks:
                generatedQuestion.marks,

            explanation:
                generatedQuestion.explanation ||
                "",

            options:
                generatedQuestion.options.map(
                    (option) => ({
                        option:
                            option.text,

                        isCorrect:
                            option.isCorrect,
                    })
                ),
        };

        const savedQuestion =
            await questionService.createQuestion(
                examId,
                user,
                questionData
            );

        savedQuestions.push(
            savedQuestion
        );
    }

    return {
        examId,

        totalSaved:
            savedQuestions.length,

        questions:
            savedQuestions,
    };
};

module.exports = {
    generateQuestions,
    saveGeneratedQuestions,
};