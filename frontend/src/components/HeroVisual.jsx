import React from 'react';
import { Shield, Cpu, Lock, Activity, Zap, Radio } from 'lucide-react';

export const HeroVisual = () => {
  return (
    <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl glass-panel border border-[#252A2E] overflow-hidden flex items-center justify-center p-6 my-8">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-indigo-500/5 to-transparent pointer-events-none" />
      
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Abstract Network Visual Nodes */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        
        {/* Top Node Flow */}
        <div className="flex items-center space-x-12 mb-8">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-xl bg-[#15191C] border border-sky-500/30 flex items-center justify-center shadow-lg shadow-sky-500/10 animate-pulse">
              <Radio className="h-6 w-6 text-sky-400" />
            </div>
            <span className="text-[10px] font-mono text-[#9FA6A8] mt-2">Network Traffic Flow</span>
          </div>

          <div className="h-[2px] w-24 bg-gradient-to-r from-sky-500/40 via-sky-400 to-indigo-500/40 relative">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-sky-400 animate-ping" />
          </div>

          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-2xl bg-[#15191C] border border-indigo-500/40 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Cpu className="h-7 w-7 text-indigo-400" />
            </div>
            <span className="text-[10px] font-mono text-indigo-300 mt-2 font-semibold">64-Unit Keras LSTM Engine</span>
          </div>

          <div className="h-[2px] w-24 bg-gradient-to-r from-indigo-500/40 via-emerald-400 to-emerald-500/40 relative">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-xl bg-[#15191C] border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Lock className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-[10px] font-mono text-[#9FA6A8] mt-2">Zero Trust Verification</span>
          </div>
        </div>

        {/* Central Trust Score Meter */}
        <div className="w-full bg-[#111417] border border-[#252A2E] rounded-xl p-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <div className="text-xs font-semibold text-[#F3F4F1]">Continuous Zero Trust Analytics</div>
              <div className="text-[10px] text-[#9FA6A8] font-mono">HS256 JWT Token Verified • Bcrypt 12-Round Password Vault • RBAC Enforced</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-[10px] text-[#9FA6A8] uppercase tracking-wider font-mono">AI Prediction Confidence</div>
              <div className="text-sm font-bold font-mono text-sky-400">97.42%</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              TRUST VERIFIED
            </span>
          </div>
        </div>

      </div>

      {/* Floating Status Pills */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[#111417]/80 border border-[#252A2E] flex items-center space-x-2">
        <Activity className="h-3.5 w-3.5 text-sky-400 animate-spin" />
        <span className="text-[10px] font-mono text-[#9FA6A8]">Real-time Traffic Stream: 1,284 Flows/sec</span>
      </div>

      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-[#111417]/80 border border-[#252A2E] flex items-center space-x-2">
        <Zap className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-[10px] font-mono text-[#9FA6A8]">JNNCE Shimoga • Batch No. 34</span>
      </div>

    </div>
  );
};
