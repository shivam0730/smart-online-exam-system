import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  BookOpen,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LogOut,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

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

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  };

  const formatName = (user) => {
    const fullName = [
      user?.firstName,
      user?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return fullName || "Unknown user";
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

  if (!dashboardData) {
    return null;
  }

  const {
    userStatistics,
    examStatistics,
    activityStatistics,
    recentUsers = [],
    recentExams = [],
  } = dashboardData;

  const statCards = [
    {
      title: "Total Users",
      value:
        userStatistics.totalUsers,
      icon: Users,
    },
    {
      title: "Students",
      value:
        userStatistics.totalStudents,
      icon: GraduationCap,
    },
    {
      title: "Teachers",
      value:
        userStatistics.totalTeachers,
      icon: BookOpen,
    },
    {
      title: "Total Exams",
      value:
        examStatistics.totalExams,
      icon: FileText,
    },
    {
      title: "Exam Attempts",
      value:
        activityStatistics.totalAttempts,
      icon: Activity,
    },
    {
      title: "Generated Results",
      value:
        activityStatistics.totalResults,
      icon: ClipboardCheck,
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
            attempts, and platform activity.
          </p>
        </div>

        <div
          className={
            styles.headerActions
          }
        >
          <button
            type="button"
            className={
              styles.manageUsersButton
            }
            onClick={() =>
              navigate("/admin/users")
            }
          >
            Manage Users
          </button>

          <button
            type="button"
            className={
              styles.manageExamsButton
            }
            onClick={() =>
              navigate("/admin/exams")
            }
          >
            Manage Exams
          </button>

          <button
            type="button"
            className={
              styles.manageResultsButton
            }
            onClick={() =>
              navigate("/admin/results")
            }
          >
            View Results
          </button>

          <button
            type="button"
            className={
              styles.logoutButton
            }
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </header>

      <section
        className={styles.statsGrid}
      >
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              className={
                styles.statCard
              }
              key={card.title}
            >
              <div
                className={
                  styles.statIcon
                }
              >
                <Icon size={27} />
              </div>

              <div>
                <p>{card.title}</p>

                <h2>{card.value}</h2>
              </div>
            </article>
          );
        })}
      </section>

      <section
        className={
          styles.overviewGrid
        }
      >
        <article
          className={styles.panel}
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <h2>
              User Overview
            </h2>

            <p>
              Role distribution and account
              activity
            </p>
          </div>

          <div
            className={
              styles.overviewItems
            }
          >
            <div>
              <span>Administrators</span>

              <strong>
                {
                  userStatistics
                    .totalAdmins
                }
              </strong>
            </div>

            <div>
              <span>Super Admins</span>

              <strong>
                {
                  userStatistics
                    .totalSuperAdmins
                }
              </strong>
            </div>

            <div>
              <span>Active Users</span>

              <strong>
                {
                  userStatistics
                    .activeUsers
                }
              </strong>
            </div>

            <div>
              <span>Inactive Users</span>

              <strong>
                {
                  userStatistics
                    .inactiveUsers
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
            <h2>
              Examination Overview
            </h2>

            <p>
              Current exam status
              distribution
            </p>
          </div>

          <div
            className={
              styles.overviewItems
            }
          >
            <div>
              <span>Draft Exams</span>

              <strong>
                {
                  examStatistics
                    .draftExams
                }
              </strong>
            </div>

            <div>
              <span>
                Published Exams
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
                Completed Exams
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
                Archived Exams
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
            <h2>
              Recent Users
            </h2>

            <p>
              Latest accounts registered on
              the platform
            </p>
          </div>

          <div
            className={
              styles.listContainer
            }
          >
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  className={
                    styles.listItem
                  }
                  key={user.id}
                >
                  <div>
                    <strong>
                      {formatName(user)}
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
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <p
                className={
                  styles.emptyMessage
                }
              >
                No users are available.
              </p>
            )}
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
            <h2>
              Recent Exams
            </h2>

            <p>
              Latest examinations created
              on the platform
            </p>
          </div>

          <div
            className={
              styles.listContainer
            }
          >
            {recentExams.length > 0 ? (
              recentExams.map((exam) => (
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
                      By{" "}
                      {formatName(
                        exam.createdBy
                      )}
                      {" • "}
                      {formatDate(
                        exam.createdAt
                      )}
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
                          ?.questions ?? 0
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
              ))
            ) : (
              <p
                className={
                  styles.emptyMessage
                }
              >
                No exams are available.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
};

export default AdminDashboard;