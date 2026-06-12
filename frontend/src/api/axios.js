import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000'
      : 'https://backend-kalren.vercel.app',
  withCredentials: true,
});

// request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kalren_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401) {
      localStorage.removeItem('kalren_token');

      if (currentPath !== '/khususorangdalam') {
        window.location.href = '/khususorangdalam';
      }
    }

    if (status === 403) {
      if (currentPath !== '/forbidden') {
        window.location.href = '/forbidden';
      }
    }

    if ([500, 502, 503, 504].includes(status)) {
      if (currentPath !== '/server-error') {
        window.location.href = '/server-error';
      }
    }

    return Promise.reject(error);
  }
);

export default api;