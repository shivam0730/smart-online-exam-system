import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getTeacherProfile,
} from "../../services/teacherService";

import styles from "./TeacherProfilePage.module.css";

const TeacherProfilePage = () => {
  const navigate = useNavigate();

  const [
    teacher,
    setTeacher,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const fetchTeacherProfile =
    async () => {
      try {
        setLoading(true);

        setError("");

        const profileData =
          await getTeacherProfile();

        setTeacher(
          profileData
        );
      } catch (error) {
        const message =
          error.response
            ?.data
            ?.message ||
          "Unable to load teacher profile.";

        setError(
          message
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  const teacherName =
    teacher
      ? `${teacher.firstName} ${teacher.lastName}`
      : "";

  const teacherInitials =
    teacher
      ? `${teacher.firstName?.[0] || ""}${
          teacher.lastName?.[0] || ""
        }`.toUpperCase()
      : "";

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Date(
      dateValue
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
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
            Loading teacher
            profile...
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
            profile
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              fetchTeacherProfile
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
                "/teacher/dashboard"
              )
            }
          >
            ← Teacher Dashboard
          </button>

          <p>
            Teacher Account
          </p>

          <h1>
            My Profile
          </h1>

          <span>
            Review your account
            information and teacher
            access details.
          </span>
        </header>

        <section
          className={
            styles.profileLayout
          }
        >
          <article
            className={
              styles.profileCard
            }
          >
            <div
              className={
                styles.avatar
              }
            >
              {
                teacherInitials
              }
            </div>

            <h2>
              {teacherName}
            </h2>

            <p>
              {teacher.email}
            </p>

            <span
              className={
                styles.roleBadge
              }
            >
              {teacher.role}
            </span>

            <div
              className={
                styles.accountStatus
              }
            >
              <span>
                Account Status
              </span>

              <strong>
                {teacher.isActive
                  ? "Active"
                  : "Inactive"}
              </strong>
            </div>
          </article>

          <article
            className={
              styles.detailsCard
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <div>
                <p>
                  Profile Details
                </p>

                <h2>
                  Personal
                  Information
                </h2>
              </div>

              <span>
                Verified Teacher
              </span>
            </div>

            <div
              className={
                styles.detailsGrid
              }
            >
              <div>
                <span>
                  First Name
                </span>

                <strong>
                  {
                    teacher
                      .firstName
                  }
                </strong>
              </div>

              <div>
                <span>
                  Last Name
                </span>

                <strong>
                  {
                    teacher
                      .lastName
                  }
                </strong>
              </div>

              <div>
                <span>
                  Email Address
                </span>

                <strong>
                  {
                    teacher
                      .email
                  }
                </strong>
              </div>

              <div>
                <span>
                  Account Role
                </span>

                <strong>
                  {
                    teacher
                      .role
                  }
                </strong>
              </div>

              <div>
                <span>
                  Account Created
                </span>

                <strong>
                  {formatDate(
                    teacher
                      .createdAt
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Last Updated
                </span>

                <strong>
                  {formatDate(
                    teacher
                      .updatedAt
                  )}
                </strong>
              </div>
            </div>
          </article>
        </section>

        <section
          className={
            styles.actions
          }
        >
          <div>
            <p>
              Teacher Workspace
            </p>

            <h2>
              Continue Managing
              Your Examinations
            </h2>

            <span>
              Access exams,
              questions and student
              performance from your
              teacher workspace.
            </span>
          </div>

          <div
            className={
              styles.actionButtons
            }
          >
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

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/teacher/results"
                )
              }
            >
              View Results
            </button>
          </div>
        </section>
      </section>
    </main>
  );
};

export default TeacherProfilePage;