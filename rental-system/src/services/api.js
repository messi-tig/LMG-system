import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const lang = localStorage.getItem('lang') || 'en';
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = lang;
  return config;
});

export default api;
