import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  deleteQuestion,
  duplicateQuestion,
  getExamById,
  getExamQuestions,
  getQuestionStatistics,
  updateQuestionStatus,
} from "../../services/teacherService";

import styles from "./ManageQuestionsPage.module.css";

const ManageQuestionsPage = () => {
  const navigate = useNavigate();

  const { examId } = useParams();

  const [exam, setExam] =
    useState(null);

  const [questions, setQuestions] =
    useState([]);

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    actionLoading,
    setActionLoading,
  ] = useState({
    questionId: "",
    action: "",
  });

  const fetchQuestionData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        examData,
        questionData,
        statisticsData,
      ] = await Promise.all([
        getExamById(examId),

        getExamQuestions(
          examId
        ),

        getQuestionStatistics(
          examId
        ),
      ]);

      setExam(examData);

      setQuestions(
        Array.isArray(
          questionData
        )
          ? questionData
          : questionData.items || []
      );

      setStats(
        statisticsData
      );
    } catch (error) {
      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to load exam questions.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteQuestion = async (
    question
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete this question?\n\n"${question.question}"`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading({
        questionId: question.id,
        action: "delete",
      });

      await deleteQuestion(
        question.id
      );

      await fetchQuestionData();
    } catch (error) {
      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to delete the question.";

      window.alert(
        message
      );
    } finally {
      setActionLoading({
        questionId: "",
        action: "",
      });
    }
  };


  const handleDuplicateQuestion = async (
    question
  ) => {
    const confirmed =
      window.confirm(
        `Do you want to duplicate this question?\n\n"${question.question}"`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading({
        questionId: question.id,
        action: "duplicate",
      });

      await duplicateQuestion(
        question.id
      );

      await fetchQuestionData();
    } catch (error) {
      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to duplicate the question.";

      window.alert(
        message
      );
    } finally {
      setActionLoading({
        questionId: "",
        action: "",
      });
    }
  };


  const handleQuestionStatus = async (
    question
  ) => {
    try {
      setActionLoading({
        questionId: question.id,
        action: "status",
      });

      await updateQuestionStatus(
        question.id,
        !question.isActive
      );

      await fetchQuestionData();
    } catch (error) {
      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to update the question status.";

      window.alert(
        message
      );
    } finally {
      setActionLoading({
        questionId: "",
        action: "",
      });
    }
  };



  useEffect(() => {
    fetchQuestionData();
  }, [examId]);

  if (loading) {
    return (
      <main
        className={
          styles.page
        }
      >
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
            Loading exam
            questions...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className={
          styles.page
        }
      >
        <div
          className={
            styles.stateContainer
          }
        >
          <h2>
            Unable to load
            questions
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchQuestionData
            }
          >
            Try Again
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
          <div>
            <button
              type="button"
              className={
                styles.backButton
              }
              onClick={() =>
                navigate(
                  "/teacher/exams"
                )
              }
            >
              ← My Exams
            </button>

            <p>
              Question Management
            </p>

            <h1>
              {exam.title}
            </h1>

            <span>
              Create and manage
              questions for this
              examination.
            </span>
          </div>

          <button
            type="button"
            className={
              styles.addButton
            }
            onClick={() =>
              navigate(
                `/teacher/exams/${examId}/questions/create`
              )
            }
          >
            + Add New Question
          </button>
        </header>

        <section
          className={
            styles.examInformation
          }
        >
          <div>
            <span>
              Exam Status
            </span>

            <strong>
              {exam.status}
            </strong>
          </div>

          <div>
            <span>
              Total Marks
            </span>

            <strong>
              {exam.totalMarks}
            </strong>
          </div>

          <div>
            <span>
              Passing Marks
            </span>

            <strong>
              {exam.passingMarks}
            </strong>
          </div>

          <div>
            <span>
              Duration
            </span>

            <strong>
              {exam.duration} min
            </strong>
          </div>
        </section>

        {stats && (
          <section
            className={
              styles.statistics
            }
          >
            <article>
              <span>
                Total Questions
              </span>

              <strong>
                {
                  stats.totalQuestions
                }
              </strong>
            </article>

            <article>
              <span>
                Active Questions
              </span>

              <strong>
                {
                  stats.activeQuestions
                }
              </strong>
            </article>

            <article>
              <span>
                Inactive Questions
              </span>

              <strong>
                {
                  stats.inactiveQuestions
                }
              </strong>
            </article>

            <article>
              <span>
                Question Marks
              </span>

              <strong>
                {
                  stats.totalMarks
                }
              </strong>
            </article>
          </section>
        )}

        <section
          className={
            styles.questionSection
          }
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <h2>
                Exam Questions
              </h2>

              <p>
                Review all questions
                currently added to
                this exam.
              </p>
            </div>

            <span>
              {
                questions.length
              }{" "}
              Questions
            </span>
          </div>

          {questions.length ===
            0 ? (
            <div
              className={
                styles.emptyState
              }
            >
              <div>
                ❓
              </div>

              <h2>
                No questions added
              </h2>

              <p>
                Add the first
                question before
                publishing this
                examination.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/teacher/exams/${examId}/questions/create`
                  )
                }
              >
                Add First Question
              </button>
            </div>
          ) : (
            <div
              className={
                styles.questionList
              }
            >
              {questions.map(
                (
                  question,
                  index
                ) => (
                  <article
                    className={
                      styles.questionCard
                    }
                    key={
                      question.id
                    }
                  >
                    <div
                      className={
                        styles.questionNumber
                      }
                    >
                      {index + 1}
                    </div>

                    <div
                      className={
                        styles.questionContent
                      }
                    >
                      <div
                        className={
                          styles.questionTop
                        }
                      >
                        <h3>
                          {
                            question.question
                          }
                        </h3>

                        <span>
                          {
                            question.marks
                          }{" "}
                          Marks
                        </span>
                      </div>

                      <div
                        className={
                          styles.options
                        }
                      >
                        {question.options.map(
                          (
                            option,
                            optionIndex
                          ) => (
                            <div
                              key={
                                option.id
                              }
                              className={
                                option.isCorrect
                                  ? styles.correctOption
                                  : styles.option
                              }
                            >
                              <strong>
                                {String.fromCharCode(
                                  65 +
                                  optionIndex
                                )}
                              </strong>

                              <span>
                                {
                                  option.option
                                }
                              </span>

                              {option.isCorrect && (
                                <em>
                                  Correct
                                </em>
                              )}
                            </div>
                          )
                        )}
                      </div>

                      {question.explanation && (
                        <p
                          className={
                            styles.explanation
                          }
                        >
                          <strong>
                            Explanation:
                          </strong>{" "}
                          {
                            question.explanation
                          }
                        </p>
                      )}

                      <footer
                        className={
                          styles.questionFooter
                        }
                      >
                        <span>
                          {question.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                        <div>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/teacher/exams/${examId}/questions/${question.id}/edit`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleQuestionStatus(
                                question
                              )
                            }
                            disabled={
                              actionLoading.questionId ===
                              question.id
                            }
                          >
                            {actionLoading.questionId ===
                              question.id &&
                              actionLoading.action ===
                              "status"
                              ? "Updating..."
                              : question.isActive
                                ? "Deactivate"
                                : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDuplicateQuestion(
                                question
                              )
                            }
                            disabled={
                              actionLoading.questionId ===
                              question.id
                            }
                          >
                            {actionLoading.questionId ===
                              question.id &&
                              actionLoading.action ===
                              "duplicate"
                              ? "Processing..."
                              : "Duplicate"}
                          </button>

                          <button
                            type="button"
                            className={
                              styles.deleteButton
                            }
                            onClick={() =>
                              handleDeleteQuestion(
                                question
                              )
                            }
                            disabled={
                              actionLoading.questionId ===
                              question.id
                            }
                          >
                            {actionLoading.questionId ===
                              question.id &&
                              actionLoading.action ===
                              "delete"
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </footer>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default ManageQuestionsPage;