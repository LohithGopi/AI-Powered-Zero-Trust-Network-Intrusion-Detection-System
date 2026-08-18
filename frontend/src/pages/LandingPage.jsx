import React from 'react';
import { Lock, ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const LandingPage = ({ onExplore, onOpenLogin }) => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#172033] dark:text-[#F3F4F1] flex flex-col justify-between transition-colors">
      
      {/* 1. HEADER NAVBAR */}
      <Navbar onOpenLogin={onOpenLogin} onExplore={onExplore} />

      {/* 2. INSTITUTIONAL & PROJECT IDENTITY BANNER */}
      <main id="hero" className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Centered JNNCE Logo Image */}
          <div className="flex justify-center items-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <img
                src="/jnnce_logo.png"
                alt="J.N.N. College of Engineering Logo"
                className="relative h-28 w-28 sm:h-32 sm:w-32 object-contain rounded-xl bg-white p-2.5 border-2 border-slate-200 dark:border-slate-700 shadow-lg"
              />
            </div>
          </div>

          {/* Centered College & Department Title */}
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#172033] dark:text-[#F3F4F1] uppercase">
              Jawaharlal Nehru National College of Engineering, Shivamogga
            </h2>
            <p className="text-sm font-bold text-[#1769E0] font-mono uppercase tracking-wide">
              Department of Information Science and Engineering
            </p>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Affiliated to Visvesvaraya Technological University (VTU), Belagavi • Approved by AICTE, New Delhi
            </p>
          </div>

          {/* Centered Full Project Title */}
          <div className="pt-2 max-w-3xl mx-auto">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] shadow-md space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-[#1769E0]" />
                <span className="text-xs font-mono text-[#1769E0] font-bold uppercase tracking-wider">
                  FINAL YEAR B.E. ACADEMIC PROJECT (2023–2027)
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#172033] dark:text-[#F3F4F1] tracking-tight leading-tight">
                Zero Trust AI-Powered Network Intrusion Detection System
              </h1>

              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#9FA6A8] font-medium max-w-2xl mx-auto">
                Phase 1 – Dataset Preparation, Zero Trust Architecture, and AI-Based Intrusion Detection Model
              </p>
            </div>
          </div>

          {/* Centered Batch Badge */}
          <div className="flex items-center justify-center space-x-2 pt-1">
            <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#1769E0] dark:text-blue-400 text-xs font-mono font-bold shadow-xs">
              <GraduationCap className="h-4 w-4" />
              <span>PROJECT BATCH NO. 34</span>
            </span>
          </div>

          {/* Action Button Centered */}
          <div className="flex items-center justify-center pt-4">
            <button
              onClick={onOpenLogin}
              className="px-8 py-4 text-xs sm:text-sm font-bold text-white bg-[#1769E0] hover:bg-[#0F3B68] rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2.5 transform hover:-translate-y-0.5"
            >
              <Lock className="h-4 w-4 text-white" />
              <span>Explore Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 bg-white dark:bg-[#15191C] border-t border-[#E2E8F0] dark:border-[#252A2E] text-center text-xs text-[#475569] dark:text-[#9FA6A8] font-mono">
        JNNCE Shivamogga • Department of Information Science & Engineering • Batch No. 34
      </footer>

    </div>
  );
};
