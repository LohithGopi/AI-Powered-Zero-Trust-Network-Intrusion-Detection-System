import React from 'react';
import { 
  Database, FileSpreadsheet, Server, Cpu, CheckCircle2, 
  Clock, ArrowRight, Upload, BarChart2, Play, FileText, Activity, GraduationCap, Award, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OverviewView = ({ onNavigate }) => {
  const { modelStatus, modelMetrics, datasets, activeDataset } = useAuth();
  const isTrained = modelStatus === 'Trained';
  const uploadedCount = datasets?.length || 0;
  const activeName = activeDataset?.name || 'N/A';
  const activeRows = activeDataset?.rows || 0;

  return (
    <div className="space-y-8">
      
      {/* Institutional College & Batch Banner Card */}
      <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src="/jnnce_logo.png"
            alt="JNNCE Logo"
            className="h-16 w-16 object-contain rounded-xl bg-white p-1.5 border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-[#172033] dark:text-[#F3F4F1] tracking-tight">
                Jawaharlal Nehru National College of Engineering, Shivamogga
              </h2>
            </div>
            <p className="text-xs font-semibold text-[#1769E0] font-mono uppercase">
              Department of Information Science and Engineering
            </p>
            <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8]">
              AI-Powered Zero Trust Network Intrusion Detection System
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#1769E0] dark:text-blue-400 text-xs font-mono font-bold">
            <GraduationCap className="h-4 w-4" />
            <span>PROJECT BATCH NO. 34</span>
          </span>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] dark:text-[#F3F4F1]">Security Operations Dashboard</h1>
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8] mt-1">Overview of Zero Trust NIDS datasets, model training status, and evaluation metrics.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('datasets')}
            className="px-4 py-2 text-xs font-semibold text-[#172033] dark:text-[#F3F4F1] bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] hover:bg-slate-50 dark:hover:bg-[#1E2328] rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Upload className="h-3.5 w-3.5 text-[#1769E0]" />
            <span>Upload Dataset</span>
          </button>
          
          <button
            onClick={() => onNavigate('training')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1769E0] hover:bg-[#0F3B68] rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Train Model</span>
          </button>
        </div>
      </div>

      {/* 6 Essential Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* 1. Uploaded Datasets */}
        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase">Uploaded Datasets</span>
            <Database className="h-4 w-4 text-[#1769E0]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#172033] dark:text-[#F3F4F1]">{uploadedCount} {uploadedCount === 1 ? 'File' : 'Files'}</div>
          <div className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1">{datasets.map(d => d.type).join(', ')}</div>
        </div>

        {/* 2. Active Dataset */}
        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase">Active Dataset</span>
            <FileSpreadsheet className="h-4 w-4 text-[#1769E0]" />
          </div>
          <div className="text-xs font-bold font-mono text-[#172033] dark:text-[#F3F4F1] truncate" title={activeName}>{activeName.replace('.csv','')}</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{activeRows.toLocaleString()} Rows</div>
        </div>

        {/* 3. Dynamic Model Status (Untrained on Login -> Trained after Training) */}
        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase">Model Status</span>
            <Server className={`h-4 w-4 ${isTrained ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`} />
          </div>
          <div className={`text-xs font-bold font-mono flex items-center space-x-1 ${isTrained ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {isTrained ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Trained</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Untrained</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1 truncate">
            {isTrained ? 'lstm_model.keras' : 'Pending Training'}
          </div>
        </div>

        {/* 4. Current Model */}
        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase">Current Model</span>
            <Cpu className="h-4 w-4 text-[#1769E0]" />
          </div>
          <div className="text-xs font-bold font-mono text-[#172033] dark:text-[#F3F4F1]">LSTM Network</div>
          <div className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1">TensorFlow / Keras</div>
        </div>

        {/* 5. Dynamic Training Accuracy */}
        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase">Training Accuracy</span>
            <Activity className={`h-4 w-4 ${isTrained ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${isTrained ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            {isTrained ? modelMetrics.accuracy : '0.00%'}
          </div>
          <div className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1">
            {isTrained ? 'Test Dataset Split' : 'Requires Training'}
          </div>
        </div>

        {/* 6. Dynamic Last Training */}
        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#475569] dark:text-[#9FA6A8] uppercase">Last Training</span>
            <Clock className="h-4 w-4 text-[#1769E0]" />
          </div>
          <div className="text-xs font-bold font-mono text-[#172033] dark:text-[#F3F4F1]">
            {isTrained ? `${modelMetrics.epochs || 10} Epochs` : 'None'}
          </div>
          <div className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-1 truncate">
            {isTrained ? `Session (${modelMetrics.trainedAt})` : 'Pending Session'}
          </div>
        </div>

      </div>

      {/* Phase 1 Workflow Section */}
      <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] uppercase tracking-wider font-mono mb-4">
          Phase 1 Workflow
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center text-xs font-mono">
          {[
            'Dataset Upload',
            'Dataset Validation',
            'Preprocessing',
            'Feature Engineering',
            'Train/Test Split',
            'LSTM Training',
            'Model Evaluation',
            'Saved Model'
          ].map((wf, idx) => (
            <div key={wf} className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-3 flex flex-col justify-between h-20">
              <div className="text-[#1769E0] font-bold text-[10px]">0{idx + 1}</div>
              <div className="text-[11px] font-bold text-[#172033] dark:text-[#F3F4F1] leading-tight">{wf}</div>
              <CheckCircle2 className={`h-3.5 w-3.5 mx-auto ${idx < 5 || isTrained ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] uppercase tracking-wider font-mono mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => onNavigate('datasets')}
            className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-[#E2E8F0] dark:border-[#252A2E] hover:border-blue-200 transition-all text-left group"
          >
            <Upload className="h-5 w-5 text-[#1769E0] mb-2" />
            <div className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1] group-hover:text-[#1769E0]">Upload Dataset</div>
            <div className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-0.5">Ingest new CSV benchmark datasets</div>
          </button>

          <button
            onClick={() => onNavigate('compare')}
            className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] hover:bg-blue-50 dark:hover:bg-[#1E2328] border border-[#E2E8F0] dark:border-[#252A2E] hover:border-blue-200 transition-all text-left group"
          >
            <BarChart2 className="h-5 w-5 text-[#1769E0] mb-2" />
            <div className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1] group-hover:text-[#1769E0]">Compare Datasets</div>
            <div className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-0.5">Compare features & row distributions</div>
          </button>

          <button
            onClick={() => onNavigate('training')}
            className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] hover:bg-blue-50 dark:hover:bg-[#1E2328] border border-[#E2E8F0] dark:border-[#252A2E] hover:border-blue-200 transition-all text-left group"
          >
            <Play className="h-5 w-5 text-[#1769E0] mb-2" />
            <div className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1] group-hover:text-[#1769E0]">Train Model</div>
            <div className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-0.5">Execute LSTM training pipeline</div>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] hover:bg-blue-50 dark:hover:bg-[#1E2328] border border-[#E2E8F0] dark:border-[#252A2E] hover:border-blue-200 transition-all text-left group"
          >
            <FileText className="h-5 w-5 text-[#1769E0] mb-2" />
            <div className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1] group-hover:text-[#1769E0]">View Evaluation</div>
            <div className="text-[10px] text-[#475569] dark:text-[#9FA6A8] mt-0.5">Inspect accuracy, precision & confusion matrix</div>
          </button>

        </div>
      </div>

    </div>
  );
};
