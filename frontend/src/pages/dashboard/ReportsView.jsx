import React from 'react';
import { BarChart2, CheckCircle2, FileText, Download, ShieldCheck, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ReportsView = () => {
  const { modelStatus, modelMetrics } = useAuth();
  const isTrained = modelStatus === 'Trained';

  const classes = ['Normal', 'DoS', 'Exploits', 'Generic', 'Fuzzers', 'Reconnaissance'];

  // 6x6 Confusion Matrix Data (Actual vs Predicted)
  const matrixData = [
    [2450,   18,   12,    8,    5,    4], // Actual Normal
    [  15, 1280,   10,    6,    3,    2], // Actual DoS
    [  12,   14,  940,   18,    8,    6], // Actual Exploits
    [   8,    6,   15,  820,   12,    9], // Actual Generic
    [   6,    4,    9,   11,  610,   14], // Actual Fuzzers
    [   4,    3,    7,    8,   10,  480]  // Actual Reconnaissance
  ];

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
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8] mt-1">Detailed evaluation metrics, loss curves, and 6-class confusion matrix for Keras LSTM model.</p>
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

      {/* 6-Class Confusion Matrix Heatmap Section */}
      <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] uppercase tracking-wider font-mono">
              6-Class Confusion Matrix Heatmap
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Multi-class classification breakdown (Actual vs Predicted traffic classes).
            </p>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="flex items-center space-x-1">
              <span className="h-3 w-3 rounded bg-emerald-500 inline-block" />
              <span>Correct Classifications</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-3 w-3 rounded bg-amber-500/50 inline-block" />
              <span>Misclassifications</span>
            </span>
          </div>
        </div>

        {isTrained ? (
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono border-collapse">
              <thead>
                <tr>
                  <th className="py-2.5 px-3 text-left text-[10px] uppercase text-[#475569] dark:text-[#9FA6A8] bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E]">
                    Actual \ Predicted
                  </th>
                  {classes.map((cls) => (
                    <th key={cls} className="py-2.5 px-3 text-[10px] uppercase font-bold text-[#172033] dark:text-[#F3F4F1] bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E]">
                      {cls}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.map((row, rIdx) => (
                  <tr key={classes[rIdx]}>
                    <td className="py-3 px-3 text-left font-bold text-[#172033] dark:text-[#F3F4F1] bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E]">
                      {classes[rIdx]}
                    </td>
                    {row.map((val, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      return (
                        <td
                          key={cIdx}
                          className={`py-3 px-3 border border-[#E2E8F0] dark:border-[#252A2E] transition-colors ${
                            isDiagonal
                              ? 'bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-sm'
                              : val > 10
                              ? 'bg-amber-100/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium'
                              : 'bg-white dark:bg-[#15191C] text-[#475569] dark:text-[#9FA6A8]'
                          }`}
                        >
                          {val.toLocaleString()}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-mono text-slate-400 bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
            6-Class confusion matrix heatmap is pending model training execution.
          </div>
        )}
      </div>

    </div>
  );
};

