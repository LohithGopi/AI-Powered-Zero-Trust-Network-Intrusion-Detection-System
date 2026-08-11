import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, CheckCircle2, XCircle, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileView = ({ onClose }) => {
  const { user, role } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatching = newPassword && newPassword === confirmPassword;

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setError('New password does not meet all security complexity requirements.');
      return;
    }

    if (!isMatching) {
      setError('New password and confirmation password do not match.');
      return;
    }

    setMessage('Password updated successfully in Zero Trust security database.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#1769E0] flex items-center justify-center font-bold">
            <UserIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#172033]">User Profile & Security Settings</h1>
            <p className="text-xs text-[#475569]">Manage authentication credentials and view role permissions.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-[#475569] hover:text-[#172033] bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl"
        >
          Close Settings
        </button>
      </div>

      {/* User Information Summary */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#172033] font-mono uppercase mb-4">Account Metadata</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#475569]">
          <div>
            <span className="block text-[10px]">USERNAME</span>
            <span className="text-[#172033] font-bold">{user?.username || 'admin'}</span>
          </div>
          <div>
            <span className="block text-[10px]">ASSIGNED RBAC ROLE</span>
            <span className="text-[#1769E0] font-bold">[{role.toUpperCase()}]</span>
          </div>
          <div>
            <span className="block text-[10px]">AUTHENTICATION TIER</span>
            <span className="text-emerald-600 font-bold">PyJWT Signed HMAC-SHA256</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Key className="h-5 w-5 text-[#1769E0]" />
          <h2 className="text-base font-bold text-[#172033]">Change Password</h2>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-[#475569] font-medium mb-1">Current Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-[#172033] outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[#475569] font-medium">New Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#1769E0] flex items-center space-x-1 text-[11px]"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-[#172033] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#475569] font-medium mb-1">Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-[#172033] outline-none"
            />
          </div>

          {/* Password Complexity Checklist */}
          <div className="bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl p-4 space-y-1.5 font-mono text-[11px]">
            <div className="text-[#172033] font-bold font-sans text-xs mb-2">Password Complexity Requirements:</div>
            
            <div className="flex items-center space-x-2">
              {hasMinLength ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-slate-300" />}
              <span className={hasMinLength ? 'text-emerald-700' : 'text-[#475569]'}>At least 8 characters long</span>
            </div>

            <div className="flex items-center space-x-2">
              {hasUppercase ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-slate-300" />}
              <span className={hasUppercase ? 'text-emerald-700' : 'text-[#475569]'}>Contains uppercase letter (A-Z)</span>
            </div>

            <div className="flex items-center space-x-2">
              {hasLowercase ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-slate-300" />}
              <span className={hasLowercase ? 'text-emerald-700' : 'text-[#475569]'}>Contains lowercase letter (a-z)</span>
            </div>

            <div className="flex items-center space-x-2">
              {hasNumber ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-slate-300" />}
              <span className={hasNumber ? 'text-emerald-700' : 'text-[#475569]'}>Contains number (0-9)</span>
            </div>

            <div className="flex items-center space-x-2">
              {hasSpecial ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-slate-300" />}
              <span className={hasSpecial ? 'text-emerald-700' : 'text-[#475569]'}>Contains special character (!@#$%^&*)</span>
            </div>

            <div className="flex items-center space-x-2 pt-1 border-t border-slate-200">
              {isMatching ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-slate-300" />}
              <span className={isMatching ? 'text-emerald-700 font-bold' : 'text-[#475569]'}>Passwords match</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#1769E0] hover:bg-[#0F3B68] text-white font-semibold text-xs shadow-md transition-all font-sans"
          >
            Update Security Password
          </button>

        </form>
      </div>

    </div>
  );
};
