import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import csvRoutes from './routes/csvRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow ALL origins in production (for testing)
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: false, // Must be false when origin is '*'
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Log all requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/csv', csvRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'GrowEasy Backend',
    version: '1.0.0',
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
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
});