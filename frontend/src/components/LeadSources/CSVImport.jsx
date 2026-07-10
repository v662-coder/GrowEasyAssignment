'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload, FiLoader, FiCheck, FiX } from 'react-icons/fi';
import { csvAPI } from '@/services/api';
import toast from 'react-hot-toast';

export default function CSVImport() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Processing, 4: Results

  // Step 1: Drag & Drop
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFile(file);
      toast.success('File selected: ' + file.name);
    } else {
      toast.error('File size must be less than 10MB');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxSize: 10 * 1024 * 1024
  });

  // Step 2: Upload and Preview
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      console.log('📤 Uploading file:', file.name);
      
      const response = await csvAPI.previewCSV(file);
      
      console.log('📥 Response:', response.data);
      
      if (response.data.success) {
        toast.success('File uploaded successfully!');
        setPreviewData(response.data.data);
        setStep(2);
      }
    } catch (error) {
      console.error('❌ Upload Error:', error);
      console.error('❌ Error Response:', error.response?.data);
      
      if (error.response?.status === 404) {
        toast.error('Backend API not found. Make sure backend is running on port 5000');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Check backend console for details');
      } else {
        toast.error(error.response?.data?.message || 'Failed to upload file');
      }
    } finally {
      setUploading(false);
    }
  };

  // Step 3: Process with AI
  const handleProcess = async () => {
    if (!previewData) return;
    
    setUploading(true);
    try {
      console.log('🤖 Processing with AI...');
      const response = await csvAPI.processCSV(previewData.rows);
      
      if (response.data.success) {
        toast.success(`Successfully imported ${response.data.data.totalImported} records`);
        setStep(4);
      }
    } catch (error) {
      console.error('❌ Processing Error:', error);
      toast.error(error.response?.data?.message || 'AI processing failed');
    } finally {
      setUploading(false);
    }
  };

  // Reset
  const handleReset = () => {
    setStep(1);
    setFile(null);
    setPreviewData(null);
    toast.success('Reset successful');
  };

  // Render Step 1: Upload
  if (step === 1) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Import Leads via CSV</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload a CSV file to bulk import leads. AI will automatically map fields.
        </p>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            {isDragActive ? 'Drop your CSV file here' : 'Drop your CSV file here or click to browse'}
          </p>
          <p className="text-sm text-gray-400 mt-2">Supported: .csv (max 10MB)</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            onClick={() => toast.info('Sample template would download here')}
          >
            <FiDownload className="w-4 h-4" />
            Download Sample CSV Template
          </button>
          {file && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="btn-primary flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload /> Upload File
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Step 2: Preview
  if (step === 2 && previewData) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">CSV Preview</h2>
            <p className="text-sm text-gray-500">
              {previewData.totalRows} rows • Showing first {previewData.rows.length}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="btn-secondary">
              Cancel
            </button>
            <button 
              onClick={handleProcess}
              disabled={uploading}
              className="btn-primary flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FiCheck /> Confirm Import
                </>
              )}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white border-b border-gray-200">
              <tr>
                {previewData.headers.map((header) => (
                  <th key={header} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.rows.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  {previewData.headers.map((header) => (
                    <td key={header} className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {row[header] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Step 4: Results
  if (step === 4) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-green-600">✅ Import Complete!</h2>
            <p className="text-sm text-gray-500">CSV processed successfully</p>
          </div>
          <button onClick={handleReset} className="btn-secondary">
            Import Another File
          </button>
        </div>
        <div className="text-center py-8">
          <FiCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">All records processed successfully!</p>
        </div>
      </div>
    );
  }

  return null;
}