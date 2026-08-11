import React, { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';

export const Navbar = ({ onOpenLogin, onExplore }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'College & Batch', href: '#jnnce-info' },
    { name: 'About NIDS', href: '#about-nids' },
    { name: 'Zero Trust', href: '#zero-trust' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Project', href: '#project' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#15191C]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#252A2E] shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & College Info */}
        <a href="#hero" className="flex items-center space-x-3 group">
          <img
            src="/jnnce_logo.png"
            alt="J.N.N. College of Engineering Logo"
            className="h-10 w-10 object-contain rounded-lg border border-slate-200 dark:border-slate-800 bg-white p-0.5 shadow-xs"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs sm:text-sm tracking-tight text-[#172033] dark:text-[#F3F4F1]">
                Zero Trust AI-Powered NIDS
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-[#1769E0] border border-blue-100 dark:border-blue-800 font-bold hidden sm:inline-block">
                BATCH 34
              </span>
            </div>
            <p className="text-[10px] text-[#475569] dark:text-[#9FA6A8] font-medium hidden md:block">
              JNNCE Shimoga • Dept of Information Science & Engineering
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 text-xs font-medium text-[#475569] dark:text-[#9FA6A8] hover:text-[#1769E0] hover:bg-slate-50 dark:hover:bg-[#1E2328] rounded-md transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA / Login */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1769E0] hover:bg-[#0F3B68] rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Login to Security Portal</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#475569] dark:text-[#9FA6A8] hover:text-[#172033] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2328] focus:outline-none"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E] px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-medium text-[#475569] dark:text-[#9FA6A8] hover:text-[#1769E0] hover:bg-slate-50 dark:hover:bg-[#1E2328] rounded-md"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#252A2E]">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#1769E0] hover:bg-[#0F3B68] rounded-lg flex items-center justify-center space-x-2"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Login to Security Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
