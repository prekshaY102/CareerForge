import api from './axios';

export const getApplications = () => api.get('/applications').then((res) => res.data);
export const createApplication = (data) => api.post('/applications', data).then((res) => res.data);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data).then((res) => res.data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);