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

import {
  updateUserProfile,
} from "../../services/userService";

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

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    formData,
    setFormData,
  ] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
  });

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

        setFormData({
          firstName:
            profileData
              .firstName || "",

          lastName:
            profileData
              .lastName || "",

          phone:
            profileData
              .phone || "",

          avatar:
            profileData
              .avatar || "",
        });
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

  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (
        previousData
      ) => ({
        ...previousData,

        [name]:
          value,
      })
    );
  };

  const handleEdit = () => {
    setSuccessMessage("");

    setError("");

    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      firstName:
        teacher.firstName ||
        "",

      lastName:
        teacher.lastName ||
        "",

      phone:
        teacher.phone ||
        "",

      avatar:
        teacher.avatar ||
        "",
    });

    setError("");

    setSuccessMessage("");

    setIsEditing(false);
  };

  const handleSave =
    async (
      event
    ) => {
      event.preventDefault();

      try {
        setIsSaving(true);

        setError("");

        setSuccessMessage("");

        const updatedProfile =
          await updateUserProfile(
            {
              firstName:
                formData
                  .firstName
                  .trim(),

              lastName:
                formData
                  .lastName
                  .trim(),

              phone:
                formData
                  .phone
                  .trim(),

              avatar:
                formData
                  .avatar
                  .trim(),
            }
          );

        setTeacher(
          updatedProfile
        );

        setFormData({
          firstName:
            updatedProfile
              .firstName ||
            "",

          lastName:
            updatedProfile
              .lastName ||
            "",

          phone:
            updatedProfile
              .phone ||
            "",

          avatar:
            updatedProfile
              .avatar ||
            "",
        });

        setSuccessMessage(
          "Profile updated successfully."
        );

        setIsEditing(
          false
        );
      } catch (error) {
        const message =
          error.response
            ?.data
            ?.message ||
          "Unable to update profile.";

        setError(
          message
        );
      } finally {
        setIsSaving(
          false
        );
      }
    };

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

  if (
    error &&
    !teacher
  ) {
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
            Review and manage
            your account
            information.
          </span>
        </header>

        {successMessage && (
          <div
            className={
              styles
                .successMessage
            }
          >
            {
              successMessage
            }
          </div>
        )}

        {error && (
          <div
            className={
              styles
                .errorMessage
            }
          >
            {error}
          </div>
        )}

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
              {teacher.avatar ? (
                <img
                  src={
                    teacher.avatar
                  }
                  alt={
                    teacherName
                  }
                />
              ) : (
                teacherInitials
              )}
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

              {!isEditing && (
                <button
                  type="button"
                  className={
                    styles
                      .editButton
                  }
                  onClick={
                    handleEdit
                  }
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form
                className={
                  styles.editForm
                }
                onSubmit={
                  handleSave
                }
              >
                <div
                  className={
                    styles
                      .formGrid
                  }
                >
                  <label>
                    <span>
                      First Name
                    </span>

                    <input
                      type="text"
                      name="firstName"
                      value={
                        formData
                          .firstName
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />
                  </label>

                  <label>
                    <span>
                      Last Name
                    </span>

                    <input
                      type="text"
                      name="lastName"
                      value={
                        formData
                          .lastName
                      }
                      onChange={
                        handleInputChange
                      }
                      required
                    />
                  </label>

                  <label>
                    <span>
                      Phone Number
                    </span>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData
                          .phone
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder=
                        "Enter phone number"
                    />
                  </label>

                  <label>
                    <span>
                      Profile Image
                      URL
                    </span>

                    <input
                      type="url"
                      name="avatar"
                      value={
                        formData
                          .avatar
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder=
                        "Paste image URL"
                    />
                  </label>
                </div>

                <div
                  className={
                    styles
                      .formActions
                  }
                >
                  <button
                    type="button"
                    className={
                      styles
                        .cancelButton
                    }
                    onClick={
                      handleCancel
                    }
                    disabled={
                      isSaving
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={
                      styles
                        .saveButton
                    }
                    disabled={
                      isSaving
                    }
                  >
                    {isSaving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div
                className={
                  styles
                    .detailsGrid
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
                    Phone Number
                  </span>

                  <strong>
                    {teacher.phone ||
                      "Not added"}
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
            )}
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