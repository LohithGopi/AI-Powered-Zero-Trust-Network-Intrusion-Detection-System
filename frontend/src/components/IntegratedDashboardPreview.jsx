import React from 'react';
import { 
  Shield, Activity, Cpu, CheckCircle2, Database, Layers, 
  FileText, Lock, ArrowUpRight, LayoutDashboard, BarChart2, Award
} from 'lucide-react';

export const IntegratedDashboardPreview = ({ onExplore }) => {
  return (
    <div className="w-full rounded-2xl bg-[#081A35] border border-[#0D2347] shadow-2xl overflow-hidden select-none">
      
      {/* 1. EXACT DASHBOARD TOP HEADER BAR (#081A35) */}
      <div className="px-4 py-3 bg-[#081A35] border-b border-[#0D2347] flex items-center justify-between gap-2">
        
        {/* Left: Logo -> Project Name FIRST -> Batch Name SECOND */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <img
            src="/jnnce_logo.png"
            alt="JNNCE Logo"
            className="h-7 w-7 object-contain bg-white rounded p-0.5"
          />
          <div className="flex items-center space-x-2 min-w-0">
            <span className="font-extrabold text-[11px] sm:text-xs text-white tracking-tight truncate">
              Zero Trust AI-Powered Network Intrusion Detection System
            </span>
            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-900/80 text-[#38BDF8] border border-blue-700/80 shrink-0">
              BATCH NO. 34
            </span>
          </div>
        </div>

        {/* Right: Role & Live Indicator */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-400 border border-emerald-700 hidden sm:inline-block">
            [ADMIN ROLE]
          </span>
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-[9px] font-mono text-[#38BDF8]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden md:inline">SYSTEM ONLINE</span>
          </span>
        </div>

      </div>

      {/* 2. EXACT DASHBOARD SECONDARY HORIZONTAL TAB MENU (#06152B) */}
      <div className="bg-[#06152B] border-b border-[#0D2347] px-4 py-1.5 flex items-center space-x-1 text-[10px] font-semibold text-slate-300 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#1769E0] text-white shadow-xs">
          <LayoutDashboard className="h-3 w-3" />
          <span>Dashboard</span>
        </div>
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded hover:bg-[#0D2347]">
          <Database className="h-3 w-3 text-slate-400" />
          <span>Datasets</span>
        </div>
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded hover:bg-[#0D2347]">
          <BarChart2 className="h-3 w-3 text-slate-400" />
          <span>Compare</span>
        </div>
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded hover:bg-[#0D2347]">
          <Cpu className="h-3 w-3 text-slate-400" />
          <span>Model Training</span>
        </div>
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded hover:bg-[#0D2347]">
          <Layers className="h-3 w-3 text-slate-400" />
          <span>Architecture</span>
        </div>
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded hover:bg-[#0D2347]">
          <FileText className="h-3 w-3 text-slate-400" />
          <span>Reports</span>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD BODY PREVIEW (DARK MODE EXACT COLOR SCHEME) */}
      <div className="p-4 sm:p-5 bg-[#0B0D0F] space-y-4">
        
        {/* Top 4 Telemetry Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-3">
            <span className="text-[9px] font-mono text-[#9FA6A8] uppercase block">TOTAL DATASET RECORDS</span>
            <span className="text-lg font-bold font-mono text-[#F3F4F1]">1,007</span>
            <span className="text-[9px] text-emerald-400 font-mono block">UNSW-NB15 Selected</span>
          </div>

          <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-3">
            <span className="text-[9px] font-mono text-[#9FA6A8] uppercase block">PROPOSED MODEL</span>
            <span className="text-lg font-bold font-mono text-[#38BDF8]">LSTM Neural Net</span>
            <span className="text-[9px] text-[#9FA6A8] font-mono block">64-Unit Recurrent Layer</span>
          </div>

          <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-3">
            <span className="text-[9px] font-mono text-[#9FA6A8] uppercase block">MODEL ACCURACY</span>
            <span className="text-lg font-bold font-mono text-emerald-400">97.80%</span>
            <span className="text-[9px] text-emerald-400 font-mono block">Loss: 0.0245</span>
          </div>

          <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-3">
            <span className="text-[9px] font-mono text-[#9FA6A8] uppercase block">ZERO TRUST POSTURE</span>
            <span className="text-lg font-bold font-mono text-purple-400">ENFORCED</span>
            <span className="text-[9px] text-purple-300 font-mono block">HMAC-SHA256 Signed</span>
          </div>

        </div>

        {/* Real-time SVG Training Curve Preview */}
        <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-3.5 space-y-2">
          
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="font-bold text-[#F3F4F1] flex items-center space-x-1.5">
              <Activity className="h-3.5 w-3.5 text-[#1769E0]" />
              <span>Real-Time Epoch Training Curves (LSTM)</span>
            </span>
            <span className="text-emerald-400 font-bold">10/10 Epochs Complete</span>
          </div>

          {/* Mini SVG Plot */}
          <div className="h-28 w-full bg-[#0B0D0F] border border-[#252A2E] rounded-lg relative overflow-hidden p-2">
            
            <svg className="w-full h-full" viewBox="0 0 400 90" preserveAspectRatio="none">
              {/* Train Acc Line (Green) */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                points="10,70 50,55 90,42 130,30 170,22 210,18 250,14 290,12 330,10 370,8"
              />
              {/* Val Acc Line (Blue) */}
              <polyline
                fill="none"
                stroke="#1769E0"
                strokeWidth="2.5"
                points="10,74 50,60 90,46 130,34 170,26 210,21 250,17 290,15 330,13 370,11"
              />
              {/* Train Loss Line (Red Dashed) */}
              <polyline
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="4,3"
                points="10,20 50,32 90,45 130,58 170,68 210,75 250,80 290,83 330,85 370,87"
              />
            </svg>

            {/* Grid legend Overlay */}
            <div className="absolute bottom-1 right-2 flex items-center space-x-3 text-[8px] font-mono text-slate-400">
              <span className="text-emerald-400">── Train Acc (97.8%)</span>
              <span className="text-[#38BDF8]">── Val Acc (97.1%)</span>
              <span className="text-red-400">┈┈ Loss (0.024)</span>
            </div>

          </div>

        </div>

        {/* CTA Launch Bar */}
        <div className="pt-1 flex items-center justify-between text-xs font-mono">
          <span className="text-[#9FA6A8] text-[10px]">
            * Interactive live preview generated from model state.
          </span>
          <button 
            onClick={onExplore}
            className="flex items-center space-x-1.5 text-xs font-bold text-white bg-[#1769E0] hover:bg-[#0F3B68] px-4 py-2 rounded-xl transition-all shadow-md"
          >
            <span>Launch Security Portal</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
