import api from './axios';

export const getResumes = () => api.get('/resumes').then((res) => res.data);

export const uploadResume = (file, title) => {
  const formData = new FormData();
  formData.append('resume', file);
  if (title) formData.append('title', title);
  return api.post('/resumes', formData, { timeout: 60000 }).then((res) => res.data);
};

export const activateResume = (id) => api.put(`/resumes/${id}/activate`).then((res) => res.data);
export const analyzeResume = (id) => api.post(`/resumes/${id}/analyze`, null, { timeout: 90000 }).then((res) => res.data);
export const deleteResume = (id) => api.delete(`/resumes/${id}`);