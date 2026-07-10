import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const csvAPI = {
  // Step 2: Preview CSV - USE THIS ENDPOINT
  previewCSV: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return api.post('/csv/preview', formData, {  
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Step 3 & 4: Process with AI
  processCSV: (csvData) => {
    return api.post('/csv/process', { csvData });
  },
};

export default api;