import api from "./api";

export const getAvailableExams = async () => {
  const response = await api.get(
    "/student/exams/available"
  );

  return response.data.data;
};

export const getPerformanceStatistics = async () => {
  const response = await api.get(
    "/student/results/statistics"
  );

  return response.data.data;
};

export const startExam = async (examId) => {
  const response = await api.post(
    `/student/exams/${examId}/start`
  );

  return response.data.data;
};

export const getActiveAttempt = async (examId) => {
  const response = await api.get(
    `/student/exams/${examId}/attempt`
  );

  return response.data.data;
};

export const saveExamAnswer = async (
  examId,
  answerData
) => {
  const response = await api.put(
    `/student/exams/${examId}/answer`,
    answerData
  );

  return response.data.data;
};

export const submitExam = async (examId) => {
  const response = await api.post(
    `/student/exams/${examId}/submit`
  );

  return response.data.data;
};


export const getExamResult = async (
  examId
) => {
  const response = await api.get(
    `/student/results/exams/${examId}`
  );

  return response.data.data;
};