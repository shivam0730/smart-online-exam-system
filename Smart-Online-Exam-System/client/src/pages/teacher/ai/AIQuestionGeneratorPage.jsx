import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateAIQuestions } from "../../../services/aiService";

import styles from "./AIQuestionGeneratorPage.module.css";

const initialFormData = {
  topic: "",
  difficulty: "MEDIUM",
  questionType: "MCQ",
  numberOfQuestions: "5",
};

const AIQuestionGeneratorPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    initialFormData
  );

  const [questions, setQuestions] = useState([]);

  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const topic = formData.topic.trim();

    const numberOfQuestions = Number(
      formData.numberOfQuestions
    );

    if (topic.length < 2) {
      setError(
        "Topic must contain at least 2 characters."
      );

      return;
    }

    if (
      !Number.isInteger(numberOfQuestions) ||
      numberOfQuestions < 1 ||
      numberOfQuestions > 20
    ) {
      setError(
        "Number of questions must be between 1 and 20."
      );

      return;
    }

    try {
      setGenerating(true);

      setError("");

      setQuestions([]);

      const result = await generateAIQuestions({
        topic,
        difficulty: formData.difficulty,
        questionType: formData.questionType,
        numberOfQuestions,
      });

      setQuestions(result.questions);
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Unable to generate questions. Please try again.";

      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.header}>
          <button
            type="button"
            onClick={() =>
              navigate("/teacher/dashboard")
            }
          >
            &larr; Back to Dashboard
          </button>

          <p>
            AI Question Assistant
          </p>

          <h1>
            Generate Questions with AI
          </h1>

          <span>
            Create exam-ready questions using a
            topic, difficulty level and question
            type.
          </span>
        </header>

        <form
          className={styles.generatorCard}
          onSubmit={handleSubmit}
        >
          <div className={styles.cardHeading}>
            <span>
              AI
            </span>

            <div>
              <h2>
                Question Settings
              </h2>

              <p>
                Configure the questions you want
                Gemini to generate.
              </p>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.formGrid}>
            <div className={styles.topicField}>
              <label htmlFor="topic">
                Topic
              </label>

              <input
                id="topic"
                name="topic"
                type="text"
                value={formData.topic}
                onChange={handleChange}
                placeholder="Example: Java Object-Oriented Programming"
                minLength="2"
                maxLength="100"
                required
              />
            </div>

            <div>
              <label htmlFor="difficulty">
                Difficulty
              </label>

              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="EASY">
                  Easy
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HARD">
                  Hard
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="questionType">
                Question Type
              </label>

              <select
                id="questionType"
                name="questionType"
                value={formData.questionType}
                onChange={handleChange}
              >
                <option value="MCQ">
                  Multiple Choice
                </option>

                <option value="TRUE_FALSE">
                  True / False
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="numberOfQuestions">
                Number of Questions
              </label>

              <input
                id="numberOfQuestions"
                name="numberOfQuestions"
                type="number"
                min="1"
                max="20"
                value={
                  formData.numberOfQuestions
                }
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.generateButton}
            disabled={generating}
          >
            {generating
              ? "Generating Questions..."
              : "Generate with AI"}
          </button>
        </form>

        {questions.length > 0 && (
          <section className={styles.results}>
            <div
              className={styles.resultsHeading}
            >
              <div>
                <p>
                  AI Generated
                </p>

                <h2>
                  Question Preview
                </h2>
              </div>

              <span>
                {questions.length} Questions
              </span>
            </div>

            <div
              className={styles.questionList}
            >
              {questions.map(
                (question, questionIndex) => (
                  <article
                    className={
                      styles.questionCard
                    }
                    key={questionIndex}
                  >
                    <div
                      className={
                        styles.questionHeader
                      }
                    >
                      <span>
                        Question{" "}
                        {questionIndex + 1}
                      </span>

                      <strong>
                        {question.difficulty}
                      </strong>
                    </div>

                    <h3>
                      {question.questionText}
                    </h3>

                    <div
                      className={styles.options}
                    >
                      {question.options.map(
                        (
                          option,
                          optionIndex
                        ) => (
                          <div
                            className={
                              option.isCorrect
                                ? styles.correctOption
                                : styles.option
                            }
                            key={optionIndex}
                          >
                            <span>
                              {String.fromCharCode(
                                65 + optionIndex
                              )}
                            </span>

                            <p>
                              {option.text}
                            </p>

                            {option.isCorrect && (
                              <strong>
                                Correct
                              </strong>
                            )}
                          </div>
                        )
                      )}
                    </div>

                    <div
                      className={
                        styles.explanation
                      }
                    >
                      <strong>
                        Explanation
                      </strong>

                      <p>
                        {question.explanation}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default AIQuestionGeneratorPage;