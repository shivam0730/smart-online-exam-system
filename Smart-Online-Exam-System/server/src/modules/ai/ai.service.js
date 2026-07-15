const { GoogleGenAI } = require("@google/genai");

const config = require("../../config");
const ApiError = require("../../errors/ApiError");

const {
    buildQuestionGenerationPrompt,
} = require("./ai.prompt");

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

        if (question.options.length !== expectedOptions) {
            throw new ApiError(
                502,
                `Question ${index + 1} has an invalid number of options.`
            );
        }

        const correctOptions = question.options.filter(
            (option) => option.isCorrect === true
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
            await ai.models.generateContent({
                model: config.GEMINI_MODEL,
                contents: prompt,
                config: {
                    responseMimeType:
                        "application/json",
                    temperature: 0.7,
                },
            });

        const responseText = response.text;

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
            topic: payload.topic,
            difficulty: payload.difficulty,
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
            error?.message || "";

        if (
            errorMessage.includes("429") ||
            errorMessage
                .toLowerCase()
                .includes("quota")
        ) {
            throw new ApiError(
                429,
                "Free AI usage limit has been reached. Please try again later."
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

module.exports = {
    generateQuestions,
};