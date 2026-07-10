import csv from 'csv-parser';
import { Readable } from 'stream';

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString());
    
    stream
      .pipe(csv())
      .on('data', (data) => {
        // Clean up keys (remove BOM, trim whitespace)
        const cleanData = {};
        Object.keys(data).forEach(key => {
          const cleanKey = key.replace(/^\uFEFF/, '').trim();
          cleanData[cleanKey] = data[key]?.trim() || '';
        });
        results.push(cleanData);
      })
      .on('end', () => {
        console.log(`✅ Parsed ${results.length} rows`);
        console.log(`📋 Headers:`, Object.keys(results[0] || {}));
        resolve(results);
      })
      .on('error', (error) => {
        console.error('❌ CSV Parse Error:', error);
        reject(error);
      });
  });
};