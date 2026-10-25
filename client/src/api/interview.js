import api from './axios';

export const getQuestions = () => api.get('/interview').then((res) => res.data);
export const generateQuestions = (jobDescriptionId) =>
  api.post('/interview/generate', { jobDescriptionId: jobDescriptionId || undefined }).then((res) => res.data);
export const submitAnswer = (id, answer) => api.put(`/interview/${id}/answer`, { answer }).then((res) => res.data);
export const deleteQuestion = (id) => api.delete(`/interview/${id}`);