import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const csvAPI = {
  // This is the correct endpoint - matches backend
  previewCSV: (file) => {
    console.log('📤 Uploading to /csv/preview');
    const formData = new FormData();
    formData.append('csvFile', file);
    return api.post('/csv/preview', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  processCSV: (csvData) => {
    console.log('🤖 Processing with AI');
    return api.post('/csv/process', { csvData });
  },
};

export default api;
