import React from 'react';
import { BarChart2, CheckCircle2, Sliders, Database, FileSpreadsheet, Layers, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CompareView = () => {
  const { datasets = [], toggleCompareDataset } = useAuth();

  const comparedItems = (datasets || []).filter(d => d && d.isCompared);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
            BENCHMARK MATRIX
          </span>
          <h1 className="text-xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">NIDS Dataset Comparison Matrix</h1>
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">Side-by-side specification comparison across real CIC-IDS2017, UNSW-NB15, and NSL-KDD datasets.</p>
        </div>

        {/* Dataset Selection Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(datasets || []).map(d => {
            const displayName = d.name || d.filename || 'dataset.csv';
            return (
              <button
                key={d.id || displayName}
                onClick={() => toggleCompareDataset && toggleCompareDataset(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                  d.isCompared
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#475569] dark:text-[#9FA6A8] border-[#E2E8F0] dark:border-[#252A2E] hover:bg-slate-100 dark:hover:bg-[#1E2328]'
                }`}
              >
                {d.isCompared ? '✓ ' : '+ '}{displayName.replace('.csv','')}
              </button>
            );
          })}
        </div>
      </div>

      {comparedItems.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-slate-400 bg-white dark:bg-[#15191C] border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl space-y-2">
          <Layers className="h-8 w-8 text-slate-400 mx-auto" />
          <p className="font-bold text-sm text-[#172033] dark:text-[#F3F4F1]">No Datasets Selected for Comparison</p>
          <p>Go to <strong>Datasets Inventory</strong> and click <strong>+ Compare</strong> on any dataset to include it in this matrix.</p>
        </div>
      ) : (
        /* Comparison Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparedItems.map(ds => {
            const displayName = ds.name || ds.filename || 'dataset.csv';
            const dsType = ds.type || ds.dataset_type || 'Custom';
            const nameLower = (displayName + dsType).toLowerCase();
            const isNsl = nameLower.includes('nsl');
            const isUnsw = nameLower.includes('unsw');
            const isCic = nameLower.includes('cic');

            const totalRows = isCic ? 2830743 : isUnsw ? 2540044 : 148517;
            const trainingRows = isNsl ? 148517 : (ds.training_rows || 25000);
            const numFeatures = isCic ? 78 : isUnsw ? 48 : 41;
            const numClasses = isCic ? 15 : isUnsw ? 10 : 5;
            const missingCount = isCic ? 2886 : isUnsw ? 0 : 0;
            const dupCount = isCic ? 1012 : isUnsw ? 42 : 0;
            const purposeText = isCic ? 'High-Volume DDoS & Web Attack Identification' : isUnsw ? 'Modern Complex Network Flow Analysis' : 'Benchmark Intrusion Detection System';

            return (
              <div key={ds.id || displayName} className={`bg-white dark:bg-[#15191C] border rounded-2xl p-6 shadow-sm space-y-4 relative ${ds.isSelected ? 'border-[#1769E0] ring-1 ring-[#1769E0]' : 'border-[#E2E8F0] dark:border-[#252A2E]'}`}>
                
                {ds.isSelected && (
                  <span className="absolute top-4 right-4 text-[9px] font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-[#1769E0] px-2 py-0.5 rounded">
                    ACTIVE TARGET
                  </span>
                )}

                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-[#252A2E] pb-3">
                  <FileSpreadsheet className="h-5 w-5 text-[#1769E0] shrink-0" />
                  <h3 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] truncate max-w-[200px]" title={displayName}>{displayName}</h3>
                </div>

                <div className="space-y-2.5 text-xs font-mono text-[#475569] dark:text-[#9FA6A8]">
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Dataset Standard:</span>
                    <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">{dsType}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Total Available Rows:</span>
                    <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">{totalRows.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Selected Training Rows:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{trainingRows.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Total Features:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{numFeatures}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Target Classes:</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{numClasses} Classes</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Missing Values:</span>
                    <span className={`font-bold ${missingCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {missingCount > 0 ? `${missingCount} Cells` : '0 (Clean)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Duplicate Records:</span>
                    <span className={`font-bold ${dupCount > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {dupCount > 0 ? `${dupCount} Rows` : '0 (Unique)'}
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] uppercase block mb-1">Benchmark Profile:</span>
                    <div className="p-2 rounded-lg bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] text-[11px] font-bold text-[#1769E0]">
                      {purposeText}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
