import { parseCSV } from '../services/csvParser.js';

export const processCSV = async (req, res) => {
  try {
    console.log('📥 Received CSV file:', req.file?.originalname);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No CSV file uploaded'
      });
    }

    // Parse CSV
    const csvData = await parseCSV(req.file.buffer);
    console.log(`📊 Parsed ${csvData.length} rows`);
    
    // Send preview
    res.json({
      success: true,
      imported: csvData.length,
      skipped: 0,
      total: csvData.length,
      results: csvData.slice(0, 100),
      skippedRecords: []
    });
  } catch (error) {
    console.error('❌ CSV Processing Error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to process CSV'
    });
  }
};

export const extractWithAI = async (req, res) => {
  try {
    console.log('🤖 AI Extraction requested');
    const { csvData, batchSize = 50 } = req.body;
    
    if (!csvData || !Array.isArray(csvData)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid CSV data'
      });
    }

    // Mock processing
    const results = csvData.slice(0, 20).map((row, index) => ({
      created_at: new Date().toISOString(),
      name: row.name || row.FullName || row['Full Name'] || `Lead ${index + 1}`,
      email: row.email || row['Email Address'] || row.EmailID || `lead${index}@example.com`,
      country_code: row.country_code || '+91',
      mobile_without_country_code: row.mobile || row.Phone || row['Contact'] || '9876543210',
      company: row.company || row['Company Name'] || 'Unknown',
      city: row.city || row.Location || 'Mumbai',
      state: row.state || 'Maharashtra',
      country: row.country || 'India',
      lead_owner: 'test@gmail.com',
      crm_status: 'GOOD_LEAD_FOLLOW_UP',
      crm_note: 'Extracted via AI',
      data_source: 'leads_on_demand',
      possession_time: '',
      description: ''
    }));

    res.json({
      success: true,
      imported: results.length,
      skipped: csvData.length - results.length,
      total: csvData.length,
      results: results,
      skippedRecords: []
    });
  } catch (error) {
    console.error('❌ AI Extraction Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'AI processing failed'
    });
  }
};