import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardApp } from './pages/DashboardApp';

const AppRouter = () => {
  const { isAuthenticated, resetModelStatus } = useAuth();
  const [currentView, setCurrentView] = useState('landing');

  // If user signs in, switch to dashboard and reset model status to Untrained
  const handleSuccessLogin = () => {
    resetModelStatus();
    setCurrentView('dashboard');
  };

  const handleOpenLogin = () => {
    resetModelStatus();
    setCurrentView('login');
  };

  if (currentView === 'login') {
    return (
      <LoginPage 
        onBackToLanding={() => setCurrentView('landing')}
        onForgotPassword={() => setCurrentView('forgot-password')}
        onSuccessLogin={handleSuccessLogin}
      />
    );
  }

  if (currentView === 'forgot-password') {
    return (
      <ForgotPasswordPage 
        onBackToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'dashboard' || (isAuthenticated && currentView !== 'landing')) {
    return (
      <DashboardApp 
        onBackToLanding={() => {
          resetModelStatus();
          setCurrentView('landing');
        }}
      />
    );
  }

  // Default: Master Landing Page
  return (
    <LandingPage 
      onExplore={() => {
        resetModelStatus();
        setCurrentView('dashboard');
      }}
      onOpenLogin={handleOpenLogin}
    />
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
