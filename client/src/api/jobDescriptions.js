import api from './axios';

export const getJobDescriptions = () => api.get('/job-descriptions').then((res) => res.data);
export const createJobDescription = (rawText) => api.post('/job-descriptions', { rawText }).then((res) => res.data);
export const deleteJobDescription = (id) => api.delete(`/job-descriptions/${id}`);
export const analyzeMatch = (id) => api.post(`/job-descriptions/${id}/analyze`).then((res) => res.data);
export const getMatchAnalyses = (id) => api.get(`/job-descriptions/${id}/analyses`).then((res) => res.data);