import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAllTeacherResults,
} from "../../services/teacherService";

import styles from "./TeacherResultsPage.module.css";

const TeacherResultsPage = () => {
  const navigate = useNavigate();

  const [
    results,
    setResults,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

  const fetchResults = async () => {
    try {
      setLoading(true);

      setError("");

      const data =
        await getAllTeacherResults();

      setResults(
        data.results || []
      );
    } catch (error) {
      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to load teacher results.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const statistics =
    useMemo(() => {
      const totalResults =
        results.length;

      const totalPassed =
        results.filter(
          (result) =>
            result.isPassed
        ).length;

      const totalFailed =
        totalResults -
        totalPassed;

      const averagePercentage =
        totalResults === 0
          ? 0
          : (
              results.reduce(
                (
                  total,
                  result
                ) =>
                  total +
                  result.percentage,
                0
              ) /
              totalResults
            ).toFixed(2);

      return {
        totalResults,
        totalPassed,
        totalFailed,
        averagePercentage,
      };
    }, [results]);

  const filteredResults =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return results.filter(
        (result) => {
          const studentName =
            `${result.student.firstName} ${result.student.lastName}`
              .toLowerCase();

          const studentEmail =
            result.student.email
              .toLowerCase();

          const examTitle =
            result.exam.title
              .toLowerCase();

          const matchesSearch =
            !searchValue ||
            studentName.includes(
              searchValue
            ) ||
            studentEmail.includes(
              searchValue
            ) ||
            examTitle.includes(
              searchValue
            );

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            (
              statusFilter ===
                "PASSED" &&
              result.isPassed
            ) ||
            (
              statusFilter ===
                "FAILED" &&
              !result.isPassed
            );

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      results,
      search,
      statusFilter,
    ]);

  const formatDate = (
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
            Loading student
            results...
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
            results
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchResults
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
                  "/teacher/dashboard"
                )
              }
            >
              ← Dashboard
            </button>

            <p>
              Teacher Analytics
            </p>

            <h1>
              Student Results
            </h1>

            <span>
              Review student
              performance across
              all your examinations.
            </span>
          </div>

          <button
            type="button"
            className={
              styles.examButton
            }
            onClick={() =>
              navigate(
                "/teacher/exams"
              )
            }
          >
            Manage Exams
          </button>
        </header>

        <section
          className={
            styles.statistics
          }
        >
          <article>
            <span>
              Total Results
            </span>

            <strong>
              {
                statistics
                  .totalResults
              }
            </strong>

            <p>
              Submitted exam
              attempts
            </p>
          </article>

          <article>
            <span>
              Passed
            </span>

            <strong>
              {
                statistics
                  .totalPassed
              }
            </strong>

            <p>
              Students meeting
              passing marks
            </p>
          </article>

          <article>
            <span>
              Failed
            </span>

            <strong>
              {
                statistics
                  .totalFailed
              }
            </strong>

            <p>
              Students below
              passing marks
            </p>
          </article>

          <article>
            <span>
              Average Score
            </span>

            <strong>
              {
                statistics
                  .averagePercentage
              }
              %
            </strong>

            <p>
              Overall result
              average
            </p>
          </article>
        </section>

        <section
          className={
            styles.resultsSection
          }
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <h2>
                All Student
                Results
              </h2>

              <p>
                Search results by
                student or exam.
              </p>
            </div>

            <span>
              {
                filteredResults
                  .length
              }{" "}
              Results
            </span>
          </div>

          <div
            className={
              styles.toolbar
            }
          >
            <input
              type="search"
              placeholder="Search by student, email or exam..."
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event
                    .target
                    .value
                )
              }
            />

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event
                    .target
                    .value
                )
              }
            >
              <option
                value="ALL"
              >
                All Results
              </option>

              <option
                value="PASSED"
              >
                Passed
              </option>

              <option
                value="FAILED"
              >
                Failed
              </option>
            </select>
          </div>

          {filteredResults
            .length === 0 ? (
            <div
              className={
                styles.emptyState
              }
            >
              <div>
                📊
              </div>

              <h2>
                No results found
              </h2>

              <p>
                No student results
                match the current
                search and filter.
              </p>
            </div>
          ) : (
            <div
              className={
                styles.tableWrapper
              }
            >
              <table
                className={
                  styles.resultTable
                }
              >
                <thead>
                  <tr>
                    <th>
                      Student
                    </th>

                    <th>
                      Exam
                    </th>

                    <th>
                      Score
                    </th>

                    <th>
                      Percentage
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Submitted
                    </th>

                    <th>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults
                    .map(
                      (
                        result
                      ) => (
                        <tr
                          key={
                            result.id
                          }
                        >
                          <td>
                            <div
                              className={
                                styles
                                  .student
                              }
                            >
                              <strong>
                                {
                                  result
                                    .student
                                    .firstName
                                }{" "}
                                {
                                  result
                                    .student
                                    .lastName
                                }
                              </strong>

                              <span>
                                {
                                  result
                                    .student
                                    .email
                                }
                              </span>
                            </div>
                          </td>

                          <td>
                            <button
                                type="button"
                                 onClick={() =>
                                    navigate(
                                        `/teacher/exams/${result.exam.id}/results`
                                    )
                                }
                            >
                                {result.exam.title}
                            </button>
                          </td>

                          <td>
                            <strong>
                              {
                                result
                                  .score
                              }
                              /
                              {
                                result
                                  .totalMarks
                              }
                            </strong>
                          </td>

                          <td>
                            <span
                              className={
                                styles
                                  .percentage
                              }
                            >
                              {
                                result
                                  .percentage
                              }
                              %
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                result
                                  .isPassed
                                  ? styles
                                      .passed
                                  : styles
                                      .failed
                              }
                            >
                              {
                                result
                                  .isPassed
                                  ? "Passed"
                                  : "Failed"
                              }
                            </span>
                          </td>

                          <td>
                            {
                              formatDate(
                                result
                                  .attempt
                                  ?.submittedAt
                              )
                            }
                          </td>

                          <td>
                            <button
                              type="button"
                              className={
                                styles
                                  .viewButton
                              }
                              onClick={() =>
                                navigate(
                                  `/teacher/exams/${result.exam.id}/results`
                                )
                              }
                            >
                              View Exam
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default TeacherResultsPage;