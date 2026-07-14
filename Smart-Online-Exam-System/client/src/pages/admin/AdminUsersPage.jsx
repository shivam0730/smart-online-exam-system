import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Search,
    ShieldCheck,
    UserCheck,
    Users,
    UserX,
} from "lucide-react";

import {
    getAdminUsers,
    updateAdminUserStatus,
} from "../../services/adminService";

import styles from "./AdminUsersPage.module.css";

const AdminUsersPage = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const [pagination, setPagination] =
        useState({
            currentPage: 1,
            totalPages: 0,
            totalUsers: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        });

    const [searchInput, setSearchInput] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [role, setRole] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [updatingUserId, setUpdatingUserId] =
        useState("");

    const loadUsers = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getAdminUsers({
                        search,
                        role,
                        status,
                        page,
                        limit: 10,
                    });

                setUsers(data.users || []);

                setPagination(
                    data.pagination || {}
                );
            } catch (requestError) {
                setError(
                    requestError.response?.data
                        ?.message ||
                    "Unable to fetch users."
                );
            } finally {
                setLoading(false);
            }
        },
        [
            search,
            role,
            status,
            page,
        ]
    );

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSearch = (event) => {
        event.preventDefault();

        setPage(1);

        setSearch(
            searchInput.trim()
        );
    };

    const handleRoleChange = (
        event
    ) => {
        setRole(event.target.value);
        setPage(1);
    };

    const handleStatusChange = (
        event
    ) => {
        setStatus(event.target.value);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearchInput("");
        setSearch("");
        setRole("");
        setStatus("");
        setPage(1);
    };

    const handleStatusUpdate = async (
        user
    ) => {
        const nextStatus =
            !user.isActive;

        const action =
            nextStatus
                ? "activate"
                : "deactivate";

        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} ${user.firstName} ${user.lastName}'s account?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setUpdatingUserId(
                user.id
            );

            setError("");

            await updateAdminUserStatus(
                user.id,
                nextStatus
            );

            await loadUsers();
        } catch (requestError) {
            setError(
                requestError.response?.data
                    ?.message ||
                `Unable to ${action} user account.`
            );
        } finally {
            setUpdatingUserId("");
        }
    };

    const formatRole = (
        userRole
    ) => {
        return userRole
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );
    };

    const formatDate = (
        date
    ) => {
        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        ).format(
            new Date(date)
        );
    };

    const getInitials = (
        firstName,
        lastName
    ) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""
            }`.toUpperCase();
    };

    const activeUsers =
        users.filter(
            (user) => user.isActive
        ).length;

    const inactiveUsers =
        users.filter(
            (user) => !user.isActive
        ).length;

    return (
        <main className={styles.page}>
            <section
                className={styles.container}
            >
                <header
                    className={styles.header}
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
                            <ArrowLeft size={18} />

                            Dashboard
                        </button>

                        <p
                            className={
                                styles.eyebrow
                            }
                        >
                            ADMIN CONTROL CENTER
                        </p>

                        <h1>User Management</h1>

                        <p
                            className={
                                styles.subtitle
                            }
                        >
                            Search, filter, and
                            monitor registered
                            platform users.
                        </p>
                    </div>

                    <div
                        className={
                            styles.totalUsers
                        }
                    >
                        <Users size={24} />

                        <div>
                            <span>
                                Total Users
                            </span>

                            <strong>
                                {
                                    pagination.totalUsers
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
                            <Users size={22} />
                        </div>

                        <div>
                            <span>
                                Visible Users
                            </span>

                            <strong>
                                {users.length}
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
                            <UserCheck
                                size={22}
                            />
                        </div>

                        <div>
                            <span>
                                Active on Page
                            </span>

                            <strong>
                                {activeUsers}
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
                            <UserX size={22} />
                        </div>

                        <div>
                            <span>
                                Inactive on Page
                            </span>

                            <strong>
                                {inactiveUsers}
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
                            <ShieldCheck
                                size={22}
                            />
                        </div>

                        <div>
                            <span>
                                Current Page
                            </span>

                            <strong>
                                {
                                    pagination.currentPage
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
                            <Search size={19} />

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
                                placeholder="Search by name or email"
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
                                value={role}
                                onChange={
                                    handleRoleChange
                                }
                                aria-label="Filter users by role"
                            >
                                <option value="">
                                    All Roles
                                </option>

                                <option value="STUDENT">
                                    Students
                                </option>

                                <option value="TEACHER">
                                    Teachers
                                </option>

                                <option value="ADMIN">
                                    Admins
                                </option>

                                <option value="SUPER_ADMIN">
                                    Super Admins
                                </option>
                            </select>

                            <select
                                value={status}
                                onChange={
                                    handleStatusChange
                                }
                                aria-label="Filter users by status"
                            >
                                <option value="">
                                    All Statuses
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
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
                                    loadUsers
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
                            Loading users...
                        </div>
                    ) : users.length ===
                        0 ? (
                        <div
                            className={
                                styles.stateMessage
                            }
                        >
                            <Users size={38} />

                            <h2>
                                No users found
                            </h2>

                            <p>
                                Try changing your
                                search or filter
                                options.
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
                                        <th>User</th>

                                        <th>Role</th>

                                        <th>Status</th>

                                        <th>
                                            Last Login
                                        </th>

                                        <th>
                                            Joined
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map(
                                        (user) => (
                                            <tr
                                                key={
                                                    user.id
                                                }
                                            >
                                                <td>
                                                    <div
                                                        className={
                                                            styles.userCell
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.avatar
                                                            }
                                                        >
                                                            {getInitials(
                                                                user.firstName,
                                                                user.lastName
                                                            )}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {
                                                                    user.firstName
                                                                }{" "}
                                                                {
                                                                    user.lastName
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    user.email
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            styles.roleBadge
                                                        }
                                                    >
                                                        {formatRole(
                                                            user.role
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            user.isActive
                                                                ? styles.activeBadge
                                                                : styles.inactiveBadge
                                                        }
                                                    >
                                                        {user.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>

                                                <td>
                                                    {user.lastLogin
                                                        ? formatDate(
                                                            user.lastLogin
                                                        )
                                                        : "Never"}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        user.createdAt
                                                    )}
                                                </td>
                                                <td>
                                                    {user.role ===
                                                        "SUPER_ADMIN" ? (
                                                        <span
                                                            className={
                                                                styles.protectedText
                                                            }
                                                        >
                                                            Protected
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className={
                                                                user.isActive
                                                                    ? styles.deactivateButton
                                                                    : styles.activateButton
                                                            }
                                                            disabled={
                                                                updatingUserId ===
                                                                user.id
                                                            }
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            {updatingUserId ===
                                                                user.id
                                                                ? "Updating..."
                                                                : user.isActive
                                                                    ? "Deactivate"
                                                                    : "Activate"}
                                                        </button>
                                                    )}
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
                                {users.length}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {
                                    pagination.totalUsers
                                }
                            </strong>{" "}
                            users
                        </p>

                        <div>
                            <button
                                type="button"
                                disabled={
                                    !pagination.hasPreviousPage ||
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
                                    pagination.currentPage
                                }{" "}
                                of{" "}
                                {Math.max(
                                    pagination.totalPages ||
                                    0,
                                    1
                                )}
                            </span>

                            <button
                                type="button"
                                disabled={
                                    !pagination.hasNextPage ||
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

export default AdminUsersPage;