import React, { useState } from 'react';
import { Search, FileText, Download, ShieldCheck, Lock } from 'lucide-react';

export const AuditLogsView = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const initialLogs = [
    { timestamp: '2026-08-10 17:42:15', user: 'admin', role: 'Admin', action: 'THREAT_DETECTED', resource: 'nids_lstm_model.keras', ip: '127.0.0.1', status: 'SUCCESS' },
    { timestamp: '2026-08-10 17:35:01', user: 'admin', role: 'Admin', action: 'MODEL_TRAINING_STARTED', resource: 'NSL-KDD Dataset', ip: '127.0.0.1', status: 'SUCCESS' },
    { timestamp: '2026-08-10 17:15:22', user: 'analyst', role: 'Analyst', action: 'DATASET_SELECTED', resource: 'nsl_kdd_benchmark_sample.csv', ip: '192.168.1.15', status: 'SUCCESS' },
    { timestamp: '2026-08-10 16:50:11', user: 'admin', role: 'Admin', action: 'LOGIN_SUCCESS', resource: '/api/auth/login', ip: '127.0.0.1', status: 'SUCCESS' },
    { timestamp: '2026-08-10 16:20:04', user: 'unknown', role: 'Public', action: 'LOGIN_FAILED', resource: '/api/auth/login', ip: '192.168.1.199', status: 'FAILED' },
    { timestamp: '2026-08-10 15:45:30', user: 'admin', role: 'Admin', action: 'ROLE_VERIFIED', resource: '@require_role(["Admin"])', ip: '127.0.0.1', status: 'SUCCESS' }
  ];

  const filteredLogs = initialLogs.filter(log =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            IMMUTABLE COMPLIANCE
          </span>
          <h2 className="text-xl font-bold text-[#172033] mt-1">Security Audit Trail</h2>
          <p className="text-xs text-[#475569]">SQLite database audit event logs recording all administrative, login, and training operations.</p>
        </div>

        <button 
          onClick={() => alert('Exporting Audit Trail as CSV...')}
          className="flex items-center space-x-2 text-xs font-semibold text-[#1769E0] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export Audit Logs CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search User, Action, Resource, IP..."
            className="w-full bg-[#F5F7FA] border border-[#E2E8F0] focus:border-[#1769E0] focus:bg-white rounded-lg py-2 pl-10 pr-4 text-xs text-[#172033] outline-none"
          />
        </div>
        <div className="text-[10px] font-mono text-emerald-700 flex items-center space-x-1 font-bold">
          <Lock className="h-3.5 w-3.5 text-emerald-600" />
          <span>IMMUTABLE DATABASE LOGS</span>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-[#475569] font-mono text-[10px] uppercase border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#475569]">{log.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-[#172033]">{log.user}</td>
                  <td className="py-3 px-4 font-mono"><span className="px-2 py-0.5 rounded bg-[#F5F7FA] text-[#1769E0] border border-[#E2E8F0] font-semibold">{log.role}</span></td>
                  <td className="py-3 px-4 font-mono text-[#172033] font-bold">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-[#475569]">{log.resource}</td>
                  <td className="py-3 px-4 font-mono text-[#475569]">{log.ip}</td>
                  <td className="py-3 px-4 font-mono">
                    <span className={`px-2 py-0.5 rounded border text-[10px] ${log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
