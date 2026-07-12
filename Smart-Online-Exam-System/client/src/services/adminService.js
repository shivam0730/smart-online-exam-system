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