import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle,
  GraduationCap,
  Home,
  Target,
  XCircle,
} from "lucide-react";

import {
  getExamResult,
} from "../../services/studentService";

import styles from "./ResultPage.module.css";

function ResultPage() {
  const { examId } = useParams();

  const [result, setResult] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadResult = async () => {
      try {
        setIsLoading(true);
        setError("");

        const resultData =
          await getExamResult(
            examId
          );

        setResult(resultData);
      } catch (requestError) {
        setError(
          requestError.response
            ?.data?.message ||
          "Unable to load the exam result."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadResult();
  }, [examId]);

  if (isLoading) {
    return (
      <main
        className={
          styles.statePage
        }
      >
        <p>
          Loading your result...
        </p>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main
        className={
          styles.statePage
        }
      >
        <div
          className={
            styles.errorCard
          }
        >
          <GraduationCap
            size={44}
          />

          <h1>
            Unable to load result
          </h1>

          <p>
            {error ||
              "Result was not found."}
          </p>

          <Link
            to="/student/dashboard"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const {
    exam,
    performance,
    questionSummary,
    answers,
  } = result;

  return (
    <div
      className={
        styles.resultPage
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div
          className={
            styles.brand
          }
        >
          <GraduationCap
            size={31}
          />

          <span>
            SmartExam
          </span>
        </div>

        <div className={styles.headerActions}>
          <Link
            to="/student/results"
            className={styles.backToResults}
          >
            <ArrowLeft size={18} />

            Back to Results
          </Link>

          <Link
            to="/student/dashboard"
            className={styles.dashboardButton}
          >
            <Home size={18} />

            Dashboard
          </Link>
        </div>

      </header>

      <main
        className={
          styles.main
        }
      >
        <section
          className={
            styles.resultHero
          }
        >
          <div
            className={
              performance.isPassed
                ? styles.passIcon
                : styles.failIcon
            }
          >
            {performance.isPassed ? (
              <CheckCircle
                size={46}
              />
            ) : (
              <XCircle
                size={46}
              />
            )}
          </div>

          <span>
            EXAM RESULT
          </span>

          <h1>
            {exam.title}
          </h1>

          <div
            className={
              performance.isPassed
                ? styles.passBadge
                : styles.failBadge
            }
          >
            {performance.isPassed
              ? "PASSED"
              : "FAILED"}
          </div>

          <p>
            You scored{" "}
            <strong>
              {performance.score}
            </strong>{" "}
            out of{" "}
            <strong>
              {
                performance.totalMarks
              }
            </strong>{" "}
            marks.
          </p>
        </section>

        <section
          className={
            styles.statsGrid
          }
        >
          <article
            className={
              styles.statCard
            }
          >
            <Target size={25} />

            <span>
              Percentage
            </span>

            <strong>
              {
                performance.percentage
              }
              %
            </strong>
          </article>

          <article
            className={
              styles.statCard
            }
          >
            <CheckCircle
              size={25}
            />

            <span>
              Correct Answers
            </span>

            <strong>
              {
                questionSummary
                  .correctAnswers
              }
            </strong>
          </article>

          <article
            className={
              styles.statCard
            }
          >
            <XCircle
              size={25}
            />

            <span>
              Incorrect Answers
            </span>

            <strong>
              {
                questionSummary
                  .incorrectAnswers
              }
            </strong>
          </article>

          <article
            className={
              styles.statCard
            }
          >
            <GraduationCap
              size={25}
            />

            <span>
              Unattempted
            </span>

            <strong>
              {
                questionSummary
                  .unattemptedQuestions
              }
            </strong>
          </article>
        </section>

        <section
          className={
            styles.reviewSection
          }
        >
          <div
            className={
              styles.sectionHeading
            }
          >
            <span>
              ANSWER REVIEW
            </span>

            <h2>
              Review your answers
            </h2>
          </div>

          {answers.length > 0 ? (
            answers.map(
              (
                answer,
                index
              ) => {
                const correctOption =
                  answer.question
                    .options
                    .find(
                      (
                        option
                      ) =>
                        option
                          .isCorrect
                    );

                return (
                  <article
                    className={
                      styles.answerCard
                    }
                    key={
                      answer.id
                    }
                  >
                    <div
                      className={
                        styles.answerHeader
                      }
                    >
                      <span>
                        Question{" "}
                        {index + 1}
                      </span>

                      <strong
                        className={
                          answer.isCorrect
                            ? styles.correct
                            : styles.incorrect
                        }
                      >
                        {answer.isCorrect
                          ? "Correct"
                          : "Incorrect"}
                      </strong>
                    </div>

                    <h3>
                      {
                        answer
                          .question
                          .question
                      }
                    </h3>

                    <p>
                      Your answer:{" "}
                      <strong>
                        {answer
                          .selectedOption
                          ?.option ||
                          "Not answered"}
                      </strong>
                    </p>

                    <p>
                      Correct answer:{" "}
                      <strong>
                        {correctOption
                          ?.option ||
                          "Not available"}
                      </strong>
                    </p>

                    {answer.question
                      .explanation && (
                        <div
                          className={
                            styles.explanation
                          }
                        >
                          <strong>
                            Explanation
                          </strong>

                          <p>
                            {
                              answer
                                .question
                                .explanation
                            }
                          </p>
                        </div>
                      )}
                  </article>
                );
              }
            )
          ) : (
            <p>
              No answer details are
              available.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default ResultPage;