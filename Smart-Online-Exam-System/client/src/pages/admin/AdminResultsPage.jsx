import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Search,
    Trophy,
    XCircle,
} from "lucide-react";

import {
    getAdminResults,
} from "../../services/adminService";

import styles
    from "./AdminResultsPage.module.css";

const AdminResultsPage = () => {
    const navigate = useNavigate();

    const [results, setResults] =
        useState([]);

    const [summary, setSummary] =
        useState({
            totalResults: 0,
            passedResults: 0,
            failedResults: 0,
        });

    const [pagination, setPagination] =
        useState({
            currentPage: 1,
            totalPages: 1,
            totalResults: 0,
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

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getAdminResults({
                        search,
                        status,
                        page,
                        limit: 10,
                    });

                setResults(
                    data.results || []
                );

                setSummary(
                    data.summary || {
                        totalResults: 0,
                        passedResults: 0,
                        failedResults: 0,
                    }
                );

                setPagination(
                    data.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalResults: 0,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    }
                );
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Unable to load examination results.";

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [
        search,
        status,
        page,
    ]);

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
        setPage(1);
        setStatus(
            event.target.value
        );
    };

    const handleClearFilters = () => {
        setSearchInput("");
        setSearch("");
        setStatus("");
        setPage(1);
    };

    const formatName = (user) => {
        const name = [
            user?.firstName,
            user?.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        return name || "Unknown user";
    };

    const formatDate = (date) => {
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

    const formatPercentage = (
        percentage
    ) => {
        const value =
            Number(percentage);

        if (
            Number.isNaN(value)
        ) {
            return "0%";
        }

        return `${value.toFixed(
            1
        )}%`;
    };

    return (
        <main className={styles.page}>
            <div
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

                            Back to Dashboard
                        </button>

                        <p
                            className={
                                styles.eyebrow
                            }
                        >
                            ADMIN RESULT MONITORING
                        </p>

                        <h1>
                            Examination Results
                        </h1>

                        <p
                            className={
                                styles.subtitle
                            }
                        >
                            Monitor student scores,
                            percentages, outcomes,
                            examinations, and teachers
                            across the platform.
                        </p>
                    </div>

                    <div
                        className={
                            styles.totalResults
                        }
                    >
                        <ClipboardCheck
                            size={28}
                        />

                        <div>
                            <span>
                                Total Results
                            </span>

                            <strong>
                                {
                                    summary
                                        .totalResults
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
                            <Trophy size={24} />
                        </div>

                        <div>
                            <span>
                                Total Results
                            </span>

                            <strong>
                                {
                                    summary
                                        .totalResults
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
                                `${styles.summaryIcon}
                ${styles.passIcon}`
                            }
                        >
                            <CheckCircle2
                                size={24}
                            />
                        </div>

                        <div>
                            <span>
                                Passed
                            </span>

                            <strong>
                                {
                                    summary
                                        .passedResults
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
                                `${styles.summaryIcon}
                ${styles.failIcon}`
                            }
                        >
                            <XCircle
                                size={24}
                            />
                        </div>

                        <div>
                            <span>
                                Failed
                            </span>

                            <strong>
                                {
                                    summary
                                        .failedResults
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
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search student, email, or exam..."
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
                                value={status}
                                onChange={
                                    handleStatusChange
                                }
                                aria-label="Filter results by status"
                            >
                                <option value="">
                                    All Results
                                </option>

                                <option value="passed">
                                    Passed
                                </option>

                                <option value="failed">
                                    Failed
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
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            className={
                                styles.error
                            }
                        >
                            <div>
                                <AlertCircle
                                    size={20}
                                />

                                <span>
                                    {error}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    window
                                        .location
                                        .reload()
                                }
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div
                            className={
                                styles.stateMessage
                            }
                        >
                            <ClipboardCheck
                                size={42}
                            />

                            <h2>
                                Loading results...
                            </h2>

                            <p>
                                Fetching examination
                                performance data.
                            </p>
                        </div>
                    ) : results.length === 0 ? (
                        <div
                            className={
                                styles.stateMessage
                            }
                        >
                            <ClipboardCheck
                                size={42}
                            />

                            <h2>
                                No results found
                            </h2>

                            <p>
                                No examination results
                                match the selected
                                filters.
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
                                            Student
                                        </th>

                                        <th>
                                            Examination
                                        </th>

                                        <th>
                                            Teacher
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
                                            Generated
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {results.map(
                                        (result) => (
                                            <tr
                                                key={
                                                    result.id
                                                }
                                            >
                                                <td>
                                                    <div
                                                        className={
                                                            styles
                                                                .personCell
                                                        }
                                                    >
                                                        <strong>
                                                            {formatName(
                                                                result
                                                                    .student
                                                            )}
                                                        </strong>

                                                        <span>
                                                            {
                                                                result
                                                                    .student
                                                                    ?.email
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div
                                                        className={
                                                            styles
                                                                .examCell
                                                        }
                                                    >
                                                        <strong>
                                                            {
                                                                result
                                                                    .exam
                                                                    ?.title
                                                            }
                                                        </strong>

                                                        <span>
                                                            Passing marks:{" "}
                                                            {
                                                                result
                                                                    .exam
                                                                    ?.passingMarks
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div
                                                        className={
                                                            styles
                                                                .personCell
                                                        }
                                                    >
                                                        <strong>
                                                            {formatName(
                                                                result
                                                                    .exam
                                                                    ?.createdBy
                                                            )}
                                                        </strong>

                                                        <span>
                                                            {
                                                                result
                                                                    .exam
                                                                    ?.createdBy
                                                                    ?.email
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong
                                                        className={
                                                            styles
                                                                .score
                                                        }
                                                    >
                                                        {
                                                            result
                                                                .score
                                                        }
                                                        {" / "}
                                                        {
                                                            result
                                                                .totalMarks
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong
                                                        className={
                                                            styles
                                                                .percentage
                                                        }
                                                    >
                                                        {formatPercentage(
                                                            result
                                                                .percentage
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            result
                                                                .isPassed
                                                                ? styles
                                                                    .passedBadge
                                                                : styles
                                                                    .failedBadge
                                                        }
                                                    >
                                                        {result
                                                            .isPassed
                                                            ? "Passed"
                                                            : "Failed"}
                                                    </span>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        result
                                                            .createdAt
                                                    )}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className={
                                                            styles.viewButton
                                                        }
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/results/${result.id}`
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </button>
                                                </td>

                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading &&
                        results.length > 0 && (
                            <div
                                className={
                                    styles.pagination
                                }
                            >
                                <p>
                                    Showing{" "}
                                    {results.length} of{" "}
                                    {
                                        pagination
                                            .totalResults
                                    }{" "}
                                    results
                                </p>

                                <div>
                                    <button
                                        type="button"
                                        disabled={
                                            !pagination
                                                .hasPreviousPage
                                        }
                                        onClick={() =>
                                            setPage(
                                                (
                                                    currentPage
                                                ) =>
                                                    Math.max(
                                                        currentPage -
                                                        1,
                                                        1
                                                    )
                                            )
                                        }
                                    >
                                        <ChevronLeft
                                            size={17}
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
                                                .totalPages,
                                            1
                                        )}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination
                                                .hasNextPage
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
                                            size={17}
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                </section>
            </div>
        </main>
    );
};

export default AdminResultsPage;