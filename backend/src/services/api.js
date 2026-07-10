import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log('📤 API:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('📥 API:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const csvAPI = {
  previewCSV: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return api.post('/csv/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  processCSV: (csvData) => {
    return api.post('/csv/process', { csvData });
  },
};

export default api;
