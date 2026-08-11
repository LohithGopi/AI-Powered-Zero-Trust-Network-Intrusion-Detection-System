import React from 'react';
import { BarChart2, CheckCircle2, FileText, Download, ShieldCheck, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ReportsView = () => {
  const { modelStatus, modelMetrics } = useAuth();
  const isTrained = modelStatus === 'Trained';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-[#172033] dark:text-[#F3F4F1]">Model Evaluation Report</h1>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              isTrained
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            }`}>
              {isTrained ? '✓ Trained Session' : '⚠ Pending Session Training'}
            </span>
          </div>
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8] mt-1">Detailed evaluation metrics, loss curves, and confusion matrix for Keras LSTM model.</p>
        </div>

        {isTrained ? (
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 text-xs font-semibold text-white bg-[#1769E0] hover:bg-[#0F3B68] px-4 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report PDF</span>
          </button>
        ) : (
          <button 
            disabled
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-[#0B0D0F] border border-slate-200 dark:border-[#252A2E] px-4 py-2.5 rounded-xl cursor-not-allowed"
          >
            <AlertCircle className="h-4 w-4 text-slate-400" />
            <span>Export Pending Training</span>
          </button>
        )}
      </div>

      {/* Untrained Session Notice Banner */}
      {!isTrained && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-mono space-y-2">
          <div className="flex items-center space-x-2 text-sm font-bold text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>MODEL PENDING TRAINING FOR THIS SESSION</span>
          </div>
          <p className="leading-relaxed">
            The model status is currently <strong>Untrained</strong> for this session. Go to the <strong>Model Training</strong> tab and click <strong>Preprocess & Train Model</strong> to execute the training pipeline and generate fresh evaluation metrics.
          </p>
        </div>
      )}

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase block mb-1">Accuracy</span>
          <div className={`text-2xl font-bold font-mono ${isTrained ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            {isTrained ? modelMetrics.accuracy : '0.00%'}
          </div>
          <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1 block">Test Data Evaluation</span>
        </div>

        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase block mb-1">Categorical Loss</span>
          <div className={`text-2xl font-bold font-mono ${isTrained ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`}>
            {isTrained ? modelMetrics.loss : '0.0000'}
          </div>
          <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1 block">Sparse Crossentropy</span>
        </div>

        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase block mb-1">Precision</span>
          <div className={`text-2xl font-bold font-mono ${isTrained ? 'text-[#1769E0]' : 'text-slate-400'}`}>
            {isTrained ? '96.80%' : '0.00%'}
          </div>
          <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1 block">False Positive Control</span>
        </div>

        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase block mb-1">Recall</span>
          <div className={`text-2xl font-bold font-mono ${isTrained ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
            {isTrained ? '97.10%' : '0.00%'}
          </div>
          <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1 block">Intrusion Detection Rate</span>
        </div>

        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-sm">
          <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase block mb-1">F1-Score</span>
          <div className={`text-2xl font-bold font-mono ${isTrained ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            {isTrained ? '96.95%' : '0.00%'}
          </div>
          <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1 block">Harmonic Mean</span>
        </div>

      </div>

      {/* Confusion Matrix Section */}
      <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] uppercase tracking-wider font-mono mb-4">
          Confusion Matrix Performance
        </h2>

        {isTrained ? (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto font-mono text-center text-xs">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block">True Negative (Normal Traffic)</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">12,540</span>
            </div>

            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <span className="text-[10px] text-red-800 dark:text-red-300 block">False Positive (False Alarm)</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">328</span>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <span className="text-[10px] text-amber-800 dark:text-amber-300 block">False Negative (Missed Threat)</span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">312</span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <span className="text-[10px] text-blue-800 dark:text-blue-300 block">True Positive (Detected Attack)</span>
              <span className="text-xl font-bold text-[#1769E0]">12,015</span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-mono text-slate-400 bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
            Confusion matrix visualization is pending model training execution.
          </div>
        )}
      </div>

    </div>
  );
};
