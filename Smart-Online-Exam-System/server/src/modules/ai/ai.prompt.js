const buildQuestionGenerationPrompt = ({
  topic,
  difficulty,
  questionType,
  numberOfQuestions,
}) => {
  const optionInstructions =
    questionType === "MCQ"
      ? `
- Each question must have exactly four options.
- Each option must contain:
  - "text": the option text
  - "isCorrect": true or false
- Exactly one option must have "isCorrect": true.
`
      : `
- Each question must have exactly two options:
  - True
  - False
- Each option must contain:
  - "text": the option text
  - "isCorrect": true or false
- Exactly one option must have "isCorrect": true.
`;

  return `
Generate ${numberOfQuestions} unique ${difficulty.toLowerCase()}-difficulty
${questionType} questions about "${topic}".

Requirements:
- Questions must be factually correct.
- Questions must be clear and unambiguous.
- Do not generate duplicate questions.
- Do not include markdown formatting.
- Return only valid JSON.
- Do not include any text before or after the JSON.
${optionInstructions}
- Each question must include:
  - "questionText"
  - "questionType"
  - "difficulty"
  - "marks"
  - "explanation"
  - "options"

Use this exact JSON structure:

{
  "questions": [
    {
      "questionText": "Question text",
      "questionType": "${questionType}",
      "difficulty": "${difficulty}",
      "marks": 1,
      "explanation": "Short explanation of the correct answer",
      "options": [
        {
          "text": "Option text",
          "isCorrect": false
        }
      ]
    }
  ]
}
`.trim();
};

module.exports = {
  buildQuestionGenerationPrompt,
};