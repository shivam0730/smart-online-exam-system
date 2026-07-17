import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getQuestionById,
  updateQuestion,
} from "../../services/teacherService";

import styles from "./EditQuestionPage.module.css";

const EditQuestionPage = () => {
  const navigate = useNavigate();

  const {
    examId,
    questionId,
  } = useParams();

  const [
    formData,
    setFormData,
  ] = useState({
    question: "",
    marks: "1",
    explanation: "",
    options: [],
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    apiError,
    setApiError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const questionData =
          await getQuestionById(
            questionId
          );

        setFormData({
          question:
            questionData.question,

          marks:
            String(
              questionData.marks
            ),

          explanation:
            questionData
              .explanation || "",

          options:
            questionData.options.map(
              (option) => ({
                id:
                  option.id,
                option:
                  option.option,

                isCorrect:
                  option.isCorrect,
              })
            ),



        });
      } catch (error) {
        const message =
          error.response
            ?.data
            ?.message ||
          "Unable to load the question.";

        setLoadError(
          message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);


  const handleFieldChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      })
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,
        [name]: "",
      })
    );

    setApiError("");
  };

  const handleOptionChange = (
    index,
    value
  ) => {
    setFormData(
      (currentData) => ({
        ...currentData,

        options:
          currentData.options.map(
            (
              currentOption,
              optionIndex
            ) =>
              optionIndex === index
                ? {
                  ...currentOption,
                  option: value,
                }
                : currentOption
          ),
      })
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,
        options: "",
      })
    );

    setApiError("");
  };

  const handleCorrectOption = (
    selectedIndex
  ) => {
    setFormData(
      (currentData) => ({
        ...currentData,

        options:
          currentData.options.map(
            (
              currentOption,
              optionIndex
            ) => ({
              ...currentOption,

              isCorrect:
                optionIndex ===
                selectedIndex,
            })
          ),
      })
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,
        correctOption: "",
      })
    );
  };

  const addOption = () => {
    if (
      formData.options.length >= 6
    ) {
      return;
    }

    setFormData(
      (currentData) => ({
        ...currentData,

        options: [
          ...currentData.options,

          {
            option: "",
            isCorrect: false,
          },
        ],
      })
    );
  };

  const removeOption = (
    optionIndex
  ) => {
    if (
      formData.options.length <= 2
    ) {
      return;
    }

    setFormData(
      (currentData) => {
        const updatedOptions =
          currentData.options.filter(
            (
              _,
              currentIndex
            ) =>
              currentIndex !==
              optionIndex
          );

        const hasCorrectOption =
          updatedOptions.some(
            (option) =>
              option.isCorrect
          );

        if (
          !hasCorrectOption
        ) {
          updatedOptions[0] = {
            ...updatedOptions[0],
            isCorrect: true,
          };
        }

        return {
          ...currentData,
          options:
            updatedOptions,
        };
      }
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,
        options: "",
        correctOption: "",
      })
    );
  };

  const validateForm = () => {
    const newErrors = {};

    const question =
      formData.question.trim();

    const marks =
      Number(formData.marks);

    if (!question) {
      newErrors.question =
        "Question is required.";
    } else if (
      question.length < 5
    ) {
      newErrors.question =
        "Question must contain at least 5 characters.";
    } else if (
      question.length > 1000
    ) {
      newErrors.question =
        "Question cannot exceed 1000 characters.";
    }

    if (
      formData.marks === ""
    ) {
      newErrors.marks =
        "Marks are required.";
    } else if (
      !Number.isInteger(
        marks
      ) ||
      marks < 1
    ) {
      newErrors.marks =
        "Marks must be a whole number of at least 1.";
    }

    const hasEmptyOption =
      formData.options.some(
        (option) =>
          !option.option.trim()
      );

    if (
      formData.options.length < 2
    ) {
      newErrors.options =
        "At least two options are required.";
    } else if (
      formData.options.length > 6
    ) {
      newErrors.options =
        "A maximum of six options is allowed.";
    } else if (
      hasEmptyOption
    ) {
      newErrors.options =
        "Every option must contain an answer.";
    }

    const correctOptions =
      formData.options.filter(
        (option) =>
          option.isCorrect
      );

    if (
      correctOptions.length !== 1
    ) {
      newErrors.correctOption =
        "Select exactly one correct answer.";
    }

    setErrors(
      newErrors
    );

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setApiError("");

    if (
      !validateForm()
    ) {
      return;
    }

    try {
      setSubmitting(true);

      const questionData = {
        question:
          formData.question.trim(),

        marks:
          Number(
            formData.marks
          ),

        explanation:
          formData.explanation
            .trim(),

        options:
          formData.options.map(
            (option) => ({
              ...(option.id && {
                id: option.id,
              }),

              option:
                option.option.trim(),

              isCorrect:
                option.isCorrect,
            })
          ),
      };

      await updateQuestion(
        questionId,
        questionData
      );

      navigate(
        `/teacher/exams/${examId}/questions`,
        {
          replace: true,
        }
      );
    } catch (error) {
      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to update the question.";

      setApiError(
        message
      );
    } finally {
      setSubmitting(
        false
      );
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div
          className={
            styles.stateContainer
          }
        >
          <div
            className={
              styles.loader
            }
          ></div>

          <p>
            Loading question...
          </p>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className={styles.page}>
        <div className={styles.stateContainer}>
          <div className={styles.errorIcon}>
            🔒
          </div>

          <span className={styles.errorEyebrow}>
            ACCESS RESTRICTED
          </span>

          <h2>
            Access Denied
          </h2>

          <p>
            {loadError}
          </p>

          <button
            type="button"
            className={styles.backButton}
            onClick={() =>
              navigate("/teacher/exams")
            }
          >
            &larr; Back to My Exams
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className={
        styles.page
      }
    >
      <section
        className={
          styles.container
        }
      >
        <header
          className={
            styles.header
          }
        >
          <button
            type="button"
            onClick={() =>
              navigate(
                `/teacher/exams/${examId}/questions`
              )
            }
          >
            ← Back to Questions
          </button>

          <p>
            Question Management
          </p>

          <h1>
            Edit Question
          </h1>

          <span>
            Update the question,
            answer options and correct
            answer.
          </span>
        </header>

        <form
          className={
            styles.form
          }
          onSubmit={
            handleSubmit
          }
          noValidate
        >
          {apiError && (
            <div
              className={
                styles.apiError
              }
            >
              {apiError}
            </div>
          )}

          <section
            className={
              styles.formSection
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <span>
                01
              </span>

              <div>
                <h2>
                  Question Details
                </h2>

                <p>
                  Enter the question,
                  marks and optional
                  explanation.
                </p>
              </div>
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="question"
              >
                Question
                <span>
                  *
                </span>
              </label>

              <textarea
                id="question"
                name="question"
                value={
                  formData.question
                }
                onChange={
                  handleFieldChange
                }
                placeholder="Example: What is the value of 10 + 20?"
                rows="5"
                maxLength="1000"
              />

              <em>
                {
                  formData
                    .question
                    .length
                }
                /1000
              </em>

              {errors.question && (
                <small>
                  {
                    errors.question
                  }
                </small>
              )}
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="marks"
              >
                Question Marks
                <span>
                  *
                </span>
              </label>

              <input
                id="marks"
                name="marks"
                type="number"
                min="1"
                value={
                  formData.marks
                }
                onChange={
                  handleFieldChange
                }
              />

              {errors.marks && (
                <small>
                  {
                    errors.marks
                  }
                </small>
              )}
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="explanation"
              >
                Explanation
              </label>

              <textarea
                id="explanation"
                name="explanation"
                value={
                  formData.explanation
                }
                onChange={
                  handleFieldChange
                }
                placeholder="Explain why the selected answer is correct."
                rows="4"
              />
            </div>
          </section>

          <section
            className={
              styles.formSection
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <span>
                02
              </span>

              <div>
                <h2>
                  Answer Options
                </h2>

                <p>
                  Add between two and
                  six options and
                  select one correct
                  answer.
                </p>
              </div>
            </div>

            <div
              className={
                styles.optionList
              }
            >
              {formData.options.map(
                (
                  option,
                  index
                ) => (
                  <div
                    className={
                      option.isCorrect
                        ? styles.correctOption
                        : styles.option
                    }
                    key={
                      index
                    }
                  >
                    <label>
                      <input
                        type="radio"
                        name="correctOption"
                        checked={
                          option.isCorrect
                        }
                        onChange={() =>
                          handleCorrectOption(
                            index
                          )
                        }
                      />

                      <span>
                        Correct
                      </span>
                    </label>

                    <strong>
                      {String.fromCharCode(
                        65 + index
                      )}
                    </strong>

                    <input
                      type="text"
                      value={
                        option.option
                      }
                      onChange={(
                        event
                      ) =>
                        handleOptionChange(
                          index,
                          event
                            .target
                            .value
                        )
                      }
                      placeholder={
                        `Enter option ${index + 1
                        }`
                      }
                      maxLength="500"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeOption(
                          index
                        )
                      }
                      disabled={
                        formData
                          .options
                          .length <= 2
                      }
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
            </div>

            {errors.options && (
              <small
                className={
                  styles.optionError
                }
              >
                {
                  errors.options
                }
              </small>
            )}

            {errors.correctOption && (
              <small
                className={
                  styles.optionError
                }
              >
                {
                  errors
                    .correctOption
                }
              </small>
            )}

            <button
              type="button"
              className={
                styles.addOptionButton
              }
              onClick={
                addOption
              }
              disabled={
                formData
                  .options
                  .length >= 6
              }
            >
              + Add Another Option
            </button>

            <p
              className={
                styles.optionCount
              }
            >
              {
                formData
                  .options
                  .length
              }{" "}
              of 6 options added
            </p>
          </section>

          <footer
            className={
              styles.formActions
            }
          >
            <button
              type="button"
              className={
                styles.cancelButton
              }
              onClick={() =>
                navigate(
                  `/teacher/exams/${examId}/questions`
                )
              }
              disabled={
                submitting
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className={
                styles.submitButton
              }
              disabled={
                submitting
              }
            >
              {submitting
                ? "Updating Question..."
                : "Update Question"}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default EditQuestionPage;