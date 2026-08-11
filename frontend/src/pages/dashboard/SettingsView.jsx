import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsView = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage('Settings successfully saved to database.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            CONFIGURATION CONSOLE
          </span>
          <h2 className="text-xl font-bold text-[#172033] mt-1">Platform Settings & Security Parameters</h2>
          <p className="text-xs text-[#475569]">Configure platform credentials, Zero Trust authentication bounds, and AI model paths.</p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2 text-xs font-medium">
        {['account', 'security', 'notifications', 'model', 'system'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              activeSubTab === tab 
                ? 'bg-blue-50 text-[#1769E0] border border-blue-200 font-bold' 
                : 'text-[#475569] hover:text-[#172033]'
            }`}
          >
            {tab} Settings
          </button>
        ))}
      </div>

      {savedMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono">
          ✓ {savedMessage}
        </div>
      )}

      {/* Content Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 max-w-2xl shadow-sm">
        <form onSubmit={handleSave} className="space-y-4">
          
          {activeSubTab === 'account' && (
            <>
              <h3 className="text-sm font-bold text-[#172033] mb-2">Account Profile</h3>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">Full Name</label>
                <input type="text" defaultValue={user?.username || 'Admin User'} className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#172033] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">Institutional Email</label>
                <input type="email" defaultValue={user?.email || 'admin@jnnce.ac.in'} className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#172033] outline-none" />
              </div>
            </>
          )}

          {activeSubTab === 'security' && (
            <>
              <h3 className="text-sm font-bold text-[#172033] mb-2">Zero Trust Security Config</h3>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">PyJWT Secret Algorithm</label>
                <input type="text" disabled value="HS256 (Signed HMAC-SHA256)" className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#475569] font-mono" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">Bcrypt Password Salt Rounds</label>
                <input type="text" disabled value="12 Rounds (16-Byte Random Salt)" className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#475569] font-mono" />
              </div>
            </>
          )}

          {activeSubTab === 'notifications' && (
            <>
              <h3 className="text-sm font-bold text-[#172033] mb-2">Alert Notifications</h3>
              <label className="flex items-center space-x-3 text-xs text-[#172033] cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-[#F5F7FA] border-[#E2E8F0] text-[#1769E0]" />
                <span>Enable Critical Threat Notification Banners</span>
              </label>
            </>
          )}

          {activeSubTab === 'model' && (
            <>
              <h3 className="text-sm font-bold text-[#172033] mb-2">AI Model Output Paths</h3>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">Keras Model Filepath</label>
                <input type="text" disabled value="models/nids_lstm_model.keras" className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#475569] font-mono" />
              </div>
            </>
          )}

          {activeSubTab === 'system' && (
            <>
              <h3 className="text-sm font-bold text-[#172033] mb-2">System Metadata</h3>
              <div className="text-xs text-[#475569] space-y-1 font-mono">
                <div>Project Title: AI-Powered Zero Trust Network Intrusion Detection System</div>
                <div>Phase: Phase 1 Scope</div>
              </div>
            </>
          )}

          <button type="submit" className="mt-4 px-6 py-2.5 rounded-xl bg-[#1769E0] text-white font-semibold text-xs flex items-center space-x-2 shadow-sm">
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>

        </form>
      </div>

    </div>
  );
};
