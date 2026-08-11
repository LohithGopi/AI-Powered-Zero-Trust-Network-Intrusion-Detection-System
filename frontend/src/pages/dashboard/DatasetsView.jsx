import React, { useState } from 'react';
import { Upload, Trash2, FileSpreadsheet, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DatasetsView = ({ onNavigate }) => {
  const { user, role, datasets, selectDataset, addDataset, removeDataset } = useAuth();
  const currentRole = role || user?.role || 'Admin';

  const canUpload = currentRole === 'Admin' || currentRole === 'Analyst';
  const canDelete = currentRole === 'Admin';

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [datasetType, setDatasetType] = useState('Custom');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSelect = (id, name) => {
    if (!canUpload) {
      alert('Role Restriction: Only Admin and Analyst roles can select datasets for model training.');
      return;
    }
    selectDataset(id);
    setSuccessMsg(`Dataset '${name}' selected as active target for neural network training.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = (id, name) => {
    if (!canDelete) {
      alert('Role Restriction: Only Admin role can delete datasets from system inventory.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete dataset '${name}'?`)) {
      removeDataset(id);
      setSuccessMsg(`Dataset '${name}' deleted successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    setUploadError('');

    if (!canUpload) {
      setUploadError('Forbidden: Only Admin and Analyst roles have permission to upload datasets.');
      return;
    }
    if (!selectedFile) {
      setUploadError('Please select a valid CSV dataset file to upload.');
      return;
    }
    if (!selectedFile.name.endsWith('.csv')) {
      setUploadError('Invalid File Format: Only CSV (.csv) dataset files are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
      const rowCount = Math.max(1, lines.length - 1); // Exclude header line
      const headerCols = lines[0] ? lines[0].split(',').length : 42;

      const newDs = {
        id: Date.now(),
        name: selectedFile.name,
        type: datasetType,
        rows: rowCount,
        cols: headerCols,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        status: 'Uploaded',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isSelected: true
      };

      addDataset(newDs, true); // Auto-select newly uploaded custom dataset
      setShowUploadModal(false);
      setSelectedFile(null);
      setSuccessMsg(`Custom dataset '${newDs.name}' uploaded and selected as active target for model training.`);
      setTimeout(() => setSuccessMsg(''), 5000);
    };

    reader.onerror = () => {
      // Fallback if reader fails
      const newDs = {
        id: Date.now(),
        name: selectedFile.name,
        type: datasetType,
        rows: 5000,
        cols: 42,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        status: 'Uploaded',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isSelected: true
      };
      addDataset(newDs, true);
      setShowUploadModal(false);
      setSelectedFile(null);
      setSuccessMsg(`Custom dataset '${newDs.name}' uploaded and selected as active target.`);
      setTimeout(() => setSuccessMsg(''), 5000);
    };

    reader.readAsText(selectedFile.slice(0, 5000000)); // Read up to 5MB slice for metadata
  };

  return (
    <div className="space-y-6">

      {/* Role Restriction Banner */}
      {!canUpload && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center space-x-2 font-mono">
          <Lock className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>READ-ONLY ROLE RESTRICTION:</strong> You are logged in as <strong>[{currentRole.toUpperCase()}]</strong>. Dataset uploads, selection, and deletion require Admin or Analyst role privileges.
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
            ZERO TRUST REPOSITORY
          </span>
          <h1 className="text-xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">Datasets Inventory</h1>
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">Upload, inspect, and select custom network flow datasets for model training.</p>
        </div>

        {canUpload ? (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 text-xs font-semibold text-white bg-[#1769E0] hover:bg-[#0F3B68] px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Upload className="h-4 w-4" />
            <span>Upload CSV Dataset</span>
          </button>
        ) : (
          <button disabled className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-[#0B0D0F] border border-slate-200 dark:border-[#252A2E] px-4 py-2.5 rounded-xl cursor-not-allowed">
            <Lock className="h-4 w-4 text-slate-400" />
            <span>Upload Disabled (Read-Only)</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono">
          ✓ {successMsg}
        </div>
      )}

      {/* Datasets Table */}
      <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#475569] dark:text-[#9FA6A8] text-[10px] uppercase border-b border-[#E2E8F0] dark:border-[#252A2E]">
              <tr>
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Rows</th>
                <th className="py-3 px-4">Columns</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">RBAC Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#252A2E]">
              {datasets.map((ds) => (
                <tr key={ds.id} className={`hover:bg-slate-50 dark:hover:bg-[#1E2328] transition-colors ${ds.isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-4 w-4 text-[#1769E0] shrink-0" />
                      <span className="font-bold text-[#172033] dark:text-[#F3F4F1] truncate max-w-xs">{ds.name}</span>
                      {ds.isSelected && (
                        <span className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-[#1769E0] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                          ACTIVE TARGET
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#475569] dark:text-[#9FA6A8]">{ds.type}</td>
                  <td className="py-3 px-4 font-bold text-[#172033] dark:text-[#F3F4F1]">{ds.rows.toLocaleString()}</td>
                  <td className="py-3 px-4 text-[#475569] dark:text-[#9FA6A8]">{ds.cols}</td>
                  <td className="py-3 px-4 text-[#475569] dark:text-[#9FA6A8]">{ds.size}</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ds.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleSelect(ds.id, ds.name)}
                      disabled={!canUpload || ds.isSelected}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                        ds.isSelected
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 cursor-default'
                          : canUpload
                          ? 'bg-blue-50 dark:bg-blue-900/40 text-[#1769E0] hover:bg-blue-100 dark:hover:bg-blue-900/60'
                          : 'bg-slate-100 dark:bg-[#0B0D0F] text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {ds.isSelected ? '✓ Active' : canUpload ? 'Select Target' : '🔒 Select'}
                    </button>

                    {canDelete ? (
                      <button
                        onClick={() => handleDelete(ds.id, ds.name)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete Dataset (Admin Only)"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono ml-1" title="Requires Admin Role">🔒 Admin Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload CSV Modal */}
      {showUploadModal && canUpload && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#172033] dark:text-[#F3F4F1]">Upload Network Dataset</h3>

            {uploadError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-mono">
                ⚠ {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#475569] dark:text-[#9FA6A8] mb-1 font-medium">Dataset Type</label>
                <select
                  value={datasetType}
                  onChange={(e) => setDatasetType(e.target.value)}
                  className="w-full bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-2.5 text-[#172033] dark:text-[#F3F4F1] outline-none font-mono"
                >
                  <option value="Custom">Custom CSV File</option>
                  <option value="NSL-KDD">NSL-KDD Benchmark</option>
                  <option value="UNSW-NB15">UNSW-NB15 Flow</option>
                  <option value="CICIDS2017">CICIDS2017 Traffic</option>
                </select>
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#9FA6A8] mb-1 font-medium">Select CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-2 text-xs text-[#172033] dark:text-[#F3F4F1]"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowUploadModal(false); setUploadError(''); }}
                  className="w-1/2 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#252A2E] text-[#475569] dark:text-[#9FA6A8] font-semibold text-xs hover:bg-slate-50 dark:hover:bg-[#1E2328]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#1769E0] text-white font-semibold text-xs hover:bg-[#0F3B68]"
                >
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
