import React from 'react';
import { 
  LayoutDashboard, Database, Upload, BarChart2, Cpu, Layers, 
  FileText, Shield, LogOut, Lock, GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const { user, role, logout } = useAuth();
  const currentRole = role || user?.role || 'Admin';

  const isUserRole = currentRole === 'User';

  const handleLogoutClick = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  const menuSections = [
    {
      title: 'Navigation',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Datasets & Ingestion',
      items: [
        { id: 'datasets', label: 'Datasets Inventory', icon: Database },
        { id: 'datasets', label: 'Upload CSV Dataset', icon: Upload, isRestricted: isUserRole },
        { id: 'compare', label: 'Compare Datasets', icon: BarChart2 }
      ]
    },
    {
      title: 'Machine Learning Engine',
      items: [
        { id: 'training', label: 'Model Training', icon: Cpu, isRestricted: isUserRole },
        { id: 'model-details', label: 'Model Architecture', icon: Layers },
        { id: 'reports', label: 'Evaluation Reports', icon: FileText }
      ]
    },
    {
      title: 'Governance',
      items: [
        { id: 'audit-logs', label: 'Security Audit Logs', icon: Shield },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#081A35] text-white flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none shadow-xl border-r border-[#0D2347]">
      
      <div>
        {/* Brand Header with JNNCE Logo & Title */}
        <div className="p-4 border-b border-[#0D2347] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/jnnce_logo.png"
                alt="JNNCE Logo"
                className="h-8 w-8 object-contain bg-white rounded p-0.5"
              />
              <div>
                <span className="font-bold text-xs text-white tracking-tight block">JNNCE Shimoga</span>
                <span className="text-[9px] text-[#38BDF8] font-mono block">Zero Trust NIDS</span>
              </div>
            </div>

            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-[#38BDF8] border border-blue-700">
              [{currentRole.toUpperCase()}]
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#0D2347]/60">
            <span>Dept. of ISE</span>
            <span className="text-amber-400 font-bold">BATCH 34</span>
          </div>
        </div>

        {/* Menu Section Links */}
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuSections.map((sec) => (
            <div key={sec.title} className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2">
                • {sec.title}
              </div>
              {sec.items.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={`${sec.title}-${idx}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1769E0] text-white shadow-md'
                        : 'text-slate-300 hover:bg-[#0D2347] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>

                    {item.isRestricted && (
                      <span className="text-[9px] font-mono text-amber-400 flex items-center space-x-0.5" title="Read-Only Permission">
                        <Lock className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Session Button */}
      <div className="p-4 border-t border-[#0D2347] bg-[#06152B]">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout Session</span>
        </button>
      </div>

    </aside>
  );
};
