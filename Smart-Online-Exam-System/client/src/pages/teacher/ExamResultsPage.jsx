import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getTeacherExamPerformance,
  getTeacherExamResults,
} from "../../services/teacherService";

import styles from "./ExamResultsPage.module.css";

const ExamResultsPage = () => {
  const navigate = useNavigate();

  const { examId } = useParams();

  const [
    examData,
    setExamData,
  ] = useState(null);

  const [
    statistics,
    setStatistics,
  ] = useState(null);

  const [
    results,
    setResults,
  ] = useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    resultFilter,
    setResultFilter,
  ] = useState("ALL");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const fetchExamResults = async () => {
    try {
      setLoading(true);

      setError("");

      const [
        examResultsData,
        performanceData,
      ] = await Promise.all([
        getTeacherExamResults(
          examId
        ),

        getTeacherExamPerformance(
          examId
        ),
      ]);

      setExamData(
        examResultsData.exam
      );

      setResults(
        Array.isArray(
          examResultsData.results
        )
          ? examResultsData.results
          : []
      );

      setStatistics(
        performanceData.statistics
      );
    } catch (error) {
      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to load exam results.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamResults();
  }, [examId]);

  const filteredResults =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
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

          const matchesSearch =
            !normalizedSearch ||
            studentName.includes(
              normalizedSearch
            ) ||
            studentEmail.includes(
              normalizedSearch
            );

          const matchesFilter =
            resultFilter ===
              "ALL"
              ? true
              : resultFilter ===
                "PASSED"
                ? result.isPassed
                : !result.isPassed;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      results,
      searchTerm,
      resultFilter,
    ]);

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Date(
      dateValue
    ).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
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
            Loading exam
            analytics...
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
            exam results
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchExamResults
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
          <button
            type="button"
            className={
              styles.backButton
            }
            onClick={() =>
              navigate(
                "/teacher/results"
              )
            }
          >
            ← All Results
          </button>

          <p>
            Exam Analytics
          </p>

          <h1>
            {examData?.title}
          </h1>

          <span>
            Review student
            performance and result
            statistics for this
            examination.
          </span>

          <div
            className={
              styles.headerActions
            }
          >
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/teacher/exams/${examId}/questions`
                )
              }
            >
              Manage Questions
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/teacher/exams"
                )
              }
            >
              Manage Exams
            </button>
          </div>
        </header>

        <section
          className={
            styles.examInformation
          }
        >
          <article>
            <span>
              Exam Status
            </span>

            <strong>
              {examData?.status}
            </strong>
          </article>

          <article>
            <span>
              Total Marks
            </span>

            <strong>
              {
                examData
                  ?.totalMarks
              }
            </strong>
          </article>

          <article>
            <span>
              Passing Marks
            </span>

            <strong>
              {
                examData
                  ?.passingMarks
              }
            </strong>
          </article>

          <article>
            <span>
              Duration
            </span>

            <strong>
              {
                examData
                  ?.duration
              }{" "}
              min
            </strong>
          </article>
        </section>

        {statistics && (
          <section
            className={
              styles.statistics
            }
          >
            <article>
              <span>
                Total Attempts
              </span>

              <strong>
                {
                  statistics
                    .totalAttempts
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
                Pass Percentage
              </span>

              <strong>
                {
                  statistics
                    .passPercentage
                }
                %
              </strong>

              <p>
                Overall pass rate
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
                Average student
                percentage
              </p>
            </article>

            <article>
              <span>
                Highest Score
              </span>

              <strong>
                {
                  statistics
                    .highestPercentage
                }
                %
              </strong>

              <p>
                Best performance
              </p>
            </article>

            <article>
              <span>
                Lowest Score
              </span>

              <strong>
                {
                  statistics
                    .lowestPercentage
                }
                %
              </strong>

              <p>
                Lowest performance
              </p>
            </article>
          </section>
        )}

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
                Student Results
              </h2>

              <p>
                Review every
                submitted result
                for this exam.
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
              styles.filters
            }
          >
            <input
              type="search"
              value={
                searchTerm
              }
              onChange={(
                event
              ) =>
                setSearchTerm(
                  event.target
                    .value
                )
              }
              placeholder="Search by student name or email..."
            />

            <select
              value={
                resultFilter
              }
              onChange={(
                event
              ) =>
                setResultFilter(
                  event.target
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

          {filteredResults.length ===
            0 ? (
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
                match the selected
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
                  styles.resultsTable
                }
              >
                <thead>
                  <tr>
                    <th>
                      Student
                    </th>

                    <th>
                      Score
                    </th>

                    <th>
                      Percentage
                    </th>

                    <th>
                      Result
                    </th>

                    <th>
                      Submitted
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults.map(
                    (result) => (
                      <tr
                        key={
                          result.id
                        }
                      >
                        <td>
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
                          <strong
                            className={
                              styles.percentage
                            }
                          >
                            {
                              result
                                .percentage
                            }
                            %
                          </strong>
                        </td>

                        <td>
                          <span
                            className={
                              result
                                .isPassed
                                ? styles.passed
                                : styles.failed
                            }
                          >
                            {result
                              .isPassed
                              ? "Passed"
                              : "Failed"}
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

export default ExamResultsPage;