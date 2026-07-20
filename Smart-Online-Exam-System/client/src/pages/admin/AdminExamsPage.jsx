import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Archive,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Eye,
  FileQuestion,
  Search,
  Trash2,
} from "lucide-react";

import {
  archiveAdminExam,
  deleteAdminExam,
  getAdminExams,
} from "../../services/adminService";

import styles from "./AdminExamsPage.module.css";

const AdminExamsPage = () => {
  const navigate = useNavigate();

  const [exams, setExams] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 0,
      totalExams: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    processingExamId,
    setProcessingExamId,
  ] = useState("");

  const loadExams = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminExams({
            search,
            status,
            page,
            limit: 10,
          });

        setExams(
          data.exams || []
        );

        setPagination(
          data.pagination || {}
        );
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
          "Unable to fetch exams."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      search,
      status,
      page,
    ]
  );

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const handleSearch = (
    event
  ) => {
    event.preventDefault();

    setPage(1);

    setSearch(
      searchInput.trim()
    );
  };

  const handleStatusChange = (
    event
  ) => {
    setStatus(
      event.target.value
    );

    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const handleArchive = async (
    exam
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to archive "${exam.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingExamId(
        exam.id
      );

      setError("");

      await archiveAdminExam(
        exam.id
      );

      await loadExams();
    } catch (requestError) {
      setError(
        requestError.response?.data
          ?.message ||
        "Unable to archive exam."
      );
    } finally {
      setProcessingExamId("");
    }
  };

  const handleDelete = async (
    exam
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${exam.title}"? This exam will be removed from active records.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingExamId(
        exam.id
      );

      setError("");

      await deleteAdminExam(
        exam.id
      );

      await loadExams();
    } catch (requestError) {
      setError(
        requestError.response?.data
          ?.message ||
        "Unable to delete exam."
      );
    } finally {
      setProcessingExamId("");
    }
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Not set";
    }

    return new Intl
      .DateTimeFormat(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
      .format(
        new Date(date)
      );
  };

  const formatStatus = (
    examStatus
  ) => {
    return examStatus
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };

  const getStatusClass = (
    examStatus
  ) => {
    const statusClasses = {
      DRAFT:
        styles.draftBadge,

      PUBLISHED:
        styles.publishedBadge,

      COMPLETED:
        styles.completedBadge,

      ARCHIVED:
        styles.archivedBadge,
    };

    return (
      statusClasses[
      examStatus
      ] ||
      styles.draftBadge
    );
  };

  const publishedExams =
    exams.filter(
      (exam) =>
        exam.status ===
        "PUBLISHED"
    ).length;

  const draftExams =
    exams.filter(
      (exam) =>
        exam.status ===
        "DRAFT"
    ).length;

  const visibleQuestions =
    exams.reduce(
      (
        total,
        exam
      ) =>
        total +
        (
          exam._count
            ?.questions || 0
        ),
      0
    );

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
                  "/admin/dashboard"
                )
              }
            >
              <ArrowLeft
                size={18}
              />

              Dashboard
            </button>

            <p
              className={
                styles.eyebrow
              }
            >
              ADMIN CONTROL CENTER
            </p>

            <h1>
              Exam Management
            </h1>

            <p
              className={
                styles.subtitle
              }
            >
              Search, monitor,
              archive, and manage
              examinations across
              the platform.
            </p>
          </div>

          <div
            className={
              styles.totalExams
            }
          >
            <ClipboardList
              size={24}
            />

            <div>
              <span>
                Total Exams
              </span>

              <strong>
                {
                  pagination
                    .totalExams
                }
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
              <ClipboardList
                size={22}
              />
            </div>

            <div>
              <span>
                Visible Exams
              </span>

              <strong>
                {exams.length}
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
              <Clock3
                size={22}
              />
            </div>

            <div>
              <span>
                Published
              </span>

              <strong>
                {
                  publishedExams
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
              <Archive
                size={22}
              />
            </div>

            <div>
              <span>
                Draft on Page
              </span>

              <strong>
                {draftExams}
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
                Visible Questions
              </span>

              <strong>
                {
                  visibleQuestions
                }
              </strong>
            </div>
          </article>
        </section>

        <section
          className={
            styles.contentCard
          }
        >
          <div
            className={
              styles.toolbar
            }
          >
            <form
              className={
                styles.searchForm
              }
              onSubmit={
                handleSearch
              }
            >
              <Search
                size={19}
              />

              <input
                type="search"
                value={
                  searchInput
                }
                onChange={(
                  event
                ) =>
                  setSearchInput(
                    event.target
                      .value
                  )
                }
                placeholder="Search by exam or teacher"
              />

              <button
                type="submit"
              >
                Search
              </button>
            </form>

            <div
              className={
                styles.filters
              }
            >
              <select
                value={
                  status
                }
                onChange={
                  handleStatusChange
                }
                aria-label="Filter exams by status"
              >
                <option
                  value=""
                >
                  All Statuses
                </option>

                <option
                  value="DRAFT"
                >
                  Draft
                </option>

                <option
                  value="PUBLISHED"
                >
                  Published
                </option>

                <option
                  value="COMPLETED"
                >
                  Completed
                </option>

                <option
                  value="ARCHIVED"
                >
                  Archived
                </option>
              </select>

              <button
                type="button"
                className={
                  styles.clearButton
                }
                onClick={
                  handleClearFilters
                }
              >
                Clear
              </button>
            </div>
          </div>

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}

              <button
                type="button"
                onClick={
                  loadExams
                }
              >
                Try Again
              </button>
            </div>
          )}

          {loading ? (
            <div
              className={
                styles.stateMessage
              }
            >
              Loading exams...
            </div>
          ) : exams.length ===
            0 ? (
            <div
              className={
                styles.stateMessage
              }
            >
              <ClipboardList
                size={38}
              />

              <h2>
                No exams found
              </h2>

              <p>
                Try changing
                your search or
                status filter.
              </p>
            </div>
          ) : (
            <div
              className={
                styles.tableWrapper
              }
            >
              <table>
                <thead>
                  <tr>
                    <th>
                      Exam
                    </th>

                    <th>
                      Teacher
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Details
                    </th>

                    <th>
                      Activity
                    </th>

                    <th>
                      Created
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {exams.map(
                    (exam) => (
                      <tr
                        key={
                          exam.id
                        }
                      >
                        <td>
                          <div
                            className={
                              styles
                                .examCell
                            }
                          >
                            <strong>
                              {
                                exam.title
                              }
                            </strong>

                            <span>
                              {exam
                                .description ||
                                "No description provided"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div
                            className={
                              styles
                                .teacherCell
                            }
                          >
                            <strong>
                              {
                                exam
                                  .createdBy
                                  ?.firstName
                              }{" "}
                              {
                                exam
                                  .createdBy
                                  ?.lastName
                              }
                            </strong>

                            <span>
                              {
                                exam
                                  .createdBy
                                  ?.email
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={
                              getStatusClass(
                                exam.status
                              )
                            }
                          >
                            {formatStatus(
                              exam.status
                            )}
                          </span>
                        </td>

                        <td>
                          <div
                            className={
                              styles
                                .detailCell
                            }
                          >
                            <span>
                              {
                                exam.duration
                              }{" "}
                              min
                            </span>

                            <span>
                              {
                                exam.totalMarks
                              }{" "}
                              marks
                            </span>

                            <span>
                              {
                                exam
                                  ._count
                                  ?.questions ||
                                0
                              }{" "}
                              questions
                            </span>
                          </div>
                        </td>

                        <td>
                          <div
                            className={
                              styles
                                .detailCell
                            }
                          >
                            <span>
                              {
                                exam
                                  ._count
                                  ?.attempts ||
                                0
                              }{" "}
                              attempts
                            </span>

                            <span>
                              {
                                exam
                                  ._count
                                  ?.results ||
                                0
                              }{" "}
                              results
                            </span>
                          </div>
                        </td>

                        <td>
                          {formatDate(
                            exam.createdAt
                          )}
                        </td>

                        <td>
                          <div
                            className={
                              styles
                                .actionGroup
                            }
                          >
                            <button
                              type="button"
                              className={
                                styles
                                  .viewButton
                              }
                              title="View exam details"
                              onClick={() =>
                                navigate(
                                  `/admin/exams/${exam.id}`
                                )
                              }
                            >
                              <Eye
                                size={17}
                              />

                              View
                            </button>

                            {exam.status !==
                              "ARCHIVED" && (
                                <button
                                  type="button"
                                  className={
                                    styles
                                      .archiveButton
                                  }
                                  disabled={
                                    processingExamId ===
                                    exam.id
                                  }
                                  onClick={() =>
                                    handleArchive(
                                      exam
                                    )
                                  }
                                >
                                  <Archive
                                    size={17}
                                  />

                                  Archive
                                </button>
                              )}

                            <button
                              type="button"
                              className={
                                styles
                                  .deleteButton
                              }
                              disabled={
                                processingExamId ===
                                exam.id
                              }
                              onClick={() =>
                                handleDelete(
                                  exam
                                )
                              }
                            >
                              <Trash2
                                size={17}
                              />

                              {processingExamId ===
                                exam.id
                                ? "Processing..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          <footer
            className={
              styles.pagination
            }
          >
            <p>
              Showing{" "}
              <strong>
                {exams.length}
              </strong>{" "}
              of{" "}
              <strong>
                {
                  pagination
                    .totalExams
                }
              </strong>{" "}
              exams
            </p>

            <div>
              <button
                type="button"
                disabled={
                  !pagination
                    .hasPreviousPage ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (
                      currentPage
                    ) =>
                      currentPage -
                      1
                  )
                }
              >
                <ChevronLeft
                  size={18}
                />

                Previous
              </button>

              <span>
                Page{" "}
                {
                  pagination
                    .currentPage
                }{" "}
                of{" "}
                {Math.max(
                  pagination
                    .totalPages ||
                  0,
                  1
                )}
              </span>

              <button
                type="button"
                disabled={
                  !pagination
                    .hasNextPage ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (
                      currentPage
                    ) =>
                      currentPage +
                      1
                  )
                }
              >
                Next

                <ChevronRight
                  size={18}
                />
              </button>
            </div>
          </footer>
        </section>
      </section>
    </main>
  );
};

export default AdminExamsPage;