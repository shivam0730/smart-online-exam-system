import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAdminDashboard,
} from "../../services/adminService";

import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

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
          await getAdminDashboard();

        setDashboardData(data);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Unable to load the admin dashboard.";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
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
            className={styles.loader}
          ></div>

          <p>
            Loading admin dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div
          className={
            styles.errorContainer
          }
        >
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
    userStatistics,
    examStatistics,
    activityStatistics,
    recentUsers,
    recentExams,
  } = dashboardData;

  const statCards = [
    {
      title: "Total Users",
      value:
        userStatistics.totalUsers,
      icon: "👥",
    },
    {
      title: "Students",
      value:
        userStatistics.totalStudents,
      icon: "🎓",
    },
    {
      title: "Teachers",
      value:
        userStatistics.totalTeachers,
      icon: "👨‍🏫",
    },
    {
      title: "Total Exams",
      value:
        examStatistics.totalExams,
      icon: "📝",
    },
    {
      title: "Published Exams",
      value:
        examStatistics.publishedExams,
      icon: "🚀",
    },
    {
      title: "Submitted Attempts",
      value:
        activityStatistics
          .submittedAttempts,
      icon: "✅",
    },
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span
            className={
              styles.dashboardLabel
            }
          >
            ADMIN CONTROL CENTER
          </span>

          <h1>
            System Dashboard
          </h1>

          <p>
            Monitor users, examinations,
            and platform activity.
          </p>
        </div>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
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
              className={styles.statIcon}
            >
              {card.icon}
            </div>

            <div>
              <p>{card.title}</p>

              <h2>{card.value}</h2>
            </div>
          </article>
        ))}
      </section>

      <section
        className={styles.overviewGrid}
      >
        <article
          className={styles.panel}
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <h2>
                User Overview
              </h2>

              <p>
                Current platform users
              </p>
            </div>
          </div>

          <div
            className={
              styles.overviewItems
            }
          >
            <div>
              <span>
                Active Users
              </span>

              <strong>
                {
                  userStatistics
                    .activeUsers
                }
              </strong>
            </div>

            <div>
              <span>
                Inactive Users
              </span>

              <strong>
                {
                  userStatistics
                    .inactiveUsers
                }
              </strong>
            </div>

            <div>
              <span>
                Admins
              </span>

              <strong>
                {
                  userStatistics
                    .totalAdmins
                }
              </strong>
            </div>

            <div>
              <span>
                Super Admins
              </span>

              <strong>
                {
                  userStatistics
                    .totalSuperAdmins
                }
              </strong>
            </div>
          </div>
        </article>

        <article
          className={styles.panel}
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <h2>
                Exam Overview
              </h2>

              <p>
                Examination status summary
              </p>
            </div>
          </div>

          <div
            className={
              styles.overviewItems
            }
          >
            <div>
              <span>Draft</span>

              <strong>
                {
                  examStatistics
                    .draftExams
                }
              </strong>
            </div>

            <div>
              <span>
                Published
              </span>

              <strong>
                {
                  examStatistics
                    .publishedExams
                }
              </strong>
            </div>

            <div>
              <span>
                Completed
              </span>

              <strong>
                {
                  examStatistics
                    .completedExams
                }
              </strong>
            </div>

            <div>
              <span>
                Archived
              </span>

              <strong>
                {
                  examStatistics
                    .archivedExams
                }
              </strong>
            </div>
          </div>
        </article>
      </section>

      <section
        className={styles.contentGrid}
      >
        <article
          className={styles.panel}
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <h2>
                Recent Users
              </h2>

              <p>
                Latest registered accounts
              </p>
            </div>
          </div>

          {recentUsers.length === 0 ? (
            <p
              className={
                styles.emptyMessage
              }
            >
              No users found.
            </p>
          ) : (
            <div
              className={
                styles.listContainer
              }
            >
              {recentUsers.map(
                (user) => (
                  <div
                    className={
                      styles.listItem
                    }
                    key={user.id}
                  >
                    <div>
                      <strong>
                        {user.firstName}{" "}
                        {user.lastName}
                      </strong>

                      <span>
                        {user.email}
                      </span>
                    </div>

                    <span
                      className={
                        styles.roleBadge
                      }
                    >
                      {user.role.replace(
                        "_",
                        " "
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </article>

        <article
          className={styles.panel}
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
                Latest examinations
              </p>
            </div>
          </div>

          {recentExams.length === 0 ? (
            <p
              className={
                styles.emptyMessage
              }
            >
              No exams found.
            </p>
          ) : (
            <div
              className={
                styles.listContainer
              }
            >
              {recentExams.map(
                (exam) => (
                  <div
                    className={
                      styles.examItem
                    }
                    key={exam.id}
                  >
                    <div>
                      <strong>
                        {exam.title}
                      </strong>

                      <span>
                        Created by{" "}
                        {
                          exam.createdBy
                            .firstName
                        }{" "}
                        {
                          exam.createdBy
                            .lastName
                        }
                      </span>
                    </div>

                    <div
                      className={
                        styles.examMeta
                      }
                    >
                      <span>
                        {
                          exam._count
                            .questions
                        }{" "}
                        questions
                      </span>

                      <span
                        className={
                          styles.statusBadge
                        }
                      >
                        {exam.status}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </article>
      </section>
    </main>
  );
};

export default AdminDashboard;