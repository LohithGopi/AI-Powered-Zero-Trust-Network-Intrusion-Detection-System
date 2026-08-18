import React, { useState } from 'react';
import { Upload, Trash2, FileSpreadsheet, Lock, BarChart2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DatasetsView = ({ onNavigate }) => {
  const { user, role, datasets = [], selectDataset, toggleCompareDataset, addDataset, removeDataset } = useAuth();
  const currentRole = role || user?.role || 'Admin';

  const canUpload = currentRole === 'Admin' || currentRole === 'Analyst';
  const canDelete = currentRole === 'Admin';

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [datasetType, setDatasetType] = useState('Custom');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const safeDatasets = Array.isArray(datasets) ? datasets : [];
  const comparedCount = safeDatasets.filter(d => d && d.isCompared).length;

  const handleSelect = (id, name) => {
    if (!canUpload) {
      alert('Role Restriction: Only Admin and Analyst roles can select datasets for model training.');
      return;
    }
    selectDataset(id);
    setSuccessMsg(`Dataset '${name}' selected as active target for neural network training.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleToggleCompare = (id, name, isCurrentlyCompared) => {
    toggleCompareDataset(id);
    const actionText = !isCurrentlyCompared ? 'added to' : 'removed from';
    setSuccessMsg(`Dataset '${name}' ${actionText} comparison matrix.`);
    setTimeout(() => setSuccessMsg(''), 3000);
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

    if (!selectedFile) {
      setUploadError('Please choose a valid CSV dataset file.');
      return;
    }

    if (!selectedFile.name.endsWith('.csv')) {
      setUploadError('Invalid file format. Please upload a .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const rowCount = Math.max(1, lines.length - 1);
      const colCount = lines[0] ? lines[0].split(',').length : 40;

      const newDs = {
        id: Date.now(),
        name: selectedFile.name,
        type: datasetType,
        rows: rowCount,
        cols: colCount,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        status: 'Uploaded',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isSelected: true,
        isCompared: true
      };
      addDataset(newDs, true);
      setShowUploadModal(false);
      setSelectedFile(null);
      setSuccessMsg(`Custom dataset '${newDs.name}' uploaded and added to comparison matrix.`);
      setTimeout(() => setSuccessMsg(''), 5000);
    };

    reader.readAsText(selectedFile.slice(0, 5000000));
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
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">Upload, inspect, select active target, and choose datasets for side-by-side comparison.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('compare')}
            className="flex items-center space-x-2 text-xs font-semibold text-[#172033] dark:text-[#F3F4F1] bg-white dark:bg-[#15191C] hover:bg-slate-50 dark:hover:bg-[#1E2328] border border-[#E2E8F0] dark:border-[#252A2E] px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            <BarChart2 className="h-4 w-4 text-[#1769E0]" />
            <span>Compare Matrix ({comparedCount})</span>
          </button>

          {canUpload ? (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 text-xs font-semibold text-white bg-[#1769E0] hover:bg-[#0F3B68] px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <Upload className="h-4 w-4" />
              <span>Upload CSV Dataset</span>
            </button>
          ) : (
            <button
              disabled
              className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-[#0B0D0F] border border-slate-200 dark:border-[#252A2E] px-4 py-2 rounded-xl cursor-not-allowed"
              title="Only Admin/Analyst roles can upload datasets"
            >
              <Lock className="h-4 w-4 text-slate-400" />
              <span>Upload Restricted</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead className="bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#475569] dark:text-[#9FA6A8] text-[10px] uppercase border-b border-[#E2E8F0] dark:border-[#252A2E]">
              <tr>
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Total Available Rows</th>
                <th className="py-3 px-4 text-right">Training Rows Selected</th>
                <th className="py-3 px-4 text-center">Columns</th>
                <th className="py-3 px-4 text-center">File Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">RBAC Actions & Selection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#252A2E]">
              {safeDatasets.map((ds) => {
                const displayName = ds.name || ds.filename || 'dataset.csv';
                const dsType = ds.type || ds.dataset_type || 'Custom';
                
                // Real Dataset Specification Limits
                let totalRows = ds.total_rows || ds.rows || ds.row_count || 1000;
                let trainingRows = ds.training_rows || 25000;
                if (dsType.includes('CIC')) {
                  totalRows = 2830743;
                  trainingRows = ds.training_rows || 25000;
                } else if (dsType.includes('UNSW')) {
                  totalRows = 2540044;
                  trainingRows = ds.training_rows || 25000;
                } else if (dsType.includes('NSL')) {
                  totalRows = 148517;
                  trainingRows = ds.training_rows || 148517;
                }

                const dsCols = ds.cols || ds.col_count || 42;
                const dsSize = ds.size || (ds.file_size_mb ? `${ds.file_size_mb} MB` : '0.5 MB');

                return (
                  <tr key={ds.id || displayName} className={`hover:bg-slate-50 dark:hover:bg-[#1E2328] transition-colors ${ds.isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <FileSpreadsheet className="h-4 w-4 text-[#1769E0] shrink-0" />
                        <span className="font-bold text-[#172033] dark:text-[#F3F4F1] truncate max-w-xs">{displayName}</span>
                        {ds.isSelected && (
                          <span className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-[#1769E0] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                            ACTIVE TARGET
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#475569] dark:text-[#9FA6A8]">{dsType}</td>
                    <td className="py-3 px-4 font-bold text-right text-[#172033] dark:text-[#F3F4F1]">{totalRows.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-right text-emerald-600 dark:text-emerald-400">{trainingRows.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center text-[#475569] dark:text-[#9FA6A8]">{dsCols}</td>
                    <td className="py-3 px-4 text-center text-[#475569] dark:text-[#9FA6A8]">{dsSize}</td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ds.status || 'Uploaded'}</span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {/* Compare Selection Button */}
                      <button
                        onClick={() => handleToggleCompare(ds.id, displayName, ds.isCompared)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          ds.isCompared
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                            : 'bg-slate-100 dark:bg-[#0B0D0F] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#1E2328]'
                        }`}
                        title="Toggle inclusion in Dataset Comparison Matrix"
                      >
                        {ds.isCompared ? '✓ Comparing' : '+ Compare'}
                      </button>

                      {/* Select Active Target Button */}
                      {ds.isSelected ? (
                        <button
                          disabled
                          className="px-3 py-1 rounded text-[11px] font-bold bg-blue-600 text-white cursor-default shadow-xs"
                        >
                          Target Active
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSelect(ds.id, displayName)}
                          className="px-3 py-1 rounded text-[11px] font-semibold bg-slate-100 dark:bg-[#0B0D0F] text-[#1769E0] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-800 transition-colors"
                        >
                          Select Target
                        </button>
                      )}

                      {/* Delete Button (Admin Only) */}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(ds.id, displayName)}
                          className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Dataset (Admin Only)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#252A2E] pb-3">
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-[#1769E0]" />
                <h3 className="font-bold text-sm text-[#172033] dark:text-[#F3F4F1]">Upload Benchmark Dataset (.CSV)</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-mono">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#475569] dark:text-[#9FA6A8] mb-1 font-bold">Select CSV File:</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full p-2 bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl text-xs text-[#172033] dark:text-[#F3F4F1]"
                />
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#9FA6A8] mb-1 font-bold">Dataset Standard Category:</label>
                <select
                  value={datasetType}
                  onChange={(e) => setDatasetType(e.target.value)}
                  className="w-full p-2.5 bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl text-xs text-[#172033] dark:text-[#F3F4F1]"
                >
                  <option value="NSL-KDD">NSL-KDD Standard</option>
                  <option value="UNSW-NB15">UNSW-NB15 Standard</option>
                  <option value="CICIDS2017">CICIDS2017 Standard</option>
                  <option value="Custom">Custom Intrusion Flow Dataset</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0B0D0F] text-[#475569] dark:text-[#9FA6A8] hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1769E0] hover:bg-[#0F3B68] text-white font-bold shadow-md transition-colors"
                >
                  Upload & Set Active
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
