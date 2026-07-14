import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Eye,
  TrendingUp,
  XCircle,
} from "lucide-react";

import {
  getExamHistory,
  getPerformanceStatistics,
} from "../../services/studentService";

import styles from "./StudentResultsPage.module.css";

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    "Unable to load your results. Please try again."
  );
};

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const StudentResultsPage = () => {
  const navigate = useNavigate();

  const [statistics, setStatistics] =
    useState(null);

  const [examHistory, setExamHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          statisticsData,
          historyData,
        ] = await Promise.all([
          getPerformanceStatistics(),
          getExamHistory(),
        ]);

        setStatistics(statisticsData);

        setExamHistory(
          Array.isArray(historyData)
            ? historyData
            : historyData?.results || []
        );
      } catch (requestError) {
        setError(
          getErrorMessage(requestError)
        );
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return (
      <main className={styles.statePage}>
        <div className={styles.loader} />

        <h2>Loading your performance</h2>

        <p>
          Please wait while we prepare
          your exam statistics.
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.statePage}>
        <XCircle
          size={52}
          className={styles.errorIcon}
        />

        <h2>Unable to load results</h2>

        <p>{error}</p>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={() =>
            window.location.reload()
          }
        >
          Try Again
        </button>
      </main>
    );
  }

  const stats = {
    attempted:
      statistics?.totalExamsAttempted || 0,

    passed:
      statistics?.totalExamsPassed || 0,

    failed:
      statistics?.totalExamsFailed || 0,

    average:
      statistics?.averagePercentage || 0,

    highest:
      statistics?.highestPercentage || 0,

    lowest:
      statistics?.lowestPercentage || 0,
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() =>
            navigate("/student/dashboard")
          }
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              Student Analytics
            </span>

            <h1>
              Results & Performance
            </h1>

            <p>
              Review your previous exams
              and track your overall
              academic performance.
            </p>
          </div>

          <div className={styles.headerIcon}>
            <BarChart3 size={34} />
          </div>
        </header>

        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div
              className={`${styles.statIcon} ${styles.blueIcon}`}
            >
              <ClipboardList size={23} />
            </div>

            <div>
              <span>Exams Attempted</span>
              <strong>{stats.attempted}</strong>
            </div>
          </article>

          <article className={styles.statCard}>
            <div
              className={`${styles.statIcon} ${styles.greenIcon}`}
            >
              <CheckCircle2 size={23} />
            </div>

            <div>
              <span>Exams Passed</span>
              <strong>{stats.passed}</strong>
            </div>
          </article>

          <article className={styles.statCard}>
            <div
              className={`${styles.statIcon} ${styles.redIcon}`}
            >
              <XCircle size={23} />
            </div>

            <div>
              <span>Exams Failed</span>
              <strong>{stats.failed}</strong>
            </div>
          </article>

          <article className={styles.statCard}>
            <div
              className={`${styles.statIcon} ${styles.purpleIcon}`}
            >
              <TrendingUp size={23} />
            </div>

            <div>
              <span>Average Score</span>

              <strong>
                {Number(
                  stats.average
                ).toFixed(1)}
                %
              </strong>
            </div>
          </article>
        </section>

        <section
          className={styles.performanceGrid}
        >
          <article
            className={styles.performanceCard}
          >
            <div>
              <span>
                Highest Performance
              </span>

              <strong>
                {Number(
                  stats.highest
                ).toFixed(1)}
                %
              </strong>
            </div>

            <Award
              size={32}
              className={styles.highIcon}
            />
          </article>

          <article
            className={styles.performanceCard}
          >
            <div>
              <span>
                Lowest Performance
              </span>

              <strong>
                {Number(
                  stats.lowest
                ).toFixed(1)}
                %
              </strong>
            </div>

            <BarChart3
              size={32}
              className={styles.lowIcon}
            />
          </article>
        </section>

        <section className={styles.historySection}>
          <div className={styles.sectionHeading}>
            <div>
              <h2>Exam History</h2>

              <p>
                Your completed exam attempts
                are listed below.
              </p>
            </div>

            <span className={styles.resultCount}>
              {examHistory.length} Results
            </span>
          </div>

          {examHistory.length === 0 ? (
            <div className={styles.emptyState}>
              <ClipboardList size={45} />

              <h3>No exam history yet</h3>

              <p>
                Complete an exam and your
                result will appear here.
              </p>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={() =>
                  navigate(
                    "/student/dashboard"
                  )
                }
              >
                View Available Exams
              </button>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Completed</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {examHistory.map(
                    (result) => {
                      const percentage =
                        Number(
                          result.percentage ||
                            0
                        );

                      const passed =
                        result.isPassed ??
                        result.passed ??
                        percentage >= 40;

                      const examId =
                        result.examId ||
                        result.exam?.id;

                      return (
                        <tr
                          key={
                            result.id ||
                            examId
                          }
                        >
                          <td>
                            <div
                              className={
                                styles.examInfo
                              }
                            >
                              <strong>
                                {result.exam
                                  ?.title ||
                                  result.examTitle ||
                                  "Untitled Exam"}
                              </strong>

                              <span>
                                {result.exam
                                  ?.subject ||
                                  "Online Exam"}
                              </span>
                            </div>
                          </td>

                          <td>
                            <strong>
                              {result.score ??
                                0}
                              /
                              {result.totalMarks ??
                                result.exam
                                  ?.totalMarks ??
                                0}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={
                                styles.percentage
                              }
                            >
                              {percentage.toFixed(
                                1
                              )}
                              %
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                passed
                                  ? styles.passedBadge
                                  : styles.failedBadge
                              }
                            >
                              {passed
                                ? "Passed"
                                : "Failed"}
                            </span>
                          </td>

                          <td>
                            {formatDate(
                              result.submittedAt ||
                                result.completedAt ||
                                result.updatedAt
                            )}
                          </td>

                          <td>
                            <button
                              type="button"
                              className={
                                styles.viewButton
                              }
                              disabled={!examId}
                              onClick={() =>
                                navigate(
                                  `/student/results/${examId}`
                                )
                              }
                            >
                              <Eye size={16} />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    }
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

export default StudentResultsPage;