import api from "./api";

export const getHomeData = async () => {
    const response = await api.get("/public/home");
    return response.data.data;
};