import axios from 'axios';

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log(`🔧 API URL: ${API_URL}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
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