import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck,
  GraduationCap,
  Maximize,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react";

import {
  getAdminResultById,
} from "../../services/adminService";

import styles from
  "./AdminResultDetailsPage.module.css";

const AdminResultDetailsPage = () => {
  const navigate = useNavigate();

  const {
    resultId,
  } = useParams();

  const [
    result,
    setResult,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const fetchResultDetails =
      async () => {
        try {
          setLoading(true);

          setError("");

          const data =
            await getAdminResultById(
              resultId
            );

          setResult(data);
        } catch (error) {
          const message =
            error.response?.data
              ?.message ||
            "Unable to load result details.";

          setError(message);
        } finally {
          setLoading(false);
        }
      };

    fetchResultDetails();
  }, [resultId]);

  const formatName = (
    user
  ) => {
    const fullName = [
      user?.firstName,
      user?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      fullName ||
      "Unknown user"
    );
  };

  const formatDateTime = (
    date
  ) => {
    if (!date) {
      return "Not available";
    }

    return new Intl
      .DateTimeFormat(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      )
      .format(
        new Date(date)
      );
  };

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
            Loading result
            details...
          </p>
        </div>
      </main>
    );
  }

  if (
    error ||
    !result
  ) {
    return (
      <main
        className={
          styles.page
        }
      >
        <div
          className={
            styles.errorContainer
          }
        >
          <AlertTriangle
            size={44}
          />

          <h2>
            Unable to load
            result
          </h2>

          <p>
            {error ||
              "Result not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/results"
              )
            }
          >
            Back to Results
          </button>
        </div>
      </main>
    );
  }

  const {
    student,
    exam,
    attempt,
  } = result;

  const answers =
    attempt?.answers || [];

  return (
    <main
      className={
        styles.page
      }
    >
      <section
        className={
          styles.hero
        }
      >
        <button
          type="button"
          className={
            styles.backButton
          }
          onClick={() =>
            navigate(
              "/admin/results"
            )
          }
        >
          <ArrowLeft
            size={18}
          />

          Back to Results
        </button>

        <div
          className={
            styles.heroContent
          }
        >
          <div>
            <span
              className={
                styles.label
              }
            >
              ADMIN RESULT
              REVIEW
            </span>

            <h1>
              Result Details
            </h1>

            <p>
              Review student
              performance,
              examination details,
              answers, and exam
              security activity.
            </p>
          </div>

          <div
            className={
              result.isPassed
                ? styles.passedCard
                : styles.failedCard
            }
          >
            {result.isPassed ? (
              <CheckCircle2
                size={30}
              />
            ) : (
              <XCircle
                size={30}
              />
            )}

            <div>
              <span>
                FINAL RESULT
              </span>

              <strong>
                {result.isPassed
                  ? "PASSED"
                  : "FAILED"}
              </strong>
            </div>
          </div>
        </div>
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
          <Award size={25} />

          <div>
            <span>
              SCORE
            </span>

            <strong>
              {result.score}
              {" / "}
              {
                result.totalMarks
              }
            </strong>
          </div>
        </article>

        <article
          className={
            styles.statCard
          }
        >
          <FileCheck
            size={25}
          />

          <div>
            <span>
              PERCENTAGE
            </span>

            <strong>
              {Number(
                result.percentage
              ).toFixed(1)}
              %
            </strong>
          </div>
        </article>

        <article
          className={
            styles.statCard
          }
        >
          <BookOpen
            size={25}
          />

          <div>
            <span>
              PASSING MARKS
            </span>

            <strong>
              {
                exam
                  ?.passingMarks
              }
            </strong>
          </div>
        </article>

        <article
          className={
            styles.statCard
          }
        >
          <Clock size={25} />

          <div>
            <span>
              DURATION
            </span>

            <strong>
              {exam?.duration}
              {" min"}
            </strong>
          </div>
        </article>
      </section>

      <section
        className={
          styles.infoGrid
        }
      >
        <article
          className={
            styles.panel
          }
        >
          <div
            className={
              styles.panelTitle
            }
          >
            <GraduationCap
              size={23}
            />

            <div>
              <h2>
                Student
                Information
              </h2>

              <p>
                Candidate account
                details
              </p>
            </div>
          </div>

          <div
            className={
              styles.profileCard
            }
          >
            <div
              className={
                styles.avatar
              }
            >
              <User
                size={25}
              />
            </div>

            <div>
              <strong>
                {formatName(
                  student
                )}
              </strong>

              <span>
                {student?.email}
              </span>
            </div>
          </div>
        </article>

        <article
          className={
            styles.panel
          }
        >
          <div
            className={
              styles.panelTitle
            }
          >
            <BookOpen
              size={23}
            />

            <div>
              <h2>
                Examination
                Information
              </h2>

              <p>
                Exam and creator
                details
              </p>
            </div>
          </div>

          <div
            className={
              styles.examDetails
            }
          >
            <div>
              <span>
                EXAMINATION
              </span>

              <strong>
                {exam?.title}
              </strong>
            </div>

            <div>
              <span>
                TEACHER
              </span>

              <strong>
                {formatName(
                  exam
                    ?.createdBy
                )}
              </strong>
            </div>

            <div>
              <span>
                GENERATED
              </span>

              <strong>
                {formatDateTime(
                  result
                    .createdAt
                )}
              </strong>
            </div>

            <div>
              <span>
                EXAM STATUS
              </span>

              <strong>
                {exam?.status}
              </strong>
            </div>
          </div>
        </article>
      </section>

      <section
        className={
          styles.securitySection
        }
      >
        <div
          className={
            styles.sectionHeading
          }
        >
          <ShieldAlert
            size={25}
          />

          <div>
            <h2>
              Exam Security
              Activity
            </h2>

            <p>
              Recorded browser
              and fullscreen
              activity during
              the attempt.
            </p>
          </div>
        </div>

        <div
          className={
            styles.securityGrid
          }
        >
          <article>
            <Eye size={25} />

            <div>
              <span>
                TAB SWITCHES
              </span>

              <strong>
                {
                  attempt
                    ?.tabSwitchCount ??
                  0
                }
              </strong>
            </div>
          </article>

          <article>
            <Maximize
              size={25}
            />

            <div>
              <span>
                FULLSCREEN
                EXITS
              </span>

              <strong>
                {
                  attempt
                    ?.fullscreenExitCount ??
                  0
                }
              </strong>
            </div>
          </article>

          <article>
            <Clock size={25} />

            <div>
              <span>
                STARTED
              </span>

              <strong>
                {formatDateTime(
                  attempt
                    ?.startedAt
                )}
              </strong>
            </div>
          </article>

          <article>
            <CheckCircle2
              size={25}
            />

            <div>
              <span>
                SUBMITTED
              </span>

              <strong>
                {formatDateTime(
                  attempt
                    ?.submittedAt
                )}
              </strong>
            </div>
          </article>
        </div>
      </section>

      <section
        className={
          styles.answersSection
        }
      >
        <div
          className={
            styles.sectionHeading
          }
        >
          <ClipboardCheckIcon />

          <div>
            <h2>
              Answer Review
            </h2>

            <p>
              Selected answers,
              correct options, and
              awarded marks.
            </p>
          </div>
        </div>

        <div
          className={
            styles.answersList
          }
        >
          {answers.length >
          0 ? (
            answers.map(
              (
                answer,
                index
              ) => (
                <article
                  className={
                    styles
                      .answerCard
                  }
                  key={
                    answer.id
                  }
                >
                  <div
                    className={
                      styles
                        .questionHeader
                    }
                  >
                    <span
                      className={
                        styles
                          .questionNumber
                      }
                    >
                      {index +
                        1}
                    </span>

                    <div>
                      <h3>
                        {
                          answer
                            .question
                            ?.question
                        }
                      </h3>

                      <p>
                        {
                          answer
                            .marksAwarded
                        }
                        {" / "}
                        {
                          answer
                            .question
                            ?.marks
                        }
                        {
                          " marks"
                        }
                      </p>
                    </div>

                    <span
                      className={
                        answer
                          .isCorrect
                          ? styles
                              .correctBadge
                          : styles
                              .incorrectBadge
                      }
                    >
                      {answer
                        .isCorrect
                        ? "Correct"
                        : "Incorrect"}
                    </span>
                  </div>

                  <div
                    className={
                      styles
                        .optionsGrid
                    }
                  >
                    {answer
                      .question
                      ?.options
                      ?.map(
                        (
                          option,
                          optionIndex
                        ) => {
                          const isSelected =
                            option.id ===
                            answer
                              .selectedOption
                              ?.id;

                          return (
                            <div
                              key={
                                option.id
                              }
                              className={[
                                styles
                                  .option,
                                option
                                  .isCorrect
                                  ? styles
                                      .correctOption
                                  : "",
                                isSelected
                                  ? styles
                                      .selectedOption
                                  : "",
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  " "
                                )}
                            >
                              <span>
                                {String
                                  .fromCharCode(
                                    65 +
                                      optionIndex
                                  )}
                              </span>

                              <p>
                                {
                                  option
                                    .option
                                }
                              </p>

                              {option
                                .isCorrect && (
                                <CheckCircle2
                                  size={
                                    19
                                  }
                                />
                              )}

                              {isSelected &&
                                !option
                                  .isCorrect && (
                                  <XCircle
                                    size={
                                      19
                                    }
                                  />
                                )}
                            </div>
                          );
                        }
                      )}
                  </div>

                  <div
                    className={
                      styles
                        .answerSummary
                    }
                  >
                    <span>
                      Selected
                      answer:
                    </span>

                    <strong>
                      {
                        answer
                          .selectedOption
                          ?.option
                      }
                    </strong>
                  </div>

                  {answer
                    .question
                    ?.explanation && (
                    <div
                      className={
                        styles
                          .explanation
                      }
                    >
                      <span>
                        EXPLANATION
                      </span>

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
              )
            )
          ) : (
            <p
              className={
                styles.emptyMessage
              }
            >
              No submitted
              answers are
              available.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

const ClipboardCheckIcon =
  () => (
    <FileCheck
      size={25}
    />
  );

export default
  AdminResultDetailsPage;