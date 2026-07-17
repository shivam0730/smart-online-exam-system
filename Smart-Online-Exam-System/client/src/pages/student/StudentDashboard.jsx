import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    BookOpen,
    CheckCircle,
    GraduationCap,
    LogOut,
    Target,
} from "lucide-react";

import { logout } from "../../context/authSlice";
import styles from "./StudentDashboard.module.css";

import {
    getAvailableExams,
    getPerformanceStatistics,
} from "../../services/studentService";

function StudentDashboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const availableExamsRef = useRef(null);

    const { user } = useSelector(
        (state) => state.auth
    );

    const [exams, setExams] = useState([]);

    const [showAllExams, setShowAllExams] =
        useState(false);

    const [statistics, setStatistics] = useState({
        totalExamsAttempted: 0,
        totalExamsPassed: 0,
        totalExamsFailed: 0,
        averagePercentage: 0,
    });

    const [isLoading, setIsLoading] =
        useState(true);

    const [dashboardError, setDashboardError] =
        useState("");


    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                setDashboardError("");

                const [
                    availableExamData,
                    statisticsData,
                ] = await Promise.all([
                    getAvailableExams(),
                    getPerformanceStatistics(),
                ]);

                setExams(
                    availableExamData.exams || []
                );

                setStatistics(statisticsData);
            } catch (error) {
                setDashboardError(
                    error.response?.data?.message ||
                    "Unable to load dashboard data."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const handleStartExam = (examId) => {
        navigate(`/student/exams/${examId}`);
    };

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div className={styles.brand}>
                    <GraduationCap size={32} />

                    <span>SmartExam</span>
                </div>

                <div className={styles.userArea}>
                    <div>
                        <strong>
                            {user?.firstName} {user?.lastName}
                        </strong>

                        <span>Student</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </header>

            <main className={styles.main}>
                <section className={styles.welcome}>
                    <div>
                        <span>STUDENT DASHBOARD</span>

                        <h1>
                            Welcome back,{" "}
                            {user?.firstName || "Student"}!
                        </h1>

                        <p>
                            Track your progress, attempt available
                            exams, and review your performance.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            availableExamsRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                        }
                    >
                        <BookOpen size={20} />
                        Browse Exams
                    </button>

                </section>

                <section className={styles.statsGrid}>
                    <article className={styles.statCard}>
                        <div className={styles.iconBox}>
                            <BookOpen size={24} />
                        </div>

                        <div>
                            <span>Available Exams</span>
                            <strong>
                                {isLoading ? "..." : exams.length}
                            </strong>
                        </div>
                    </article>

                    <article className={styles.statCard}>
                        <div className={styles.iconBox}>
                            <CheckCircle size={24} />
                        </div>

                        <div>
                            <span>Exams Attempted</span>
                            <strong>
                                {isLoading
                                    ? "..."
                                    : statistics.totalExamsAttempted}
                            </strong>
                        </div>
                    </article>

                    <article className={styles.statCard}>
                        <div className={styles.iconBox}>
                            <Target size={24} />
                        </div>

                        <div>
                            <span>Average Score</span>
                            <strong>
                                {isLoading
                                    ? "..."
                                    : `${statistics.averagePercentage}%`}
                            </strong>
                        </div>
                    </article>
                </section>
                {dashboardError && (
                    <p className={styles.errorMessage}>
                        {dashboardError}
                    </p>
                )}
                <section
                    ref={availableExamsRef}
                    className={styles.contentGrid}>
                    <article className={styles.panel}>
                        <div className={styles.panelHeading}>
                            <div>
                                <span>UPCOMING</span>
                                <h2>Available Exams</h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAllExams((prev) => !prev)
                                }
                            >
                                {showAllExams ? "Show less" : "View all"}
                            </button>

                        </div>

                        {isLoading ? (
                            <p>Loading available exams...</p>
                        ) : exams.length > 0 ? (
                            <>
                                {(showAllExams
                                    ? exams
                                    : exams.slice(0, 1)
                                ).map((exam) => (
                                    <div
                                        key={exam.id}
                                        className={styles.examCard}
                                    >
                                        <div>
                                            <span
                                                className={styles.examStatus}
                                            >
                                                AVAILABLE
                                            </span>

                                            <h3>{exam.title}</h3>

                                            <p>
                                                {exam.description ||
                                                    "No description available."}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStartExam(exam.id)
                                            }
                                        >
                                            Start Exam
                                        </button>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p>No exams are currently available.</p>
                        )}

                    </article>

                    <article className={styles.panel}>
                        <div className={styles.panelHeading}>
                            <div>
                                <span>PERFORMANCE</span>
                                <h2>Progress Overview</h2>
                            </div>
                        </div>

                        <div className={styles.progress}>
                            <div className={styles.progressCircle}>
                                {isLoading
                                    ? "..."
                                    : `${statistics.averagePercentage}%`}
                            </div>

                            <div>
                                <h3>Keep improving</h3>

                                <p>
                                    Review your previous results and
                                    continue practicing.
                                </p>

                                <button
                                    type="button"
                                    className={styles.resultsButton}
                                    onClick={() =>
                                        navigate("/student/results")
                                    }
                                >
                                    View Results
                                </button>
                            </div>

                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default StudentDashboard;