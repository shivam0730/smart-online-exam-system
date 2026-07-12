import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Clock,
  GraduationCap,
} from "lucide-react";

import {
  getActiveAttempt,
  saveExamAnswer,
  startExam,
  submitExam,
} from "../../services/studentService";

import styles from "./ExamAttemptPage.module.css";

function ExamAttemptPage() {
  const { examId } = useParams();

  const navigate = useNavigate();

  const [attempt, setAttempt] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    selectedAnswers,
    setSelectedAnswers,
  ] = useState({});

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    remainingSeconds,
    setRemainingSeconds,
  ] = useState(null);

  const hasAutoSubmitted =
    useRef(false);

  useEffect(() => {
    const loadExam = async () => {
      try {
        setIsLoading(true);
        setError("");

        let attemptData;

        try {
          attemptData =
            await getActiveAttempt(
              examId
            );
        } catch (
        activeAttemptError
        ) {
          const status =
            activeAttemptError
              .response
              ?.status;

          if (status !== 404) {
            throw activeAttemptError;
          }

          attemptData =
            await startExam(
              examId
            );
        }

        setAttempt(
          attemptData.attempt
        );

        const savedAnswers = {};

        attemptData.attempt
          ?.answers
          ?.forEach((answer) => {
            savedAnswers[
              answer.questionId
            ] =
              answer.selectedOptionId;
          });

        setSelectedAnswers(
          savedAnswers
        );
      } catch (requestError) {
        setError(
          requestError.response
            ?.data?.message ||
          "Unable to load the exam."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [examId]);
  useEffect(() => {
    if (
      !attempt?.attemptDeadline
    ) {
      return undefined;
    }

    const updateTimer = () => {
      const deadline =
        new Date(
          attempt.attemptDeadline
        ).getTime();

      const secondsLeft =
        Math.max(
          0,
          Math.ceil(
            (
              deadline -
              Date.now()
            ) / 1000
          )
        );

      setRemainingSeconds(
        secondsLeft
      );
    };

    updateTimer();

    const timerId =
      window.setInterval(
        updateTimer,
        1000
      );

    return () => {
      window.clearInterval(
        timerId
      );
    };
  }, [
    attempt?.attemptDeadline,
  ]);

  useEffect(() => {
    if (
      remainingSeconds !== 0 ||
      !attempt ||
      hasAutoSubmitted.current
    ) {
      return;
    }

    hasAutoSubmitted.current =
      true;

    const autoSubmitExam =
      async () => {
        try {
          setIsSubmitting(true);
          setError(
            "Time is over. Submitting your exam..."
          );

          await submitExam(
            examId
          );

          navigate(
            `/student/results/${examId}`,
            {
              replace: true,
            }
          );
        } catch (
        requestError
        ) {
          setError(
            requestError.response
              ?.data?.message ||
            "Time expired, but the exam could not be submitted automatically."
          );
        } finally {
          setIsSubmitting(
            false
          );
        }
      };

    autoSubmitExam();
  }, [
    remainingSeconds,
    attempt,
    examId,
    navigate,
  ]);

  const handleSelectAnswer = async (
    questionId,
    optionId
  ) => {
    try {
      setIsSaving(true);
      setError("");

      await saveExamAnswer(
        examId,
        {
          questionId,
          selectedOptionId:
            optionId,
        }
      );

      setSelectedAnswers(
        (previousAnswers) => ({
          ...previousAnswers,
          [questionId]:
            optionId,
        })
      );
    } catch (requestError) {
      setError(
        requestError.response
          ?.data?.message ||
        "Unable to save your answer."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitExam =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to submit the exam?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setIsSubmitting(true);
        setError("");

        await submitExam(examId);

        navigate(
          `/student/results/${examId}`
        );

      } catch (requestError) {
        setError(
          requestError.response
            ?.data?.message ||
          "Unable to submit the exam."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  if (isLoading) {
    return (
      <main
        className={
          styles.statePage
        }
      >
        <p>
          Preparing your exam...
        </p>
      </main>
    );
  }

  if (!attempt) {
    return (
      <main
        className={
          styles.statePage
        }
      >
        <div
          className={
            styles.errorCard
          }
        >
          <GraduationCap
            size={42}
          />

          <h1>
            Unable to open exam
          </h1>

          <p>
            {error ||
              "Exam attempt was not found."}
          </p>

          <Link
            to="/student/dashboard"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const questions =
    attempt?.exam?.questions ||
    [];

  const currentQuestion =
    questions[0];
  const displaySeconds =
    remainingSeconds ??
    attempt.exam.duration *
    60;

  const timerMinutes =
    Math.floor(
      displaySeconds / 60
    );

  const timerSeconds =
    displaySeconds % 60;

  const formattedTime =
    `${String(
      timerMinutes
    ).padStart(
      2,
      "0"
    )}:${String(
      timerSeconds
    ).padStart(
      2,
      "0"
    )}`;

  return (
    <div
      className={
        styles.examPage
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div
          className={
            styles.brand
          }
        >
          <GraduationCap
            size={30}
          />

          <span>
            SmartExam
          </span>
        </div>

        <div
          className={
            styles.timer
          }
        >
          <Clock size={20} />

          {formattedTime}
        </div>
      </header>

      <main
        className={
          styles.main
        }
      >
        <section
          className={
            styles.examHeading
          }
        >
          <span>
            EXAM IN PROGRESS
          </span>

          <h1>
            {
              attempt?.exam
                ?.title
            }
          </h1>

          <p>
            {
              attempt?.exam
                ?.instructions
            }
          </p>
        </section>

        {currentQuestion ? (
          <section
            className={
              styles.questionPanel
            }
          >
            <div
              className={
                styles.questionHeader
              }
            >
              <span>
                Question 1 of{" "}
                {
                  questions.length
                }
              </span>

              <strong>
                {
                  currentQuestion
                    .marks
                }{" "}
                marks
              </strong>
            </div>

            <h2>
              {
                currentQuestion
                  .question
              }
            </h2>

            <div
              className={
                styles.options
              }
            >
              {currentQuestion
                .options
                ?.map(
                  (
                    option,
                    index
                  ) => (
                    <button
                      type="button"
                      key={
                        option.id
                      }
                      disabled={
                        isSaving ||
                        isSubmitting
                      }
                      className={`${styles.option} ${selectedAnswers[
                        currentQuestion
                          .id
                      ] ===
                        option.id
                        ? styles.selectedOption
                        : ""
                        }`}
                      onClick={() =>
                        handleSelectAnswer(
                          currentQuestion
                            .id,
                          option.id
                        )
                      }
                    >
                      <span>
                        {String.fromCharCode(
                          65 +
                          index
                        )}
                      </span>

                      {
                        option.option
                      }
                    </button>
                  )
                )}
            </div>
          </section>
        ) : (
          <p>
            No questions are
            available for this
            exam.
          </p>
        )}

        <div
          className={
            styles.examActions
          }
        >
          {error && (
            <p
              className={
                styles.answerError
              }
            >
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={
              isSaving ||
              isSubmitting ||
              !currentQuestion
            }
            onClick={
              handleSubmitExam
            }
          >
            {isSubmitting
              ? "Submitting..."
              : isSaving
                ? "Saving answer..."
                : "Submit Exam"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default ExamAttemptPage;





