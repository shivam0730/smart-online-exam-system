const getAttemptDeadline = (startedAt, duration, examEndTime) => {
  const startedAtDate = new Date(startedAt);
  const examEndTimeDate = new Date(examEndTime);

  const durationDeadline = new Date(
    startedAtDate.getTime() + duration * 60 * 1000
  );

  return durationDeadline < examEndTimeDate
    ? durationDeadline
    : examEndTimeDate;
};

const isAttemptExpired = (startedAt, duration, examEndTime) => {
  const deadline = getAttemptDeadline(
    startedAt,
    duration,
    examEndTime
  );

  return new Date() >= deadline;
};

module.exports = {
  getAttemptDeadline,
  isAttemptExpired,
};
