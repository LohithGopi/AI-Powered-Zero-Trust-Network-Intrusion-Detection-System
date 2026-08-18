import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { OverviewView } from './dashboard/OverviewView';
import { DatasetsView } from './dashboard/DatasetsView';
import { CompareView } from './dashboard/CompareView';
import { TrainingView } from './dashboard/TrainingView';
import { ModelDetailsView } from './dashboard/ModelDetailsView';
import { AuditLogsView } from './dashboard/AuditLogsView';
import { ProfileView } from './dashboard/ProfileView';
import { AboutView } from './dashboard/AboutView';
import { useAuth } from '../context/AuthContext';

export const DashboardApp = ({ onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const { user, role, logout } = useAuth();
  const isAdmin = (role || user?.role) === 'Admin';

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
        return isAdmin ? <TrainingView onNavigate={setActiveTab} /> : <OverviewView onNavigate={setActiveTab} />;
      case 'model-details':
        return <ModelDetailsView />;
      case 'audit-logs':
        return isAdmin ? <AuditLogsView /> : <OverviewView onNavigate={setActiveTab} />;
      case 'about':
        return <AboutView />;
      default:
        return <OverviewView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#172033] dark:text-[#F3F4F1] flex flex-col transition-colors duration-200">
      
      {/* Top Navigation Bar Header */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setShowProfile(false); setActiveTab(tab); }} 
        onLogout={handleLogout}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#15191C] border-t border-[#E2E8F0] dark:border-[#252A2E] py-3 text-center text-xs text-[#475569] dark:text-[#9FA6A8] font-mono transition-colors duration-200">
        Department of Information Science & Engineering • Project Batch No. 34
      </footer>

    </div>
  );
};
