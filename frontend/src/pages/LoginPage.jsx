import React, { useState } from 'react';
import { Shield, Lock, User, ArrowLeft, CheckCircle2, AlertCircle, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onBackToLanding, onForgotPassword, onSuccessLogin }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);
    if (roleName === 'Admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (roleName === 'Analyst') {
      setUsername('analyst');
      setPassword('analyst123');
    } else {
      setUsername('user');
      setPassword('user123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password, selectedRole);
      onSuccessLogin();
    } catch (err) {
      setError(err?.message || 'Invalid username or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#172033] dark:text-[#F3F4F1] flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-2 text-xs font-semibold text-[#475569] dark:text-[#9FA6A8] hover:text-[#1769E0] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home Page</span>
        </button>

        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-[#1769E0]" />
          <span className="font-bold text-sm text-[#172033] dark:text-[#F3F4F1]">Zero Trust AI-Powered NIDS</span>
        </div>
      </div>

      {/* Main Login Card Area */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 sm:p-8 shadow-hero">
          
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1769E0] flex items-center justify-center mx-auto mb-3 border border-blue-100 dark:border-blue-800">
              <Lock className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1769E0] bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
              SECURITY PORTAL
            </span>
            <h2 className="text-xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-2">Sign In to Account</h2>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8] mt-1">Select role and enter your credentials to authenticate.</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#F5F7FA] dark:bg-[#0B0D0F] p-1 rounded-xl border border-[#E2E8F0] dark:border-[#252A2E] mb-6 text-xs font-medium">
            {['Admin', 'Analyst', 'User'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={`py-2 rounded-lg transition-all text-center ${
                  selectedRole === role
                    ? 'bg-white dark:bg-[#15191C] text-[#1769E0] font-bold shadow-sm border border-[#E2E8F0] dark:border-[#252A2E]'
                    : 'text-[#475569] dark:text-[#9FA6A8] hover:text-[#172033] dark:hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#172033] dark:text-[#F3F4F1] mb-1">Username / Email</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] focus:border-[#1769E0] focus:bg-white rounded-lg p-2.5 text-xs text-[#172033] dark:text-[#F3F4F1] outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#172033] dark:text-[#F3F4F1]">Password</label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-[#1769E0] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] focus:border-[#1769E0] focus:bg-white rounded-lg p-2.5 text-xs text-[#172033] dark:text-[#F3F4F1] outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1769E0] hover:bg-[#0F3B68] text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  <span>Authenticate & Access Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#252A2E] text-center">
            <span className="text-[11px] font-mono text-[#475569] dark:text-[#9FA6A8] block">
              Zero Trust Role: <strong className="text-[#1769E0]">{selectedRole} Tier</strong>
            </span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#475569] dark:text-[#9FA6A8] font-mono">
        © 2026 Zero Trust AI-Powered NIDS • Academic Phase 1 Implementation
      </div>

    </div>
  );
};
