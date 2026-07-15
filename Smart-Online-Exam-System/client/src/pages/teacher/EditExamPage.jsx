import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getExamById,
  updateExam,
} from "../../services/teacherService";

import styles from "./CreateExamPage.module.css";

const initialFormData = {
  title: "",
  description: "",
  instructions: "",
  duration: "",
  totalMarks: "",
  passingMarks: "",
  startTime: "",
  endTime: "",
};

const EditExamPage = () => {
  const navigate = useNavigate();

  const { examId } =
    useParams();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    formData,
    setFormData,
  ] = useState(initialFormData);

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    apiError,
    setApiError,
  ] = useState("");
  useEffect(() => {
    const formatForInput = (
      date
    ) => {
      const value =
        new Date(date);

      const timezoneOffset =
        value.getTimezoneOffset() *
        60000;

      return new Date(
        value.getTime() -
        timezoneOffset
      )
        .toISOString()
        .slice(0, 16);
    };

    const loadExam = async () => {
      try {
        setLoading(true);
        setApiError("");

        const exam =
          await getExamById(
            examId
          );

        setFormData({
          title:
            exam.title || "",

          description:
            exam.description || "",

          instructions:
            exam.instructions || "",

          duration:
            String(
              exam.duration
            ),

          totalMarks:
            String(
              exam.totalMarks
            ),

          passingMarks:
            String(
              exam.passingMarks
            ),

          startTime:
            formatForInput(
              exam.startTime
            ),

          endTime:
            formatForInput(
              exam.endTime
            ),
        });
      } catch (error) {
        setApiError(
          error.response
            ?.data
            ?.message ||
          "Unable to load the exam."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      })
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,
        [name]: "",
      })
    );

    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};

    const title =
      formData.title.trim();

    const duration =
      Number(formData.duration);

    const totalMarks =
      Number(formData.totalMarks);

    const passingMarks =
      Number(formData.passingMarks);

    if (!title) {
      newErrors.title =
        "Exam title is required.";
    } else if (
      title.length < 5
    ) {
      newErrors.title =
        "Title must contain at least 5 characters.";
    } else if (
      title.length > 100
    ) {
      newErrors.title =
        "Title cannot exceed 100 characters.";
    }

    if (
      formData.duration === ""
    ) {
      newErrors.duration =
        "Duration is required.";
    } else if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 600
    ) {
      newErrors.duration =
        "Duration must be between 1 and 600 minutes.";
    }

    if (
      formData.totalMarks === ""
    ) {
      newErrors.totalMarks =
        "Total marks are required.";
    } else if (
      !Number.isInteger(
        totalMarks
      ) ||
      totalMarks < 1
    ) {
      newErrors.totalMarks =
        "Total marks must be at least 1.";
    }

    if (
      formData.passingMarks === ""
    ) {
      newErrors.passingMarks =
        "Passing marks are required.";
    } else if (
      !Number.isInteger(
        passingMarks
      ) ||
      passingMarks < 1
    ) {
      newErrors.passingMarks =
        "Passing marks cannot be negative and must be at least 1.";
    } else if (
      formData.totalMarks !== "" &&
      passingMarks > totalMarks
    ) {
      newErrors.passingMarks =
        "Passing marks cannot be greater than total marks.";
    }

    if (!formData.startTime) {
      newErrors.startTime =
        "Start date and time are required.";
    }

    if (!formData.endTime) {
      newErrors.endTime =
        "End date and time are required.";
    } else if (
      formData.startTime &&
      new Date(
        formData.endTime
      ) <=
        new Date(
          formData.startTime
        )
    ) {
      newErrors.endTime =
        "End time must be after the start time.";
    }

    setErrors(newErrors);
  if (loading) {
    return (
      <main className={styles.page}>
        <section
          className={
            styles.container
          }
        >
          <p>
            Loading exam details...
          </p>
        </section>
      </main>
    );
  }

    return (
      Object.keys(
        newErrors
      ).length === 0
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setApiError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const examData = {
        title:
          formData.title.trim(),

        description:
          formData.description
            .trim(),

        instructions:
          formData.instructions
            .trim(),

        duration:
          Number(
            formData.duration
          ),

        totalMarks:
          Number(
            formData.totalMarks
          ),

        passingMarks:
          Number(
            formData.passingMarks
          ),

        startTime:
          new Date(
            formData.startTime
          ).toISOString(),

        endTime:
          new Date(
            formData.endTime
          ).toISOString(),
      };

      await updateExam(
        examId,
        examData
      );

      navigate(
        "/teacher/exams",
        {
          replace: true,
        }
      );
    } catch (error) {
      const message =
        error.response
          ?.data
          ?.message ||
        "Unable to update the exam.";

      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <main className={styles.page}>
        <section
          className={
            styles.container
          }
        >
          <p>
            Loading exam details...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
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
            onClick={() =>
              navigate(
                "/teacher/exams"
              )
            }
          >
          ← Back to My Exams
          </button>

          <p>
            Teacher Exam Management
          </p>

          <h1>
            Edit Exam
          </h1>

          <span>
            Update the exam details, schedule and marking settings.
          </span>
        </header>

        <form
          className={
            styles.form
          }
          onSubmit={
            handleSubmit
          }
          noValidate
        >
          {apiError && (
            <div
              className={
                styles.apiError
              }
            >
              {apiError}
            </div>
          )}

          <section
            className={
              styles.formSection
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <span>01</span>

              <div>
                <h2>
                  Basic Information
                </h2>

                <p>
                  Add the exam title,
                  description and
                  instructions.
                </p>
              </div>
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="title"
              >
                Exam Title
                <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                placeholder="Example: Java Programming Final Exam"
                maxLength="100"
              />

              {errors.title && (
                <small>
                  {errors.title}
                </small>
              )}
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="description"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Describe the purpose and topics covered in this exam."
                rows="4"
              />
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="instructions"
              >
                Exam Instructions
              </label>

              <textarea
                id="instructions"
                name="instructions"
                value={
                  formData.instructions
                }
                onChange={
                  handleChange
                }
                placeholder="Example: Answer all questions. Do not refresh the page."
                rows="4"
              />
            </div>
          </section>

          <section
            className={
              styles.formSection
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <span>02</span>

              <div>
                <h2>
                  Marks and Duration
                </h2>

                <p>
                  Configure exam
                  duration and passing
                  requirements.
                </p>
              </div>
            </div>

            <div
              className={
                styles.threeColumns
              }
            >
              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="duration"
                >
                  Duration
                  <span>*</span>
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  max="600"
                  value={
                    formData.duration
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="60"
                />

                <em>
                  In minutes
                </em>

                {errors.duration && (
                  <small>
                    {
                      errors.duration
                    }
                  </small>
                )}
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="totalMarks"
                >
                  Total Marks
                  <span>*</span>
                </label>

                <input
                  id="totalMarks"
                  name="totalMarks"
                  type="number"
                  min="1"
                  value={
                    formData.totalMarks
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="100"
                />

                {errors.totalMarks && (
                  <small>
                    {
                      errors.totalMarks
                    }
                  </small>
                )}
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="passingMarks"
                >
                  Passing Marks
                  <span>*</span>
                </label>

                <input
                  id="passingMarks"
                  name="passingMarks"
                  type="number"
                  min="1"
                  value={
                    formData.passingMarks
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="40"
                />

                {errors.passingMarks && (
                  <small>
                    {
                      errors.passingMarks
                    }
                  </small>
                )}
              </div>
            </div>
          </section>

          <section
            className={
              styles.formSection
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <span>03</span>

              <div>
                <h2>
                  Exam Schedule
                </h2>

                <p>
                  Select when students
                  can access the exam.
                </p>
              </div>
            </div>

            <div
              className={
                styles.twoColumns
              }
            >
              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="startTime"
                >
                  Start Date and Time
                  <span>*</span>
                </label>

                <input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={
                    formData.startTime
                  }
                  onChange={
                    handleChange
                  }
                />

                {errors.startTime && (
                  <small>
                    {
                      errors.startTime
                    }
                  </small>
                )}
              </div>

              <div
                className={
                  styles.field
                }
              >
                <label
                  htmlFor="endTime"
                >
                  End Date and Time
                  <span>*</span>
                </label>

                <input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={
                    formData.endTime
                  }
                  onChange={
                    handleChange
                  }
                />

                {errors.endTime && (
                  <small>
                    {
                      errors.endTime
                    }
                  </small>
                )}
              </div>
            </div>
          </section>

          <footer
            className={
              styles.formActions
            }
          >
            <button
              type="button"
              className={
                styles.cancelButton
              }
              onClick={() =>
                navigate(
                  "/teacher/exams"
                )
              }
              disabled={
                submitting
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className={
                styles.submitButton
              }
              disabled={
                submitting
              }
            >
              {submitting
                ? "Updating Exam..."
                : "Update Exam"}
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default EditExamPage;




