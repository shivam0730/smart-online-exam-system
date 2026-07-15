import api from "./api";

/*
|--------------------------------------------------------------------------
| AI Question Generation
|--------------------------------------------------------------------------
*/

export const generateAIQuestions = async (
  generationData
) => {
  const response = await api.post(
    "/ai/questions/generate",
    generationData
  );

  return response.data.data;
};