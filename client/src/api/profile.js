import api from './axios';

export const getProfile = () => api.get('/profile').then((res) => res.data);
export const updateProfile = (data) => api.put('/profile', data).then((res) => res.data);

export const addEducation = (data) => api.post('/education', data).then((res) => res.data);
export const deleteEducation = (id) => api.delete(`/education/${id}`);

export const addExperience = (data) => api.post('/experience', data).then((res) => res.data);
export const deleteExperience = (id) => api.delete(`/experience/${id}`);

export const addProject = (data) => api.post('/projects', data).then((res) => res.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const addCertification = (data) => api.post('/certifications', data).then((res) => res.data);
export const deleteCertification = (id) => api.delete(`/certifications/${id}`);