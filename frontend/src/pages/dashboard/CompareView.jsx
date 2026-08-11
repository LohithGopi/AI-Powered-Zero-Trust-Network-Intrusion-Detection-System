import React from 'react';
import { BarChart2, CheckCircle2, Sliders, Database, FileSpreadsheet, Layers, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CompareView = () => {
  const { datasets, toggleCompareDataset } = useAuth();

  const comparedItems = datasets.filter(d => d.isCompared);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
            METRIC COMPARISON
          </span>
          <h1 className="text-xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">Dataset Comparison Matrix</h1>
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">Compare row counts, missing cells, and duplicate records across benchmark datasets.</p>
        </div>

        {/* Dataset Selection Toggles from Inventory */}
        <div className="flex flex-wrap items-center gap-2">
          {datasets.map(d => (
            <button
              key={d.id}
              onClick={() => toggleCompareDataset(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                d.isCompared
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#475569] dark:text-[#9FA6A8] border-[#E2E8F0] dark:border-[#252A2E] hover:bg-slate-100 dark:hover:bg-[#1E2328]'
              }`}
            >
              {d.isCompared ? '✓ ' : '+ '}{d.name.replace('.csv','')}
            </button>
          ))}
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
            const isNsl = ds.name.toLowerCase().includes('nsl');
            const isUnsw = ds.name.toLowerCase().includes('unsw');
            const isCic = ds.name.toLowerCase().includes('cic');

            const rowsCount = isUnsw ? 1007 : isCic ? 1000 : isNsl ? 1010 : ds.rows;
            const missingCount = isUnsw ? 19 : isCic ? 13 : isNsl ? 0 : (ds.missing || 0);
            const dupCount = isUnsw ? 7 : isCic ? 0 : isNsl ? 10 : (ds.duplicates || 0);
            const purposeText = isUnsw ? 'Both preprocessing cases' : isCic ? 'Missing-value handling' : isNsl ? 'Duplicate removal' : (ds.purpose || 'Custom Ingestion');

            const numFeatures = isNsl ? 38 : isUnsw ? 39 : isCic ? 74 : Math.max(1, ds.cols - 4);
            const catFeatures = isNsl ? 3 : isUnsw ? 4 : isCic ? 4 : 3;

            return (
              <div key={ds.id} className={`bg-white dark:bg-[#15191C] border rounded-2xl p-6 shadow-sm space-y-4 relative ${ds.isSelected ? 'border-[#1769E0] ring-1 ring-[#1769E0]' : 'border-[#E2E8F0] dark:border-[#252A2E]'}`}>
                
                {ds.isSelected && (
                  <span className="absolute top-4 right-4 text-[9px] font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-[#1769E0] px-2 py-0.5 rounded">
                    ACTIVE TARGET
                  </span>
                )}

                <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-[#252A2E] pb-3">
                  <FileSpreadsheet className="h-5 w-5 text-[#1769E0] shrink-0" />
                  <h3 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] truncate max-w-[200px]" title={ds.name}>{ds.name}</h3>
                </div>

                <div className="space-y-2.5 text-xs font-mono text-[#475569] dark:text-[#9FA6A8]">
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Dataset Standard:</span>
                    <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">{ds.type}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Row Count:</span>
                    <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">{rowsCount.toLocaleString()} Rows</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Total Attributes:</span>
                    <span className="text-[#1769E0] font-bold">{ds.cols} Columns</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Missing Cells:</span>
                    <span className={`font-bold ${missingCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {missingCount > 0 ? `${missingCount} Cells (Requires Cleaning)` : '0 Cells (Clean Data)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-[#252A2E]/50">
                    <span>Duplicate Rows:</span>
                    <span className={`font-bold ${dupCount > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {dupCount > 0 ? `${dupCount} Rows (Requires Deduplication)` : '0 Duplicates'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span>Numerical / Categorical:</span>
                    <span className="text-[#172033] dark:text-[#F3F4F1]">{numFeatures} Num / {catFeatures} Cat</span>
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
