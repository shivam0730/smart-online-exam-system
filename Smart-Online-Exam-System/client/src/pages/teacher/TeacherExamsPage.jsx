import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  deleteExam,
  getTeacherDashboard,
  getTeacherExams,
  publishExam,
  unpublishExam,
} from "../../services/teacherService";

import styles from "./TeacherExamsPage.module.css";

const TeacherExamsPage = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [teacher, setTeacher] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState("");

  const [error, setError] =
    useState("");

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        examResponse,
        dashboardResponse,
      ] = await Promise.all([
        getTeacherExams(),
        getTeacherDashboard(),
      ]);

      const currentTeacher =
        dashboardResponse.teacher;

      const allExams =
        examResponse.items || [];

      const teacherExams =
        allExams.filter(
          (exam) =>
            exam.createdById ===
            currentTeacher.id
        );

      setTeacher(currentTeacher);
      setExams(teacherExams);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to load your exams.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesSearch =
        exam.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "ALL" ||
        exam.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    exams,
    search,
    statusFilter,
  ]);

  const handlePublish = async (
    exam
  ) => {
    try {
      setActionLoading(exam.id);

      if (
        exam.status === "PUBLISHED"
      ) {
        await unpublishExam(exam.id);
      } else {
        await publishExam(exam.id);
      }

      await fetchExams();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to update exam status.";

      window.alert(message);
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (
    exam
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${exam.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(exam.id);

      await deleteExam(exam.id);

      setExams((currentExams) =>
        currentExams.filter(
          (item) =>
            item.id !== exam.id
        )
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to delete the exam.";

      window.alert(message);
    } finally {
      setActionLoading("");
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(new Date(date));
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
            Loading your exams...
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
            styles.stateContainer
          }
        >
          <h2>
            Unable to load exams
          </h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchExams}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section
        className={styles.container}
      >
        <header className={styles.header}>
          <div>
            <button
              type="button"
              className={
                styles.backButton
              }
              onClick={() =>
                navigate(
                  "/teacher/dashboard"
                )
              }
            >
              ← Dashboard
            </button>

            <p>
              Teacher Exam Management
            </p>

            <h1>My Exams</h1>

            <span>
              Manage exams created by{" "}
              {teacher?.firstName}.
            </span>
          </div>

          <button
            type="button"
            className={
              styles.createButton
            }
            onClick={() =>
              navigate(
                "/teacher/exams/create"
              )
            }
          >
            + Create New Exam
          </button>
        </header>

        <section
          className={styles.summary}
        >
          <article>
            <span>Total Exams</span>

            <strong>
              {exams.length}
            </strong>
          </article>

          <article>
            <span>Published</span>

            <strong>
              {
                exams.filter(
                  (exam) =>
                    exam.status ===
                    "PUBLISHED"
                ).length
              }
            </strong>
          </article>

          <article>
            <span>Draft</span>

            <strong>
              {
                exams.filter(
                  (exam) =>
                    exam.status ===
                    "DRAFT"
                ).length
              }
            </strong>
          </article>
        </section>

        <section
          className={styles.toolbar}
        >
          <input
            type="search"
            placeholder="Search exams by title..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="ALL">
              All Statuses
            </option>

            <option value="DRAFT">
              Draft
            </option>

            <option value="PUBLISHED">
              Published
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="ARCHIVED">
              Archived
            </option>
          </select>
        </section>

        {filteredExams.length === 0 ? (
          <section
            className={
              styles.emptyState
            }
          >
            <div>📝</div>

            <h2>
              No exams found
            </h2>

            <p>
              Create a new exam or
              change the current filters.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/teacher/exams/create"
                )
              }
            >
              Create Exam
            </button>
          </section>
        ) : (
          <section
            className={
              styles.examGrid
            }
          >
            {filteredExams.map(
              (exam) => (
                <article
                  className={
                    styles.examCard
                  }
                  key={exam.id}
                >
                  <div
                    className={
                      styles.cardHeader
                    }
                  >
                    <div
                      className={
                        styles.examIcon
                      }
                    >
                      📝
                    </div>

                    <span
                      className={
                        styles[
                          exam.status
                            .toLowerCase()
                        ]
                      }
                    >
                      {exam.status}
                    </span>
                  </div>

                  <h2>
                    {exam.title}
                  </h2>

                  <p
                    className={
                      styles.description
                    }
                  >
                    {exam.description ||
                      "No description provided."}
                  </p>

                  <div
                    className={
                      styles.details
                    }
                  >
                    <div>
                      <span>
                        Duration
                      </span>

                      <strong>
                        {
                          exam.duration
                        }{" "}
                        minutes
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total Marks
                      </span>

                      <strong>
                        {
                          exam.totalMarks
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        Passing Marks
                      </span>

                      <strong>
                        {
                          exam.passingMarks
                        }
                      </strong>
                    </div>
                  </div>

                  <div
                    className={
                      styles.schedule
                    }
                  >
                    <p>
                      <span>
                        Starts
                      </span>

                      {formatDate(
                        exam.startTime
                      )}
                    </p>

                    <p>
                      <span>
                        Ends
                      </span>

                      {formatDate(
                        exam.endTime
                      )}
                    </p>
                  </div>

                  <div
                    className={
                      styles.primaryActions
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
                      Manage Questions
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handlePublish(
                          exam
                        )
                      }
                      disabled={
                        actionLoading ===
                        exam.id
                      }
                    >
                      {actionLoading ===
                      exam.id
                        ? "Updating..."
                        : exam.status ===
                          "PUBLISHED"
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                  </div>

                  <div
                    className={
                      styles.secondaryActions
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/teacher/exams/${exam.id}/edit`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className={
                        styles.deleteButton
                      }
                      onClick={() =>
                        handleDelete(
                          exam
                        )
                      }
                      disabled={
                        actionLoading ===
                        exam.id
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              )
            )}
          </section>
        )}
      </section>
    </main>
  );
};

export default TeacherExamsPage;
