import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { OverviewView } from './dashboard/OverviewView';
import { DatasetsView } from './dashboard/DatasetsView';
import { CompareView } from './dashboard/CompareView';
import { TrainingView } from './dashboard/TrainingView';
import { ModelDetailsView } from './dashboard/ModelDetailsView';
import { ReportsView } from './dashboard/ReportsView';
import { AuditLogsView } from './dashboard/AuditLogsView';
import { ProfileView } from './dashboard/ProfileView';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Bell, Search, LogOut, Sun, Moon, Monitor, User as UserIcon, GraduationCap } from 'lucide-react';

export const DashboardApp = ({ onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState('training');
  const [showProfile, setShowProfile] = useState(false);
  const { user, role, logout } = useAuth();
  const { themeMode, toggleTheme, isDark } = useTheme();

  const currentRole = role || user?.role || 'Admin';

  const handleLogout = () => {
    logout();
    if (onBackToLanding) {
      onBackToLanding();
    }
  };

  const renderActiveView = () => {
    if (showProfile) {
      return <ProfileView onClose={() => setShowProfile(false)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <OverviewView onNavigate={setActiveTab} />;
      case 'datasets':
        return <DatasetsView onNavigate={setActiveTab} />;
      case 'compare':
        return <CompareView />;
      case 'training':
        return <TrainingView onNavigate={setActiveTab} />;
      case 'model-details':
        return <ModelDetailsView />;
      case 'reports':
        return <ReportsView />;
      case 'audit-logs':
        return <AuditLogsView />;
      default:
        return <TrainingView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#172033] dark:text-[#F3F4F1] flex transition-colors duration-200">
      
      {/* Left Menu Bar ONLY */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setShowProfile(false); setActiveTab(tab); }} 
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E] px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm transition-colors duration-200">
          
          {/* Left: Brand Shield & Institution Details */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setShowProfile(false); setActiveTab('dashboard'); }}>
            <img
              src="/jnnce_logo.png"
              alt="JNNCE Logo"
              className="h-8 w-8 object-contain bg-white rounded p-0.5 border border-slate-200 dark:border-slate-800"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs sm:text-sm text-[#172033] dark:text-[#F3F4F1] tracking-tight">Zero Trust NIDS</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-[#1769E0] border border-blue-200 dark:border-blue-800">
                  BATCH 34
                </span>
              </div>
              <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] font-mono block">
                JNNCE Shimoga • Dept of Information Science & Engineering
              </span>
            </div>
          </div>

          {/* Right: Theme Switcher, Search, Profile Badge, Logout */}
          <div className="flex items-center space-x-3">
            
            {/* Search */}
            <div className="relative hidden md:block w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#475569] dark:text-[#9FA6A8]" />
              <input
                type="text"
                placeholder="Search portal..."
                className="w-full bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] focus:border-[#1769E0] rounded-lg py-1.5 pl-8 pr-3 text-xs text-[#172033] dark:text-[#F3F4F1] outline-none"
              />
            </div>

            {/* System Appearance Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              title={`Theme: ${themeMode.toUpperCase()} (Click to toggle System/Dark/Light)`}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] text-xs font-mono text-[#475569] dark:text-[#9FA6A8] hover:text-[#1769E0] transition-colors"
            >
              {themeMode === 'system' ? (
                <>
                  <Monitor className="h-3.5 w-3.5 text-[#1769E0]" />
                  <span className="hidden sm:inline text-[10px]">System</span>
                </>
              ) : isDark ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-[#1769E0]" />
                  <span className="hidden sm:inline text-[10px]">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span className="hidden sm:inline text-[10px]">Light</span>
                </>
              )}
            </button>

            {/* Notifications Bell */}
            <button className="p-2 rounded-lg text-[#475569] dark:text-[#9FA6A8] hover:bg-slate-100 dark:hover:bg-[#1E2328] relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#1769E0]" />
            </button>

            {/* User Profile Badge */}
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center space-x-2 bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] px-3 py-1.5 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-[#1E2328] transition-colors"
            >
              <UserIcon className="h-3.5 w-3.5 text-[#1769E0]" />
              <div className="text-left">
                <span className="font-bold text-[#172033] dark:text-[#F3F4F1] text-[11px] block leading-tight">{user?.username || 'admin'}</span>
                <span className="text-[9px] font-mono text-[#1769E0] font-bold uppercase block">{currentRole}</span>
              </div>
            </button>

            {/* Working Logout Button */}
            <button
              onClick={handleLogout}
              title="Logout Session"
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>

          </div>

        </header>

        {/* Dynamic Main Body Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-[#15191C] border-t border-[#E2E8F0] dark:border-[#252A2E] py-3 text-center text-xs text-[#475569] dark:text-[#9FA6A8] font-mono transition-colors duration-200">
          Jawaharlal Nehru National College of Engineering, Shivamogga • Dept. of Information Science & Engineering • Project Batch No. 34
        </footer>

      </div>

    </div>
  );
};
