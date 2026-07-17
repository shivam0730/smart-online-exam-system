import api from "./api";

export const getAdminDashboard = async () => {
  const response = await api.get(
    "/admin/dashboard"
  );

  return response.data.data;
};

export const getAdminUsers = async ({
  search = "",
  role = "",
  status = "",
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get(
    "/admin/users",
    {
      params: {
        search,
        role,
        status,
        page,
        limit,
      },
    }
  );

  return response.data.data;
};

export const updateAdminUserStatus = async (
  userId,
  isActive
) => {
  const response = await api.patch(
    `/admin/users/${userId}/status`,
    {
      isActive,
    }
  );

  return response.data;
};

export const createAdminTeacher = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const response = await api.post(
    "/admin/users/teachers",
    {
      firstName,
      lastName,
      email,
      password,
    }
  );

  return response.data;
};

// Get all exams for admin
export const getAdminExams = async ({
  search = "",
  status = "",
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get(
    "/admin/exams",
    {
      params: {
        search,
        status,
        page,
        limit,
      },
    }
  );

  return response.data.data;
};

// Get a single exam with complete details
export const getAdminExamById = async (
  examId
) => {
  const response = await api.get(
    `/admin/exams/${examId}`
  );

  return response.data.data;
};

// Archive an exam
export const archiveAdminExam = async (
  examId
) => {
  const response = await api.patch(
    `/admin/exams/${examId}/archive`
  );

  return response.data;
};

// Delete an exam
export const deleteAdminExam = async (
  examId
) => {
  const response = await api.delete(
    `/admin/exams/${examId}`
  );

  return response.data;
};

// Get all results for admin
export const getAdminResults = async ({
  search = "",
  status = "",
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get(
    "/admin/results",
    {
      params: {
        search,
        status,
        page,
        limit,
      },
    }
  );

  return response.data.data;
};

// Get complete details of a single result
export const getAdminResultById = async (
  resultId
) => {
  const response = await api.get(
    `/admin/results/${resultId}`
  );

  return response.data.data;
};