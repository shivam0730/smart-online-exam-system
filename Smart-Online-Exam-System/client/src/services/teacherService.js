import api from "./api";

/*
|--------------------------------------------------------------------------
| Teacher Dashboard
|--------------------------------------------------------------------------
*/

export const getTeacherDashboard = async () => {
  const response = await api.get(
    "/teacher/dashboard"
  );

  return response.data.data;
};

/*
|--------------------------------------------------------------------------
| Teacher Profile
|--------------------------------------------------------------------------
*/

export const getTeacherProfile = async () => {
  const response = await api.get(
    "/teacher/profile"
  );

  return response.data.data;
};

/*
|--------------------------------------------------------------------------
| Exam Management
|--------------------------------------------------------------------------
*/

export const getTeacherExams = async () => {
  const response = await api.get(
    "/exams"
  );

  return response.data.data;
};

export const createExam = async (examData) => {
  const response = await api.post(
    "/exams",
    examData
  );

  return response.data.data;
};

export const getExamById = async (examId) => {
  const response = await api.get(
    `/exams/${examId}`
  );

  return response.data.data;
};

export const updateExam = async (
  examId,
  examData
) => {
  const response = await api.patch(
    `/exams/${examId}`,
    examData
  );

  return response.data.data;
};

export const deleteExam = async (examId) => {
  const response = await api.delete(
    `/exams/${examId}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Exam Publishing
|--------------------------------------------------------------------------
*/

export const publishExam = async (examId) => {
  const response = await api.patch(
    `/exams/${examId}/publish`
  );

  return response.data.data;
};

export const unpublishExam = async (examId) => {
  const response = await api.patch(
    `/exams/${examId}/unpublish`
  );

  return response.data.data;
};

/*
|--------------------------------------------------------------------------
| Question Management
|--------------------------------------------------------------------------
*/

export const getExamQuestions = async (
  examId
) => {
  const response = await api.get(
    `/teacher/exams/${examId}/questions`
  );

  return response.data.data;
};

export const createQuestion = async (
  examId,
  questionData
) => {
  const response = await api.post(
    `/teacher/exams/${examId}/questions`,
    questionData
  );

  return response.data.data;
};

export const getQuestionStatistics = async (
  examId
) => {
  const response = await api.get(
    `/teacher/exams/${examId}/stats`
  );

  return response.data.data;
};


/*
|--------------------------------------------------------------------------
| Delete Question
|--------------------------------------------------------------------------
*/

export const deleteQuestion = async (
  questionId
) => {
  const response = await api.delete(
    `/teacher/${questionId}`
  );

  return response.data;
};


/*
|--------------------------------------------------------------------------
| Duplicate Question
|--------------------------------------------------------------------------
*/

export const duplicateQuestion = async (
  questionId
) => {
  const response = await api.post(
    `/teacher/questions/${questionId}/duplicate`
  );

  return response.data.data;
};


/*
|--------------------------------------------------------------------------
| Get Question By ID
|--------------------------------------------------------------------------
*/

export const getQuestionById = async (
  questionId
) => {
  const response = await api.get(
    `/teacher/${questionId}`
  );

  return response.data.data;
};

/*
|--------------------------------------------------------------------------
| Update Question
|--------------------------------------------------------------------------
*/

export const updateQuestion = async (
  questionId,
  questionData
) => {
  const response = await api.put(
    `/teacher/${questionId}`,
    questionData
  );

  return response.data.data;
};



/*
|--------------------------------------------------------------------------
| Update Question Status
|--------------------------------------------------------------------------
*/

export const updateQuestionStatus = async (
  questionId,
  isActive
) => {
  const response = await api.patch(
    `/teacher/questions/${questionId}/status`,
    {
      isActive,
    }
  );

  return response.data.data;
};



/*
|--------------------------------------------------------------------------
| Teacher Result Management
|--------------------------------------------------------------------------
*/

export const getAllTeacherResults = async () => {
  const response = await api.get(
    "/teacher/results"
  );

  return response.data.data;
};

export const getTeacherExamResults = async (
  examId
) => {
  const response = await api.get(
    `/teacher/exams/${examId}/results`
  );

  return response.data.data;
};

export const getTeacherExamPerformance = async (
  examId
) => {
  const response = await api.get(
    `/teacher/exams/${examId}/performance`
  );

  return response.data.data;
};