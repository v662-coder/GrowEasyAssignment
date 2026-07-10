'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';

export default function Home() {
  const [csvData, setCsvData] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false); // NEW

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        trimHeaders: true,
      });

      if (result.data && result.data.length > 0) {
        setCsvData({
          file,
          records: result.data,
          headers: result.meta.fields,
        });
        setResults(null);
        setError(null);
        setShowCancelConfirm(false);
      }
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleConfirmImport = async () => {
    if (!csvData) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', csvData.file);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/csv/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000,
        }
      );

      setResults(response.data);
    } catch (err) {
      console.error('Import error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to import CSV');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Cancel function
  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  // ✅ NEW: Confirm cancel
  const handleConfirmCancel = () => {
    setCsvData(null);
    setResults(null);
    setError(null);
    setShowCancelConfirm(false);
  };

  // ✅ NEW: Close cancel dialog
  const handleCloseCancel = () => {
    setShowCancelConfirm(false);
  };

  // ✅ NEW: Reset everything
  const handleResetAll = () => {
    setCsvData(null);
    setResults(null);
    setError(null);
    setLoading(false);
    setShowCancelConfirm(false);
  };

  return (
    <div className="container">
      <h1>Vishnu GrowEasy CSV Importer</h1>
      <p className="subtitle">AI-powered CSV import for CRM data</p>

      <div className="step">
        <div className="step-header">
          <div className="step-number">1</div>
          <div className="step-title">Upload CSV</div>
        </div>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div>
            <p style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>
              {isDragActive ? 'Drop your CSV here' : 'Drag & drop CSV file here'}
            </p>
            <p style={{ color: '#666', marginTop: '10px' }}>
              or click to browse files
            </p>
            <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '5px' }}>
              Supports any CSV format
            </p>
          </div>
        </div>
      </div>

      {csvData && (
        <div className="step">
          <div className="step-header">
            <div className="step-number">2</div>
            <div className="step-title">Preview CSV Data</div>
          </div>
          <p style={{ marginBottom: '10px' }}>
            Showing {csvData.records.length} rows
          </p>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {csvData.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.records.slice(0, 100).map((row, index) => (
                  <tr key={index}>
                    {csvData.headers.map((header) => (
                      <td key={header}>{row[header] || ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.records.length > 100 && (
              <p style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                Showing first 100 rows...
              </p>
            )}
          </div>

          {/* ✅ UPDATED: Buttons with Cancel */}
          <div style={{ 
            marginTop: '20px', 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* ✅ NEW: Cancel Button */}
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '10px 30px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: '#6c757d',
                color: 'white',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = '#5a6268';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = '#6c757d';
              }}
            >
               Cancel
            </button>

            {/* Confirm Button - Existing */}
            <button
              className="btn btn-success"
              onClick={handleConfirmImport}
              disabled={loading}
              style={{
                padding: '10px 30px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = '#218838';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = '#28a745';
              }}
            >
              {loading ? '⏳ Processing...' : ' Confirm Import'}
            </button>
          </div>
        </div>
      )}

      {/* ✅ NEW: Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ marginBottom: '15px', fontSize: '20px' }}>⚠️ Cancel Import?</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Are you sure you want to cancel? Your uploaded CSV data will be lost.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseCancel}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                No, Keep Data
              </button>
              <button
                onClick={handleConfirmCancel}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <p style={{ fontSize: '2rem' }}>⏳</p>
          <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>
            Processing your data with AI...
          </p>
          <p style={{ color: '#666', marginTop: '5px' }}>
            This may take a few moments
          </p>
        </div>
      )}

      {error && (
        <div className="error" style={{ padding: '15px', background: '#fee', borderRadius: '10px' }}>
          <p>❌ <strong>Error:</strong> {error}</p>
          <button
            onClick={handleResetAll}
            style={{
              marginTop: '10px',
              padding: '6px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#dc3545',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {results && (
        <div className="step">
          <div className="step-header">
            <div className="step-number">3</div>
            <div className="step-title">Import Results</div>
          </div>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-value success">{results.imported}</div>
              <div className="stat-label">✅ Imported</div>
            </div>
            <div className="stat-card">
              <div className="stat-value error">{results.skipped}</div>
              <div className="stat-label">⏭️ Skipped</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{results.total}</div>
              <div className="stat-label">📊 Total</div>
            </div>
          </div>

          {/* ✅ NEW: Reset/Upload New button after results */}
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button
              onClick={handleResetAll}
              style={{
                padding: '8px 24px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              📤 Upload New CSV
            </button>
          </div>

          {results.results && results.results.length > 0 && (
            <>
              <h3 style={{ margin: '20px 0 10px' }}>Imported Records</h3>
              <div className="table-container" style={{ maxHeight: '400px' }}>
                <table>
                  <thead>
                    <tr>
                      {Object.keys(results.results[0]).map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.slice(0, 50).map((record, index) => (
                      <tr key={index}>
                        {Object.keys(record).map((key) => (
                          <td key={key}>{record[key] || ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {results.results.length > 50 && (
                  <p style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                    Showing first 50 records...
                  </p>
                )}
              </div>
            </>
          )}

          {results.skipped > 0 && results.skippedRecords && (
            <details className="skipped-records">
              <summary>View Skipped Records ({results.skipped})</summary>
              <div className="table-container" style={{ maxHeight: '300px', marginTop: '10px' }}>
                <table>
                  <thead>
                    <tr>
                      {Object.keys(results.skippedRecords[0] || {}).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.skippedRecords.map((record, index) => (
                      <tr key={index}>
                        {Object.values(record).map((value, i) => (
                          <td key={i}>{value || ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}