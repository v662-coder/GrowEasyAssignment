import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import csvRoutes from './routes/csvRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow ALL origins for testing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  credentials: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Routes
app.use('/api/csv', csvRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      upload: 'POST /api/csv/upload',
      preview: 'POST /api/csv/preview',
      process: 'POST /api/csv/process',
      test: 'GET /api/csv/test'
    }
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'GrowEasy Backend',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: 'GET /api/health',
      csvUpload: 'POST /api/csv/upload',
      csvPreview: 'POST /api/csv/preview',
      csvProcess: 'POST /api/csv/process',
    },
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});