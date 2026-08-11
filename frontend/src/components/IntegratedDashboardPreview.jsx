import React from 'react';
import { Shield, AlertTriangle, Activity, Cpu, CheckCircle2, TrendingUp, Filter, Lock, ArrowUpRight } from 'lucide-react';

export const IntegratedDashboardPreview = ({ onExplore }) => {
  return (
    <div className="relative w-full max-w-6xl mx-auto mt-12 rounded-2xl glass-panel border border-[#252A2E] shadow-2xl overflow-hidden group">
      
      {/* Top Window Bar */}
      <div className="bg-[#111417] px-4 py-3 border-b border-[#252A2E] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="text-[11px] font-mono text-[#9FA6A8] ml-2">app.aizerotrustnids.jnnce.ac.in — Security Console</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] font-mono text-[#9FA6A8]">
          <span className="flex items-center space-x-1 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE SYSTEM ACTIVE</span>
          </span>
          <span>ADMIN PORTAL</span>
        </div>
      </div>

      {/* Main Dashboard Preview Grid */}
      <div className="p-6 bg-[#0B0D0F]">
        
        {/* Header Title inside Preview */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-[#F3F4F1]">Security Intelligence Overview</h3>
            <p className="text-xs text-[#9FA6A8]">Real-time view of network traffic, AI predictions, and Zero Trust security posture.</p>
          </div>
          <button 
            onClick={onExplore}
            className="flex items-center space-x-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/20"
          >
            <span>Launch Live Dashboard</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-4">
            <div className="flex items-center justify-between text-[#9FA6A8] mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider">THREATS DETECTED</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#F3F4F1]">24</div>
            <div className="text-[10px] text-amber-400 mt-1 font-mono">↑ 4 In Last Hour • 100% Mitigated</div>
          </div>

          <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-4">
            <div className="flex items-center justify-between text-[#9FA6A8] mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider">NETWORK FLOWS</span>
              <Activity className="h-4 w-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#F3F4F1]">1,284</div>
            <div className="text-[10px] text-sky-400 mt-1 font-mono">Active Real-Time Sockets</div>
          </div>

          <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-4">
            <div className="flex items-center justify-between text-[#9FA6A8] mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider">PACKETS ANALYZED</span>
              <Shield className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#F3F4F1]">21,442</div>
            <div className="text-[10px] text-indigo-400 mt-1 font-mono">Normalized & Reshaped 3D</div>
          </div>

          <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-4">
            <div className="flex items-center justify-between text-[#9FA6A8] mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider">AI ACCURACY</span>
              <Cpu className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">97.4%</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono">64-Unit LSTM Keras Model</div>
          </div>

        </div>

        {/* Charts & Activity Dual Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-[#15191C] border border-[#252A2E] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold text-[#F3F4F1]">Network Traffic & Threat Intensity</h4>
                <p className="text-[10px] text-[#9FA6A8]">Real-time volumetric packet streams vs AI anomaly scores.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#111417] text-[#9FA6A8] border border-[#252A2E]">
                LIVE STREAM
              </span>
            </div>

            {/* Simulated Clean Chart Bars */}
            <div className="h-44 flex items-end justify-between space-x-2 pt-4 px-2 border-b border-[#252A2E]">
              {[35, 45, 30, 65, 85, 40, 55, 90, 70, 45, 60, 80, 95, 50, 65, 40, 55, 75, 85, 90, 60].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group/bar">
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      h > 80 ? 'bg-amber-400/80 hover:bg-amber-400' : 'bg-sky-500/60 hover:bg-sky-400'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#9FA6A8] font-mono mt-3">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>NOW</span>
            </div>
          </div>

          {/* Recent Security Events Sidebar */}
          <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#F3F4F1] mb-3">Recent Security Events</h4>
              <div className="space-y-3">
                
                <div className="p-2.5 rounded-lg bg-[#111417] border border-[#252A2E] flex items-start space-x-3">
                  <span className="p-1 rounded bg-amber-500/10 text-amber-400 mt-0.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-medium text-[#F3F4F1]">DoS Flood Detected</div>
                    <div className="text-[10px] text-[#9FA6A8] font-mono">192.168.1.104 → 10.0.0.1 • 98.2% AI Conf</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#111417] border border-[#252A2E] flex items-start space-x-3">
                  <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-medium text-[#F3F4F1]">Zero Trust Token Issued</div>
                    <div className="text-[10px] text-[#9FA6A8] font-mono">User: admin • Role: Admin • HS256 JWT</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#111417] border border-[#252A2E] flex items-start space-x-3">
                  <span className="p-1 rounded bg-sky-500/10 text-sky-400 mt-0.5">
                    <Lock className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <div className="text-xs font-medium text-[#F3F4F1]">LSTM Weights Updated</div>
                    <div className="text-[10px] text-[#9FA6A8] font-mono">10 Epochs • Loss: 0.0521 • Saved .keras</div>
                  </div>
                </div>

              </div>
            </div>

            <button 
              onClick={onExplore}
              className="w-full mt-4 py-2 rounded-lg bg-[#111417] hover:bg-[#1E2328] border border-[#252A2E] text-xs font-medium text-[#F3F4F1] transition-colors text-center"
            >
              View Full Security Console
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
