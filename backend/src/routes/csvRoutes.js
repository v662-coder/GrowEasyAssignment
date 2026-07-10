import express from 'express';
import multer from 'multer';
import { processCSV, extractWithAI } from '../controllers/csvController.js';

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// ✅ Upload endpoint (matches frontend)
router.post('/upload', upload.single('file'), processCSV);

// Preview endpoint
router.post('/preview', upload.single('csvFile'), processCSV);

// Process with AI
router.post('/process', extractWithAI);

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'CSV routes are working!',
    timestamp: new Date().toISOString()
  });
});

export default router;