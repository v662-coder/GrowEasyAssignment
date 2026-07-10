'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload, FiLoader, FiCheck, FiX, FiRefreshCw, FiEdit } from 'react-icons/fi';
import { csvAPI } from '@/services/api';
import toast from 'react-hot-toast';

export default function CSVImport() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Processing, 4: Results
  const [importedData, setImportedData] = useState(null);

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

  // Step 3: Process with AI (Confirm Import)
  const handleConfirmImport = async () => {
    if (!previewData) return;
    
    setUploading(true);
    try {
      console.log('🤖 Processing with AI...');
      const response = await csvAPI.processCSV(previewData.rows);
      
      if (response.data.success) {
        setImportedData(response.data.data);
        toast.success(`Successfully imported ${response.data.data.totalImported} records`);
        setStep(3); // Move to results
      }
    } catch (error) {
      console.error('❌ Processing Error:', error);
      toast.error(error.response?.data?.message || 'AI processing failed');
    } finally {
      setUploading(false);
    }
  };

  // Cancel Import (from preview page)
  const handleCancel = () => {
    setStep(1);
    setFile(null);
    setPreviewData(null);
    setImportedData(null);
    toast.info('Import cancelled');
  };

  // Update File (from upload page)
  const handleUpdateFile = () => {
    setFile(null);
    toast.info('Select a new file');
    // Focus on dropzone
    const dropzone = document.querySelector('[data-dropzone]');
    if (dropzone) dropzone.click();
  };

  // New Import (from results page)
  const handleNewImport = () => {
    setStep(1);
    setFile(null);
    setPreviewData(null);
    setImportedData(null);
    toast.info('Ready for new import');
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
          data-dropzone
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
          
          {file ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
              <div className="flex gap-2">
                {/* ✅ Update File Button */}
                <button 
                  onClick={handleUpdateFile}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <FiEdit className="w-4 h-4" />
                  Update File
                </button>
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
            </div>
          ) : (
            <span className="text-sm text-gray-400">No file selected</span>
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
            {/* ✅ Cancel Button */}
            <button 
              onClick={handleCancel}
              disabled={uploading}
              className="btn-secondary flex items-center gap-2"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </button>
            {/* ✅ Confirm Import Button */}
            <button 
              onClick={handleConfirmImport}
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

  // Step 3: Results
  if (step === 3 && importedData) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-green-600">✅ Import Complete!</h2>
            <div className="flex gap-4 mt-2">
              <span className="text-sm text-green-600">✅ {importedData.totalImported} imported</span>
              <span className="text-sm text-red-600">❌ {importedData.totalSkipped} skipped</span>
              <span className="text-sm text-gray-500">📊 {importedData.totalRecords} total</span>
            </div>
          </div>
          <div className="flex gap-3">
            {/* ✅ Import New File Button */}
            <button 
              onClick={handleNewImport}
              className="btn-primary flex items-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              Import New File
            </button>
          </div>
        </div>

        {/* Imported Records Preview */}
        {importedData.records && importedData.records.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Imported Records</h3>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b border-gray-200">
                  <tr>
                    {['created_at', 'name', 'email', 'mobile', 'company', 'crm_status'].map((field) => (
                      <th key={field} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importedData.records.slice(0, 20).map((record, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-xs text-gray-600">
                        {new Date(record.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-900">{record.name}</td>
                      <td className="py-2 px-3 text-sm text-gray-600">{record.email}</td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {record.country_code}{record.mobile_without_country_code}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">{record.company}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          record.crm_status === 'SALE_DONE' ? 'bg-green-100 text-green-800' :
                          record.crm_status === 'GOOD_LEAD_FOLLOW_UP' ? 'bg-blue-100 text-blue-800' :
                          record.crm_status === 'DID_NOT_CONNECT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.crm_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {importedData.records.length > 20 && (
                <p className="text-sm text-gray-500 text-center py-3">
                  Showing 20 of {importedData.records.length} records
                </p>
              )}
            </div>
          </div>
        )}

        {/* Skipped Records */}
        {importedData.skippedRecords && importedData.skippedRecords.length > 0 && (
          <div className="mt-4 border border-red-200 bg-red-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-700 mb-3">
              Skipped Records ({importedData.totalSkipped})
            </h3>
            <div className="overflow-x-auto max-h-48 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-red-50 border-b border-red-200">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-red-600">Record</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-red-600">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {importedData.skippedRecords.slice(0, 10).map((skip, index) => (
                    <tr key={index} className="border-b border-red-100">
                      <td className="py-2 px-3 text-xs text-gray-600">
                        {JSON.stringify(skip.original).slice(0, 100)}...
                      </td>
                      <td className="py-2 px-3 text-xs text-red-600">{skip.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}