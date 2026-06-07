import axios from 'axios';

// ✅ FIX 404: Gunakan window.location.hostname secara dinamis!
// Biar kalau lo akses dari 127.0.0.1 atau 192.168.1.11, Axios otomatis ngikutin IP-nya Bal.
const getBaseURL = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:8000`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// ✅ FIX 422: Hapus penguncian 'Content-Type': 'application/json' dari instance default!
// Biar pas kita ngirim FormData, Axios otomatis bisa ngeset jadi 'multipart/form-data' secara legal.

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kalren_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;