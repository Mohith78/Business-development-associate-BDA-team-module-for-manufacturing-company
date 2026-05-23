import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartcrm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data)
};

export const userApi = {
  list: () => api.get('/users').then((res) => res.data)
};

export const leadApi = {
  list: (params) => api.get('/leads', { params }).then((res) => res.data),
  get: (id) => api.get(`/leads/${id}`).then((res) => res.data),
  create: (payload) => api.post('/leads', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/leads/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/leads/${id}`).then((res) => res.data),
  addNote: (id, payload) => api.post(`/leads/${id}/notes`, payload).then((res) => res.data)
};

export const taskApi = {
  list: (params) => api.get('/tasks', { params }).then((res) => res.data),
  create: (payload) => api.post('/tasks', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
  addComment: (id, payload) => api.post(`/tasks/${id}/comments`, payload).then((res) => res.data)
};

export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard').then((res) => res.data),
  activities: () => api.get('/analytics/activities').then((res) => res.data)
};

export default api;
