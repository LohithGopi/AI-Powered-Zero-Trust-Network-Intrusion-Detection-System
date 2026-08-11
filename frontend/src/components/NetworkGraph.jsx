import React from 'react';
import { Server, Shield, Network, Lock, Cpu, Database, CheckCircle2 } from 'lucide-react';

export const NetworkGraph = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-[#1769E0]" />
            <h3 className="text-base font-bold text-[#172033]">Zero Trust Topology Flow</h3>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">Abstract network topology graph showing traffic path, Zero Trust gateway, and LSTM model evaluation node.</p>
        </div>

        <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-blue-50 text-[#1769E0] border border-blue-100 self-start sm:self-auto">
          ● ZERO TRUST VERIFIED NODE
        </span>
      </div>

      {/* Abstract Node Topology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center font-mono text-xs">
        
        {/* Node 1: Ingest Client */}
        <div className="bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl p-4 text-center space-y-2">
          <div className="h-10 w-10 rounded-lg bg-blue-100 text-[#1769E0] flex items-center justify-center mx-auto font-bold">
            <Server className="h-5 w-5" />
          </div>
          <div className="font-bold text-[#172033] text-xs">Client Endpoint</div>
          <div className="text-[10px] text-[#475569]">IP: 192.168.1.104</div>
          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#1769E0] text-[9px] border border-blue-200">
            TCP Traffic
          </span>
        </div>

        {/* Connector */}
        <div className="hidden md:flex justify-center text-[#1769E0] font-bold text-lg">→</div>

        {/* Node 2: Zero Trust Security Gateway */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center space-y-2">
          <div className="h-10 w-10 rounded-lg bg-[#1769E0] text-white flex items-center justify-center mx-auto font-bold">
            <Shield className="h-5 w-5" />
          </div>
          <div className="font-bold text-[#0F3B68] text-xs">Zero Trust Gateway</div>
          <div className="text-[10px] text-[#1769E0]">PyJWT HMAC-SHA256</div>
          <span className="inline-block px-2 py-0.5 rounded bg-white text-emerald-700 text-[9px] border border-emerald-200 font-bold">
            Auth Verified
          </span>
        </div>

        {/* Connector */}
        <div className="hidden md:flex justify-center text-[#1769E0] font-bold text-lg">→</div>

        {/* Node 3: LSTM Intelligence Engine */}
        <div className="bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl p-4 text-center space-y-2">
          <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="font-bold text-[#172033] text-xs">LSTM Classification</div>
          <div className="text-[10px] text-[#475569]">64-Unit Recurrent Net</div>
          <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[9px] border border-emerald-200 font-bold">
            97.42% Accuracy
          </span>
        </div>

      </div>

    </div>
  );
};
