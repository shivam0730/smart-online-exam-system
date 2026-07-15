import api from "./api";

export const updateUserProfile =
  async (profileData) => {
    const response =
      await api.patch(
        "/user/profile",
        profileData
      );

    return response.data.data;
  };