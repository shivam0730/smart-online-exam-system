import { useEffect, useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
} from "react-redux";

import {
  logout,
} from "../../context/authSlice";

import {
  getTeacherDashboard,
} from "../../services/teacherService";

import styles from "./TeacherDashboard.module.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTeacherDashboard();

        setDashboardData(data);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Unable to load the teacher dashboard.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);


  const handleLogout = () => {
    dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };


  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.stateContainer}>
          <div className={styles.loader}></div>

          <p>
            Loading teacher dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.errorContainer}>
          <h2>
            Unable to load dashboard
          </h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const {
    teacher,
    stats,
    recentExams,
  } = dashboardData;

  const teacherName =
    `${teacher.firstName} ${teacher.lastName}`;

  const statCards = [
    {
      title: "Total Exams",
      value: stats.totalExams,
      icon: "📝",
      description:
        "Exams created by you",
    },
    {
      title: "Active Exams",
      value: stats.activeExams,
      icon: "🚀",
      description:
        "Currently published exams",
    },
    {
      title: "Draft Exams",
      value: stats.draftExams,
      icon: "📄",
      description:
        "Exams waiting to publish",
    },
    {
      title: "Total Questions",
      value: stats.totalQuestions,
      icon: "❓",
      description:
        "Questions across all exams",
    },
    {
      title: "Published Results",
      value: stats.publishedResults,
      icon: "📊",
      description:
        "Student results generated",
    },
  ];

  const formatDate = (date) => {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  return (
    <main className={styles.page}>
      <section className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <p className={styles.role}>
              Teacher Dashboard
            </p>

            <h1>
              Welcome back,{" "}
              <span>
                {teacher.firstName}
              </span>
            </h1>

            <p className={styles.subtitle}>
              Manage your examinations,
              questions and student results
              from one place.
            </p>
          </div>


          <div
            className={
              styles.profileActions
            }
          >
            <div
              className={
                styles.profile
              }
            >
              <div
                className={
                  styles.profileAvatar
                }
              >
                {teacher.firstName
                  .charAt(0)
                  .toUpperCase()}

                {teacher.lastName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {teacherName}
                </strong>

                <span>
                  {teacher.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              className={
                styles.logoutButton
              }
              onClick={
                handleLogout
              }
            >
              Logout
            </button>
          </div>

        </header>

        <section
          className={styles.statsGrid}
        >
          {statCards.map((card) => (
            <article
              className={styles.statCard}
              key={card.title}
            >
              <div
                className={
                  styles.statCardTop
                }
              >
                <div
                  className={
                    styles.statIcon
                  }
                >
                  {card.icon}
                </div>

                <span>
                  Live data
                </span>
              </div>

              <h2>{card.value}</h2>

              <h3>{card.title}</h3>

              <p>
                {card.description}
              </p>
            </article>
          ))}
        </section>

        <section
          className={styles.contentGrid}
        >
          <article
            className={
              styles.recentSection
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <div>
                <h2>
                  Recent Exams
                </h2>

                <p>
                  Your recently created
                  examinations
                </p>
              </div>

              <button type="button">
                View All Exams
              </button>
            </div>

            {recentExams.length === 0 ? (
              <div
                className={
                  styles.emptyState
                }
              >
                <div>📝</div>

                <h3>
                  No exams created yet
                </h3>

                <p>
                  Create your first exam
                  to see it here.
                </p>
              </div>
            ) : (
              <div
                className={
                  styles.examList
                }
              >
                {recentExams.map(
                  (exam) => (
                    <article
                      className={
                        styles.examCard
                      }
                      key={exam.id}
                    >
                      <div
                        className={
                          styles.examMain
                        }
                      >
                        <div
                          className={
                            styles.examIcon
                          }
                        >
                          📘
                        </div>

                        <div>
                          <div
                            className={
                              styles.examTitle
                            }
                          >
                            <h3>
                              {exam.title}
                            </h3>

                            <span
                              className={
                                exam.status ===
                                  "PUBLISHED"
                                  ? styles.published
                                  : styles.draft
                              }
                            >
                              {exam.status}
                            </span>
                          </div>

                          <p>
                            Created{" "}
                            {formatDate(
                              exam.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      <div
                        className={
                          styles.examDetails
                        }
                      >
                        <span>
                          ⏱️{" "}
                          {exam.duration} min
                        </span>

                        <span>
                          🎯{" "}
                          {exam.totalMarks}{" "}
                          marks
                        </span>

                        <span>
                          ❓{" "}
                          {
                            exam._count
                              .questions
                          }{" "}
                          questions
                        </span>

                        <span>
                          👨‍🎓{" "}
                          {
                            exam._count
                              .attempts
                          }{" "}
                          attempts
                        </span>
                      </div>

                      <div
                        className={
                          styles.examActions
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/teacher/exams/${exam.id}/questions`
                            )
                          }
                        >
                          Manage Exam
                        </button>

                        <button
                          type="button"
                          className={
                            styles.secondaryButton
                          }
                          onClick={() =>
                            navigate(
                              `/teacher/exams/${exam.id}/results`
                            )
                          }
                        >
                          View Results
                        </button>
                      </div>

                    </article>
                  )
                )}
              </div>
            )}
          </article>

          <aside
            className={
              styles.quickActions
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <div>
                <h2>
                  Quick Actions
                </h2>

                <p>
                  Common teacher tasks
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/teacher/exams/create"
                )
              }
            >
              <span>＋</span>

              <div>
                <strong>
                  Create New Exam
                </strong>

                <small>
                  Set up a new examination
                </small>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/teacher/ai-question-generator"
                )
              }
            >
              <span>✨</span>

              <div>
                <strong>
                  Generate Questions with AI
                </strong>

                <small>
                  Create exam questions using AI
                </small>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/teacher/exams"
                )
              }
            >
              <span>❓</span>

              <div>
                <strong>
                  Manage Questions
                </strong>

                <small>
                  Add or update questions
                </small>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/teacher/results"
                )
              }
            >
              <span>📊</span>

              <div>
                <strong>
                  View Results
                </strong>

                <small>
                  Analyse student performance
                </small>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/teacher/profile"
                )
              }
            >
              <span>👤</span>

              <div>
                <strong>
                  Teacher Profile
                </strong>

                <small>
                  View account information
                </small>
              </div>
            </button>
          </aside>
        </section>
      </section>
    </main>
  );
};

export default TeacherDashboard;