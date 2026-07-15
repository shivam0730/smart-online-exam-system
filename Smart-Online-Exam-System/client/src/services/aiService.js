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

/*
|--------------------------------------------------------------------------
| Save AI-Generated Questions
|--------------------------------------------------------------------------
*/

export const saveAIQuestions = async (
  saveData
) => {
  const response = await api.post(
    "/ai/questions/save",
    saveData
  );

  return response.data.data;
};