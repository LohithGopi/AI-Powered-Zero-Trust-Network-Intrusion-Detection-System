import React from 'react';
import { 
  LayoutDashboard, Database, BarChart2, Cpu, Layers, 
  Shield, LogOut, Info, Sun, Moon, Monitor, User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Sidebar = ({ activeTab, setActiveTab, onLogout, onOpenProfile }) => {
  const { user, role, logout } = useAuth();
  const { themeMode, toggleTheme, isDark } = useTheme();
  const currentRole = role || user?.role || 'Admin';
  const isAdmin = currentRole === 'Admin';

  const handleLogoutClick = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  // Admin Navigation vs Analyst Navigation (Evaluation Report removed)
  const navItems = isAdmin ? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'compare', label: 'Compare Datasets', icon: BarChart2 },
    { id: 'training', label: 'Model Training', icon: Cpu },
    { id: 'audit-logs', label: 'Audit Logs', icon: Shield },
    { id: 'about', label: 'About', icon: Info }
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'compare', label: 'Compare Datasets', icon: BarChart2 },
    { id: 'model-details', label: 'Model Information', icon: Layers },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <header className="w-full bg-[#081A35] text-white select-none shadow-xl border-b border-[#0D2347] sticky top-0 z-50">
      
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: College Logo -> Project Name FIRST -> Batch Name SECOND */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-3 cursor-pointer shrink-0"
        >
          <img
            src="/jnnce_logo.png"
            alt="JNNCE Logo"
            className="h-9 w-9 object-contain bg-white rounded-lg p-0.5 shadow-sm"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white">
              Zero Trust AI-Powered Network Intrusion Detection System
            </span>
            
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-900/80 text-[#38BDF8] border border-blue-700/80 shrink-0 w-max mt-0.5 sm:mt-0">
              BATCH NO. 34
            </span>
          </div>
        </div>

        {/* Right Controls: Role Badge, Theme Toggle, Profile & Logout */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {/* User Role Badge */}
          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border hidden md:inline-block ${
            isAdmin 
              ? 'bg-purple-900/60 text-purple-300 border-purple-700' 
              : 'bg-blue-900/60 text-blue-300 border-blue-700'
          }`}>
            [{currentRole.toUpperCase()}]
          </span>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={`Theme Mode: ${themeMode.toUpperCase()}`}
            className="p-2 rounded-xl bg-[#0D2347] hover:bg-[#122E5C] text-slate-300 hover:text-white transition-colors"
          >
            {themeMode === 'system' ? (
              <Monitor className="h-4 w-4 text-[#38BDF8]" />
            ) : isDark ? (
              <Moon className="h-4 w-4 text-[#38BDF8]" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

          {/* Profile Access Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0D2347] hover:bg-[#122E5C] text-xs font-semibold text-slate-200 transition-colors"
          >
            <UserIcon className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">{user?.username || 'admin'}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-xs font-semibold text-red-400 border border-red-800/80 transition-colors"
            title="Logout Session"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>

      {/* Secondary Horizontal Navigation Tab Menu */}
      <div className="bg-[#06152B] border-t border-[#0D2347] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1769E0] text-white shadow-md'
                    : 'text-slate-300 hover:bg-[#0D2347] hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
};
