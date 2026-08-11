import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Shield, CheckCircle2, Download } from 'lucide-react';

export const ThreatsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const initialThreats = [
    { id: 'TRT-9041', timestamp: '2026-08-10 17:42:15', src: '192.168.1.104', dst: '10.0.0.1 (Web Server)', proto: 'TCP', type: 'DoS SYN Flood', severity: 'Critical', confidence: '98.4%', status: 'Mitigated' },
    { id: 'TRT-9042', timestamp: '2026-08-10 17:38:09', src: '192.168.1.112', dst: '10.0.0.5 (DB Vault)', proto: 'TCP', type: 'Reconnaissance Probe', severity: 'High', confidence: '96.8%', status: 'Investigating' },
    { id: 'TRT-9043', timestamp: '2026-08-10 17:31:44', src: '172.16.0.45', dst: '10.0.0.1 (Web Server)', proto: 'UDP', type: 'UDP Volumetric Flood', severity: 'Critical', confidence: '99.1%', status: 'Mitigated' },
    { id: 'TRT-9044', timestamp: '2026-08-10 17:15:22', src: '192.168.1.108', dst: '10.0.0.2 (SSH Host)', proto: 'TCP', type: 'Exploitation Attempt', severity: 'High', confidence: '97.5%', status: 'Mitigated' },
    { id: 'TRT-9045', timestamp: '2026-08-10 16:54:10', src: '192.168.1.120', dst: '10.0.0.8 (DNS Server)', proto: 'UDP', type: 'Fuzzers Anomaly', severity: 'Medium', confidence: '95.2%', status: 'Resolved' },
    { id: 'TRT-9046', timestamp: '2026-08-10 16:30:01', src: '10.0.0.14', dst: '10.0.0.1 (Web Server)', proto: 'ICMP', type: 'Ping Sweep Probe', severity: 'Low', confidence: '98.0%', status: 'Resolved' }
  ];

  const filteredThreats = initialThreats.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.src.includes(searchTerm) ||
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || item.severity.toUpperCase() === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const severityBadges = {
    Critical: 'bg-red-50 text-red-700 border-red-200',
    High: 'bg-amber-50 text-amber-700 border-amber-200',
    Medium: 'bg-blue-50 text-[#1769E0] border-blue-200',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            TRAFFIC CLASSIFICATION
          </span>
          <h2 className="text-xl font-bold text-[#172033] mt-1">Threat Detection Console</h2>
          <p className="text-xs text-[#475569]">Evaluated sample traffic records classified by the Keras LSTM model.</p>
        </div>

        <button 
          onClick={() => alert('Exporting Threat Intelligence Report as CSV...')}
          className="flex items-center space-x-2 text-xs font-semibold text-[#1769E0] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Threats CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Threat ID, IP, Attack Type..."
            className="w-full bg-[#F5F7FA] border border-[#E2E8F0] focus:border-[#1769E0] focus:bg-white rounded-lg py-2 pl-10 pr-4 text-xs text-[#172033] outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#475569] w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-[#1769E0]" />
          <span>Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#172033] outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Threats Data Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-[#475569] font-mono text-[10px] uppercase border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Threat ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Source IP</th>
                <th className="py-3 px-4">Destination IP</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Attack Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredThreats.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1769E0]">{t.id}</td>
                  <td className="py-3 px-4 font-mono text-[#475569]">{t.timestamp}</td>
                  <td className="py-3 px-4 font-mono text-[#172033]">{t.src}</td>
                  <td className="py-3 px-4 font-mono text-[#475569]">{t.dst}</td>
                  <td className="py-3 px-4 font-mono"><span className="px-2 py-0.5 rounded bg-[#F5F7FA] text-[#172033] border border-[#E2E8F0]">{t.proto}</span></td>
                  <td className="py-3 px-4 font-semibold text-[#172033]">{t.type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] border ${severityBadges[t.severity] || ''}`}>
                      {t.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-600 font-bold">{t.confidence}</td>
                  <td className="py-3 px-4 font-mono text-[#475569]">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
