import api from './axios';

export const getProfile = () => api.get('/profile').then((res) => res.data);
export const updateProfile = (data) => api.put('/profile', data).then((res) => res.data);