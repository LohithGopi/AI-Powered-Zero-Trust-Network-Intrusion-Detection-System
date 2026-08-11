import React from 'react';
import { 
  Shield, Lock, Database, Server, Network, User, Activity, BarChart2, 
  FileText, Key, CheckCircle2, ArrowRight, ArrowDown, Cpu, Sliders, 
  Layers, Layers2, ShieldCheck, FileSpreadsheet, GraduationCap, Award
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { IntegratedDashboardPreview } from '../components/IntegratedDashboardPreview';

export const LandingPage = ({ onExplore, onOpenLogin }) => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#172033] dark:text-[#F3F4F1] transition-colors">
      
      {/* 1. HEADER NAVBAR */}
      <Navbar onOpenLogin={onOpenLogin} onExplore={onOpenLogin} />

      {/* 2. CENTERED INSTITUTIONAL LOGO, COLLEGE NAME, DEPARTMENT & PROJECT TITLE BANNER */}
      <section id="jnnce-info" className="pt-10 pb-8 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          
          {/* Centered Official JNNCE Logo Image */}
          <div className="flex justify-center items-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <img
                src="/jnnce_logo.png"
                alt="J.N.N. College of Engineering Logo"
                className="relative h-24 w-24 sm:h-28 sm:w-28 object-contain rounded-xl bg-white p-2 border-2 border-slate-200 dark:border-slate-700 shadow-md"
              />
            </div>
          </div>

          {/* Centered College Name & Department */}
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#172033] dark:text-[#F3F4F1] uppercase">
              Jawaharlal Nehru National College of Engineering, Shivamogga
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#1769E0] font-mono uppercase">
              Department of Information Science and Engineering
            </p>
            <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8]">
              Affiliated to Visvesvaraya Technological University (VTU), Belagavi • Approved by AICTE, New Delhi
            </p>
          </div>

          {/* Centered Full Project Title in the Middle */}
          <div className="pt-2 pb-1 max-w-3xl mx-auto">
            <div className="p-5 rounded-2xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] shadow-sm">
              <span className="text-[10px] font-mono text-[#1769E0] font-bold uppercase tracking-wider block mb-1">
                FINAL YEAR B.E. PROJECT TITLE
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#172033] dark:text-[#F3F4F1] tracking-tight">
                Zero Trust AI-Powered Network Intrusion Detection System
              </h1>
            </div>
          </div>

          {/* Centered Project Batch Badge */}
          <div className="flex items-center justify-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#1769E0] dark:text-blue-400 text-xs font-mono font-bold shadow-xs">
              <GraduationCap className="h-4 w-4" />
              <span>PROJECT BATCH NO. 34</span>
            </span>
          </div>

        </div>
      </section>

      {/* 3. HERO SECTION (PERFECTLY CENTERED & ALIGNED) */}
      <section id="hero" className="relative pt-10 pb-12 overflow-hidden bg-gradient-to-b from-white to-[#F5F7FA] dark:from-[#15191C] dark:to-[#0B0D0F] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 text-[#1769E0] text-xs font-semibold">
            <Shield className="h-4 w-4" />
            <span>Zero Trust Security Architecture</span>
          </div>

          {/* Aligned Centered Description Paragraph */}
          <p className="text-base sm:text-lg text-[#475569] dark:text-[#9FA6A8] leading-relaxed max-w-3xl mx-auto">
            An intelligent network intrusion detection system developed at JNNCE Shivamogga (Department of Information Science and Engineering, Batch No. 34) combining Zero Trust architecture with LSTM neural networks.
          </p>

          {/* Action Button Centered (Triggers Login Modal) */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={onOpenLogin}
              className="px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#1769E0] hover:bg-[#0F3B68] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Project</span>
              <ArrowRight className="h-4 w-4 fill-white" />
            </button>
          </div>

          {/* Academic Badges Centered */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#475569] dark:text-[#9FA6A8] font-mono border-t border-slate-200 dark:border-[#252A2E]">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-[#1769E0]" />
              <span>JNNCE Shivamogga</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-amber-500" />
              <span>Department of ISE • Batch No. 34</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. DASHBOARD INSIGHT PREVIEW SECTION (EXACT DASHBOARD ON THE LEFT) */}
      <section id="dashboard-insight" className="py-14 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#1769E0] uppercase tracking-wider font-mono">DASHBOARD INSIGHT & PREVIEW</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">
              REAL-TIME SOC DASHBOARD INSIGHT
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#9FA6A8] mt-2">
              An exact preview of the Security Operations Center dashboard matching our system's navy dark theme, top navigation bar, and live telemetry feeds.
            </p>
          </div>

          {/* 2-Column Grid: Dashboard Preview ON THE LEFT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT Column: Exact Dashboard Preview */}
            <div className="lg:col-span-7">
              <IntegratedDashboardPreview onExplore={onOpenLogin} />
            </div>

            {/* RIGHT Column: Dashboard Key Highlights & Insights */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#1769E0] uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  SYSTEM INSIGHT HIGHLIGHTS
                </span>
                <h3 className="text-xl font-bold text-[#172033] dark:text-[#F3F4F1]">
                  Security Console Telemetry & Features
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                
                <div className="p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#172033] dark:text-[#F3F4F1] font-sans text-xs">Top Navigation & Brand Identity</h4>
                    <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8] mt-0.5 font-mono">
                      Features JNNCE logo, full project title, Batch No. 34 badge, and horizontal tab navigation bar.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 shrink-0">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#172033] dark:text-[#F3F4F1] font-sans text-xs">Primary Keras LSTM Neural Network</h4>
                    <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8] mt-0.5 font-mono">
                      Real-time training curves tracking accuracy (97.80%) and loss across 10 epochs.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 shrink-0">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#172033] dark:text-[#F3F4F1] font-sans text-xs">Zero Trust JWT Security Posture</h4>
                    <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8] mt-0.5 font-mono">
                      Signed HMAC-SHA256 authentication with role-based access control (Admin, Analyst, User).
                    </p>
                  </div>
                </div>

              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenLogin}
                  className="w-full py-3 text-xs font-bold text-white bg-[#1769E0] hover:bg-[#0F3B68] rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>Authenticate to Access Live Dashboard</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. WHAT IS NIDS? */}
      <section id="about-nids" className="py-16 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#1769E0] uppercase tracking-wider font-mono">CORE CONCEPT</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">
              WHAT IS NETWORK INTRUSION DETECTION?
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#9FA6A8] mt-2">
              Network Intrusion Detection Systems (NIDS) analyze network traffic data to identify suspicious activities, policy violations, and unauthorized access attempts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-6 hover-card-rise">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] flex items-center justify-center mb-4">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F3F4F1] mb-2">Network Monitoring</h3>
              <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                Analyzes network traffic data to identify relevant traffic patterns.
              </p>
            </div>

            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-6 hover-card-rise">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] flex items-center justify-center mb-4">
                <Sliders className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F3F4F1] mb-2">Traffic Analysis</h3>
              <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                Extracts useful features from network traffic.
              </p>
            </div>

            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-6 hover-card-rise">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F3F4F1] mb-2">Threat Detection</h3>
              <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                Identifies suspicious or malicious traffic patterns.
              </p>
            </div>

            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-6 hover-card-rise">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] flex items-center justify-center mb-4">
                <BarChart2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033] dark:text-[#F3F4F1] mb-2">Traffic Classification</h3>
              <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                Classifies network traffic into predefined categories.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. WHY ZERO TRUST NIDS? (#zero-trust) */}
      <section id="zero-trust" className="py-16 bg-[#F5F7FA] dark:bg-[#0B0D0F] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#1769E0] uppercase tracking-wider font-mono">SECURITY PARADIGM</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">
              WHY ZERO TRUST NIDS?
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#9FA6A8] mt-2">
              Zero Trust eliminates implicit trust by requiring strict identity verification and role restrictions for every interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-6 hover-card-rise">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] flex items-center justify-center mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] mb-1">Never Trust Automatically</h3>
              <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                Every access request must be explicitly verified before access.
              </p>
            </div>

            <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-6 hover-card-rise">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] flex items-center justify-center mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] mb-1">Least Privilege Access</h3>
              <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                Users receive only the minimum permissions required for their role.
              </p>
            </div>

            <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-6 hover-card-rise">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] flex items-center justify-center mb-4">
                <Key className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] mb-1">Signed JWT Authentication</h3>
              <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                Tokens are HMAC-SHA256 signed and verified on every route.
              </p>
            </div>

            <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-6 hover-card-rise">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] flex items-center justify-center mb-4">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] mb-1">Role-Based RBAC</h3>
              <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                Admin, Analyst, and User permissions enforce strict boundary checks.
              </p>
            </div>

            <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-6 hover-card-rise">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-[#1769E0] flex items-center justify-center mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1] mb-1">Comprehensive Audit Trail</h3>
              <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                All logins, uploads, and model training events are logged to SQLite.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. HOW THE SYSTEM WORKS (#how-it-works) */}
      <section id="how-it-works" className="py-16 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#1769E0] uppercase tracking-wider font-mono">WORKFLOW PIPELINE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">
              HOW THE SYSTEM WORKS
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#9FA6A8] mt-2">
              An 8-step end-to-end processing pipeline from dataset ingestion to traffic classification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            
            {[
              { step: '01', title: 'Dataset Upload', desc: 'Ingest CSV intrusion dataset', icon: Database },
              { step: '02', title: 'Data Cleaning', desc: 'Handle nulls & missing values', icon: Sliders },
              { step: '03', title: 'Feature Encoding', desc: 'Encode categorical attributes', icon: Layers },
              { step: '04', title: 'Normalization', desc: 'Apply MinMax scaling', icon: Activity },
              { step: '05', title: 'Train/Test Split', desc: 'Separate 80/20 train/eval', icon: Layers2 },
              { step: '06', title: 'LSTM Training', desc: 'Fit Keras recurrent model', icon: Cpu },
              { step: '07', title: 'Model Evaluation', desc: 'Compute accuracy & recall', icon: BarChart2 },
              { step: '08', title: 'Classification', desc: 'Classify test data samples', icon: CheckCircle2 }
            ].map((s, idx) => {
              const IconComp = s.icon;
              return (
                <div key={s.step} className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-card hover-card-rise flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold font-mono text-[#1769E0] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                        {s.step}
                      </span>
                      <IconComp className="h-4 w-4 text-[#475569] dark:text-[#9FA6A8]" />
                    </div>
                    <h3 className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1] mb-1">{s.title}</h3>
                    <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8] leading-tight">{s.desc}</p>
                  </div>
                  {idx < 7 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#252A2E] flex justify-end text-slate-300 hidden lg:flex">
                      <ArrowRight className="h-3.5 w-3.5 text-[#1769E0]" />
                    </div>
                  )}
                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* 7. PROJECT CAPABILITIES & EXTENSIONS (#project) */}
      <section id="project" className="py-16 bg-[#F5F7FA] dark:bg-[#0B0D0F] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#1769E0] uppercase tracking-wider font-mono">SYSTEM CAPABILITIES</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">
              PROJECT CAPABILITIES
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#9FA6A8] mt-2">
              Features engineered and verified during development at JNNCE Shivamogga.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
            
            {[
              'Zero Trust Security Architecture',
              'Authentication & JWT Validation',
              'Role-Based Access Control (RBAC)',
              'Dataset Upload & Selection',
              'Data Cleaning & Preprocessing',
              'Feature Engineering & MinMax Scaling',
              'Comparative Dataset Matrix',
              'LSTM Neural Network Training',
              'Separate Model Architecture Details',
              'Model Performance Evaluation',
              'SQLite Security Audit Trail Logs'
            ].map((cap) => (
              <div key={cap} className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 flex items-center space-x-3 shadow-xs">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-[#172033] dark:text-[#F3F4F1]">{cap}</span>
              </div>
            ))}

          </div>

          <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-[#252A2E]">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-[#475569] dark:text-[#9FA6A8] uppercase tracking-wider font-mono">
                FUTURE PLANNED EXTENSIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 opacity-75">
              {[
                'Real-Time Packet Capture',
                'Behavioral Network Analytics',
                'Live SOC Monitoring Dashboard',
                'Automated Threat Prevention'
              ].map((fut) => (
                <div key={fut} className="bg-white dark:bg-[#15191C] border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center">
                  <span className="text-[11px] font-mono text-[#475569] dark:text-[#9FA6A8] font-medium">{fut}</span>
                  <div className="text-[9px] text-[#475569] dark:text-[#9FA6A8] mt-0.5">Future Extension</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 8. ACADEMIC SPECIFICATIONS */}
      <section className="py-16 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#1769E0] uppercase tracking-wider font-mono">ACADEMIC CREDENTIALS</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">
              INSTITUTION & BATCH DETAILS
            </h2>
          </div>

          <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 max-w-4xl mx-auto shadow-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-[#252A2E]">
              
              <div className="space-y-4">
                <div>
                  <span className="text-[#475569] dark:text-[#9FA6A8] block text-[10px]">COLLEGE NAME</span>
                  <span className="text-[#172033] dark:text-[#F3F4F1] font-bold text-sm">Jawaharlal Nehru National College of Engineering (JNNCE)</span>
                </div>
                <div>
                  <span className="text-[#475569] dark:text-[#9FA6A8] block text-[10px]">LOCATION</span>
                  <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">Shivamogga (Shimoga), Karnataka, India</span>
                </div>
                <div>
                  <span className="text-[#475569] dark:text-[#9FA6A8] block text-[10px]">DEPARTMENT</span>
                  <span className="text-[#1769E0] font-bold">Department of Information Science and Engineering</span>
                </div>
              </div>

              <div className="space-y-4 sm:pl-6 pt-4 sm:pt-0">
                <div>
                  <span className="text-[#475569] dark:text-[#9FA6A8] block text-[10px]">PROJECT BATCH NUMBER</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">Project Batch No. 34</span>
                </div>
                <div>
                  <span className="text-[#475569] dark:text-[#9FA6A8] block text-[10px]">DEGREE PROGRAM</span>
                  <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">B.E. Final Year Project</span>
                </div>
                <div>
                  <span className="text-[#475569] dark:text-[#9FA6A8] block text-[10px]">UNIVERSITY AFFILIATION</span>
                  <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">Visvesvaraya Technological University (VTU)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-[#15191C] border-t border-[#E2E8F0] dark:border-[#252A2E] py-6 text-center text-xs text-[#475569] dark:text-[#9FA6A8] font-mono transition-colors">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-2">
            <img src="/jnnce_logo.png" alt="JNNCE Logo" className="h-7 w-7 object-contain" />
            <span className="font-bold text-[#172033] dark:text-[#F3F4F1]">Jawaharlal Nehru National College of Engineering, Shivamogga</span>
          </div>
          <div>Department of Information Science and Engineering • Project Batch No. 34</div>
          <div className="text-[10px] text-[#94A3B8]">Zero Trust AI-Powered Network Intrusion Detection System</div>
        </div>
      </footer>

    </div>
  );
};
