import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileQuestion,
  LoaderCircle,
  Mail,
  Target,
  UserRound,
  Users,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getAdminExamById,
} from "../../services/adminService";

import styles
  from "./AdminExamDetailsPage.module.css";

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(date));
};

const getStatusClass = (
  status
) => {
  const statusClasses = {
    DRAFT: styles.draftBadge,
    PUBLISHED:
      styles.publishedBadge,
    COMPLETED:
      styles.completedBadge,
    ARCHIVED:
      styles.archivedBadge,
  };

  return (
    statusClasses[status] ||
    styles.draftBadge
  );
};

const AdminExamDetailsPage = () => {
  const navigate = useNavigate();

  const {
    examId,
  } = useParams();

  const [
    exam,
    setExam,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const fetchExamDetails =
    useCallback(async () => {
      try {
        setLoading(true);

        setError("");

        const data =
          await getAdminExamById(
            examId
          );

        setExam(data);
      } catch (requestError) {
        setError(
          requestError.response
            ?.data?.message ||
          "Unable to load exam details."
        );
      } finally {
        setLoading(false);
      }
    }, [examId]);

  useEffect(() => {
    fetchExamDetails();
  }, [fetchExamDetails]);

  if (loading) {
    return (
      <main className={styles.page}>
        <section
          className={
            styles.stateCard
          }
        >
          <LoaderCircle
            size={42}
            className={
              styles.spinner
            }
          />

          <h2>
            Loading exam details
          </h2>

          <p>
            Please wait while the
            examination data is
            fetched.
          </p>
        </section>
      </main>
    );
  }

  if (
    error ||
    !exam
  ) {
    return (
      <main className={styles.page}>
        <section
          className={
            styles.stateCard
          }
        >
          <AlertCircle
            size={44}
          />

          <h2>
            Unable to open exam
          </h2>

          <p>
            {error ||
              "Exam details are unavailable."}
          </p>

          <div
            className={
              styles.stateActions
            }
          >
            <button
              type="button"
              onClick={
                fetchExamDetails
              }
            >
              Try Again
            </button>

            <button
              type="button"
              className={
                styles.secondaryButton
              }
              onClick={() =>
                navigate(
                  "/admin/exams"
                )
              }
            >
              Back to Exams
            </button>
          </div>
        </section>
      </main>
    );
  }

  const teacherName = [
    exam.createdBy?.firstName,
    exam.createdBy?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className={styles.page}>
      <div
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
                  "/admin/exams"
                )
              }
            >
              <ArrowLeft
                size={18}
              />

              Exam Management
            </button>

            <p
              className={
                styles.eyebrow
              }
            >
              ADMIN EXAM REVIEW
            </p>

            <div
              className={
                styles.titleRow
              }
            >
              <h1>
                {exam.title}
              </h1>

              <span
                className={
                  getStatusClass(
                    exam.status
                  )
                }
              >
                {exam.status}
              </span>
            </div>

            <p
              className={
                styles.subtitle
              }
            >
              {exam.description ||
                "No exam description has been provided."}
            </p>
          </div>

          <div
            className={
              styles.examIdentity
            }
          >
            <ClipboardList
              size={25}
            />

            <div>
              <span>
                Exam ID
              </span>

              <strong>
                {exam.id}
              </strong>
            </div>
          </div>
        </header>

        <section
          className={
            styles.summaryGrid
          }
        >
          <article
            className={
              styles.summaryCard
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            >
              <Clock3
                size={22}
              />
            </div>

            <div>
              <span>
                Duration
              </span>

              <strong>
                {exam.duration} min
              </strong>
            </div>
          </article>

          <article
            className={
              styles.summaryCard
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            >
              <Target
                size={22}
              />
            </div>

            <div>
              <span>
                Total Marks
              </span>

              <strong>
                {exam.totalMarks}
              </strong>
            </div>
          </article>

          <article
            className={
              styles.summaryCard
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            >
              <CheckCircle2
                size={22}
              />
            </div>

            <div>
              <span>
                Passing Marks
              </span>

              <strong>
                {exam.passingMarks}
              </strong>
            </div>
          </article>

          <article
            className={
              styles.summaryCard
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            >
              <FileQuestion
                size={22}
              />
            </div>

            <div>
              <span>
                Questions
              </span>

              <strong>
                {
                  exam._count
                    ?.questions ??
                  exam.questions
                    ?.length ??
                  0
                }
              </strong>
            </div>
          </article>

          <article
            className={
              styles.summaryCard
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            >
              <Users
                size={22}
              />
            </div>

            <div>
              <span>
                Attempts
              </span>

              <strong>
                {
                  exam._count
                    ?.attempts ??
                  0
                }
              </strong>
            </div>
          </article>

          <article
            className={
              styles.summaryCard
            }
          >
            <div
              className={
                styles.summaryIcon
              }
            >
              <BookOpen
                size={22}
              />
            </div>

            <div>
              <span>
                Results
              </span>

              <strong>
                {
                  exam._count
                    ?.results ??
                  0
                }
              </strong>
            </div>
          </article>
        </section>

        <section
          className={
            styles.detailsGrid
          }
        >
          <article
            className={
              styles.infoCard
            }
          >
            <div
              className={
                styles.cardHeader
              }
            >
              <CalendarDays
                size={21}
              />

              <div>
                <h2>
                  Exam Information
                </h2>

                <p>
                  Schedule and
                  examination
                  requirements.
                </p>
              </div>
            </div>

            <div
              className={
                styles.infoList
              }
            >
              <div>
                <span>
                  Start Date
                </span>

                <strong>
                  {formatDate(
                    exam.startTime
                  )}
                </strong>
              </div>

              <div>
                <span>
                  End Date
                </span>

                <strong>
                  {formatDate(
                    exam.endTime
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Created
                </span>

                <strong>
                  {formatDate(
                    exam.createdAt
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Last Updated
                </span>

                <strong>
                  {formatDate(
                    exam.updatedAt
                  )}
                </strong>
              </div>
            </div>
          </article>

          <article
            className={
              styles.infoCard
            }
          >
            <div
              className={
                styles.cardHeader
              }
            >
              <UserRound
                size={21}
              />

              <div>
                <h2>
                  Exam Creator
                </h2>

                <p>
                  Teacher or
                  administrator who
                  created this exam.
                </p>
              </div>
            </div>

            <div
              className={
                styles.teacher
              }
            >
              <div
                className={
                  styles.avatar
                }
              >
                {
                  exam.createdBy
                    ?.firstName
                    ?.charAt(0)
                }

                {
                  exam.createdBy
                    ?.lastName
                    ?.charAt(0)
                }
              </div>

              <div>
                <strong>
                  {teacherName ||
                    "Unknown creator"}
                </strong>

                <span>
                  <Mail
                    size={15}
                  />

                  {
                    exam.createdBy
                      ?.email ||
                    "Email unavailable"
                  }
                </span>
              </div>
            </div>
          </article>
        </section>

        <section
          className={
            styles.instructionsCard
          }
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <ClipboardList
              size={21}
            />

            <div>
              <h2>
                Exam Instructions
              </h2>

              <p>
                Instructions provided
                to students before the
                examination.
              </p>
            </div>
          </div>

          <p
            className={
              styles.instructions
            }
          >
            {exam.instructions ||
              "No special instructions have been provided for this exam."}
          </p>
        </section>

        <section
          className={
            styles.questionsCard
          }
        >
          <div
            className={
              styles.questionsHeader
            }
          >
            <div
              className={
                styles.cardHeader
              }
            >
              <FileQuestion
                size={21}
              />

              <div>
                <h2>
                  Exam Questions
                </h2>

                <p>
                  Review active
                  questions and their
                  answer options.
                </p>
              </div>
            </div>

            <span
              className={
                styles.questionCount
              }
            >
              {
                exam.questions
                  ?.length || 0
              }{" "}
              Questions
            </span>
          </div>

          {!exam.questions
            ?.length ? (
            <div
              className={
                styles.emptyQuestions
              }
            >
              <FileQuestion
                size={38}
              />

              <h3>
                No active questions
              </h3>

              <p>
                This exam currently
                has no active
                questions available
                for review.
              </p>
            </div>
          ) : (
            <div
              className={
                styles.questionList
              }
            >
              {exam.questions.map(
                (
                  question,
                  index
                ) => (
                  <article
                    key={
                      question.id
                    }
                    className={
                      styles.question
                    }
                  >
                    <div
                      className={
                        styles.questionTop
                      }
                    >
                      <span
                        className={
                          styles.questionNumber
                        }
                      >
                        {index + 1}
                      </span>

                      <div>
                        <h3>
                          {
                            question.question
                          }
                        </h3>

                        <p>
                          {
                            question.marks
                          }{" "}
                          {
                            question.marks ===
                              1
                              ? "mark"
                              : "marks"
                          }
                        </p>
                      </div>
                    </div>

                    <div
                      className={
                        styles.optionsGrid
                      }
                    >
                      {question.options
                        ?.map(
                          (
                            option,
                            optionIndex
                          ) => (
                            <div
                              key={
                                option.id
                              }
                              className={
                                styles.option
                              }
                            >
                              <span>
                                {
                                  String.fromCharCode(
                                    65 +
                                    optionIndex
                                  )
                                }
                              </span>

                              <p>
                                {
                                  option.option
                                }
                              </p>
                            </div>
                          )
                        )}
                    </div>

                    {question.explanation && (
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
                            question.explanation
                          }
                        </p>
                      </div>
                    )}
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminExamDetailsPage;