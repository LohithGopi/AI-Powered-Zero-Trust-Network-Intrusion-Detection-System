import React from 'react';
import { Activity, Clock, ShieldAlert } from 'lucide-react';

export const BehaviorView = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            TRAFFIC FEATURE ANALYTICS
          </span>
          <h2 className="text-xl font-bold text-[#172033] mt-1">Behavior Analytics & Risk Scoring</h2>
          <p className="text-xs text-[#475569]">Statistical deviation scores and sample host activity log timeline.</p>
        </div>

        <span className="px-3 py-1 rounded bg-amber-50 text-amber-700 font-mono text-xs font-bold border border-amber-200">
          RISK SCORE: 82 / 100 (EVALUATION SAMPLE)
        </span>
      </div>

      {/* Analytics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-card">
          <h3 className="text-xs font-bold text-[#172033] mb-2">Behavior Deviation Score</h3>
          <div className="text-3xl font-bold font-mono text-amber-600 mb-1">0.84</div>
          <div className="text-[10px] text-[#475569]">Statistical Z-score distance from baseline host profile.</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-card">
          <h3 className="text-xs font-bold text-[#172033] mb-2">Active Anomaly Flags</h3>
          <div className="text-3xl font-bold font-mono text-red-600 mb-1">3 Alerts</div>
          <div className="text-[10px] text-[#475569]">High-frequency port probing & anomalous byte transfers.</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-card">
          <h3 className="text-xs font-bold text-[#172033] mb-2">Zero Trust Trust Index</h3>
          <div className="text-3xl font-bold font-mono text-[#1769E0] mb-1">94.2%</div>
          <div className="text-[9px] text-[#475569]">Identity verified via PyJWT HS256 stateless signature.</div>
        </div>

      </div>

    </div>
  );
};
