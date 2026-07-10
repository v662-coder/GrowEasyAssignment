import express from 'express';
import multer from 'multer';
import { processCSV, extractWithAI } from '../controllers/csvController.js';

const router = express.Router();

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

// ✅ ADD THIS - For your frontend
router.post('/upload', upload.single('file'), processCSV);

// Keep existing routes
router.get('/test', (req, res) => {
  res.json({ message: 'CSV routes are working!' });
});

router.post('/preview', upload.single('csvFile'), processCSV);
router.post('/process', extractWithAI);

export default router;