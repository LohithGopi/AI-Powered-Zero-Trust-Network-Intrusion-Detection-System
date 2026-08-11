import React, { useState } from 'react';
import { BarChart2, CheckCircle2, Sliders, Database, FileSpreadsheet } from 'lucide-react';

export const CompareView = () => {
  const [selectedDatasets, setSelectedDatasets] = useState([1, 2]);

  const allDatasets = [
    { id: 1, name: 'NSL-KDD Real Intrusion Dataset', rows: 5000, cols: 42, features: 41, classes: 7, missing: 0, duplicates: 0, numFeatures: 38, catFeatures: 3 },
    { id: 2, name: 'UNSW-NB15 Real Flow Dataset', rows: 5000, cols: 43, features: 42, classes: 7, missing: 0, duplicates: 0, numFeatures: 39, catFeatures: 3 }
  ];

  const toggleSelect = (id) => {
    if (selectedDatasets.includes(id)) {
      if (selectedDatasets.length > 1) {
        setSelectedDatasets(selectedDatasets.filter(i => i !== id));
      }
    } else {
      setSelectedDatasets([...selectedDatasets, id]);
    }
  };

  const comparedItems = allDatasets.filter(d => selectedDatasets.includes(d.id));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
            METRIC COMPARISON
          </span>
          <h1 className="text-xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">Dataset Comparison Matrix</h1>
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">Compare feature counts, class distributions, and network traffic parameters across real benchmark datasets.</p>
        </div>

        {/* Dataset Selection Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {allDatasets.map(d => (
            <button
              key={d.id}
              onClick={() => toggleSelect(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                selectedDatasets.includes(d.id)
                  ? 'bg-[#1769E0] text-white border-[#1769E0]'
                  : 'bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#475569] dark:text-[#9FA6A8] border-[#E2E8F0] dark:border-[#252A2E] hover:bg-slate-100 dark:hover:bg-[#1E2328]'
              }`}
            >
              {selectedDatasets.includes(d.id) ? '✓ ' : '+ '}{d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Matrix Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comparedItems.map(ds => (
          <div key={ds.id} className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-[#252A2E] pb-3">
              <FileSpreadsheet className="h-5 w-5 text-[#1769E0]" />
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F3F4F1]">{ds.name}</h3>
            </div>

            <div className="space-y-2 text-xs font-mono text-[#475569] dark:text-[#9FA6A8]">
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                <span>Row Count:</span>
                <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">{ds.rows.toLocaleString()} Records</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                <span>Total Columns:</span>
                <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">{ds.cols} Columns</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                <span>Feature Attributes:</span>
                <span className="text-[#1769E0] font-bold">{ds.features} Attributes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                <span>Traffic Classes:</span>
                <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">{ds.classes} Categories</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                <span>Numerical Features:</span>
                <span className="text-[#172033] dark:text-[#F3F4F1]">{ds.numFeatures}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                <span>Categorical Features:</span>
                <span className="text-[#172033] dark:text-[#F3F4F1]">{ds.catFeatures}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                <span>Missing Values:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ds.missing} (Clean Data)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Duplicate Records:</span>
                <span className="text-[#172033] dark:text-[#F3F4F1]">{ds.duplicates}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
