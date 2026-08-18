import React, { useState } from 'react';
import { ArrowLeft, KeyRound, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react';

export const ForgotPasswordPage = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSendCode = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onBackToLogin}
          className="flex items-center space-x-2 text-xs font-semibold text-[#475569] hover:text-[#1769E0] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Login</span>
        </button>

        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-[#1769E0]" />
          <span className="font-bold text-sm text-[#172033]">Zero Trust AI-Powered NIDS</span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-hero">
          
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-[#1769E0] flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-[#172033]">Password Recovery</h2>
            <p className="text-xs text-[#475569] mt-1">Zero Trust Security Account Reset Procedure</p>
          </div>

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#172033] mb-1">Registered Account Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@jnnce.ac.in"
                  className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#172033] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1769E0] hover:bg-[#0F3B68] text-white font-semibold text-xs shadow-md transition-all"
              >
                Send Recovery Verification Code
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#172033] mb-1">Enter 6-Digit Verification Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="849201"
                  className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs font-mono text-[#172033] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1769E0] hover:bg-[#0F3B68] text-white font-semibold text-xs shadow-md transition-all"
              >
                Verify Reset Code
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#172033] mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 pr-10 text-xs text-[#172033] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#1769E0] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1769E0] hover:bg-[#0F3B68] text-white font-semibold text-xs shadow-md transition-all"
              >
                Save New Password
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-[#172033]">Password Reset Successful</h3>
              <p className="text-xs text-[#475569]">Your password has been updated in the Zero Trust security database.</p>
              <button
                onClick={onBackToLogin}
                className="w-full py-3 rounded-xl bg-[#1769E0] text-white text-xs font-semibold shadow-md"
              >
                Return to Login
              </button>
            </div>
          )}

        </div>
      </div>

      <div className="text-center text-xs text-[#475569] font-mono">
        © 2026 Zero Trust AI-Powered NIDS
      </div>

    </div>
  );
};
