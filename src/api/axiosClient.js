import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const axiosClient = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:5000/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

axiosClient.interceptors.request.use((config) => {
  // Strip leading slash to prevent Axios from resolving against root
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.substring(1);
  }

  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
