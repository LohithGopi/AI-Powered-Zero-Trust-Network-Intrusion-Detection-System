import React from 'react';
import { Activity, Server, Radio, Database, Sliders, Shield } from 'lucide-react';
import { NetworkGraph } from '../../components/NetworkGraph';

export const TrafficView = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111417] border border-[#252A2E] rounded-xl p-6">
        <div>
          <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-semibold">NETWORK INTELLIGENCE</span>
          <h2 className="text-xl font-bold text-[#F3F4F1] mt-1">Network Traffic & Flow Analytics</h2>
          <p className="text-xs text-[#9FA6A8]">Packet-level attribute analysis, protocol breakdowns, and flow relationships.</p>
        </div>
      </div>

      {/* Network Topology Graph Component */}
      <NetworkGraph />

      {/* Feature Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-5">
          <h3 className="text-xs font-bold text-[#F3F4F1] mb-3">Protocol Distribution</h3>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[#9FA6A8] mb-1">
                <span>TCP (Transmission Control)</span>
                <span className="text-sky-400 font-bold">78.4%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111417]">
                <div className="h-2 rounded-full bg-sky-400 w-[78%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#9FA6A8] mb-1">
                <span>UDP (User Datagram)</span>
                <span className="text-indigo-400 font-bold">16.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111417]">
                <div className="h-2 rounded-full bg-indigo-400 w-[16%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#9FA6A8] mb-1">
                <span>ICMP (Control Message)</span>
                <span className="text-emerald-400 font-bold">5.4%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111417]">
                <div className="h-2 rounded-full bg-emerald-400 w-[5%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-5">
          <h3 className="text-xs font-bold text-[#F3F4F1] mb-3">TCP Connection Flags</h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-2 rounded bg-[#111417] border border-[#252A2E]">
              <span className="text-[#9FA6A8]">SF (Established Connection):</span>
              <span className="text-emerald-400 font-bold">84.2%</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#111417] border border-[#252A2E]">
              <span className="text-[#9FA6A8]">S0 (SYN Sent, No ACK):</span>
              <span className="text-amber-400 font-bold">12.1% (SYN Flood Probe)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#111417] border border-[#252A2E]">
              <span className="text-[#9FA6A8]">REJ (Rejected Connection):</span>
              <span className="text-red-400 font-bold">3.7% (Port Probing)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#15191C] border border-[#252A2E] rounded-xl p-5">
          <h3 className="text-xs font-bold text-[#F3F4F1] mb-3">Feature Statistics</h3>
          <div className="space-y-2 font-mono text-xs text-[#9FA6A8]">
            <div className="flex justify-between">
              <span>Avg Flow Duration:</span>
              <span className="text-[#F3F4F1]">1.42 Seconds</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Source Bytes:</span>
              <span className="text-[#F3F4F1]">1,284 Bytes</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Destination Bytes:</span>
              <span className="text-[#F3F4F1]">4,820 Bytes</span>
            </div>
            <div className="flex justify-between">
              <span>Connection Rate:</span>
              <span className="text-sky-400">142 Flows/sec</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
