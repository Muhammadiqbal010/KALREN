import axios from 'axios';

const getBaseURL = () => {
  // Jika di lokal (npm start), pakai port 8000
  // Jika di Vercel (npm run build), pakai URL production
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000'; 
  }
  return 'https://backend-kalren.vercel.app';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // WAJIB untuk kirim token via cookie
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kalren_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;