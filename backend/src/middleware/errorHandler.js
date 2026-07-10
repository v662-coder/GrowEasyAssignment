module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'File size too large. Maximum 10MB allowed.' 
    });
  }

  if (err.message === 'Only CSV files are allowed') {
    return res.status(400).json({ error: err.message });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};
