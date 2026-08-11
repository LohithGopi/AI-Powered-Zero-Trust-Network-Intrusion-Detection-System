import React from 'react';
import { 
  Shield, Lock, Database, Server, Network, User, Activity, BarChart2, 
  FileText, Key, CheckCircle2, ArrowRight, Cpu, Sliders, 
  Layers, Layers2, ShieldCheck, GraduationCap, Award, AlertTriangle
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const LandingPage = ({ onExplore, onOpenLogin }) => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B0D0F] text-[#172033] dark:text-[#F3F4F1] transition-colors">
      
      {/* 1. HEADER NAVBAR */}
      <Navbar onOpenLogin={onOpenLogin} onExplore={onExplore} />

      {/* 2. INSTITUTIONAL & PROJECT TITLE BANNER */}
      <section id="jnnce-info" className="pt-10 pb-8 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          
          {/* Centered JNNCE Logo Image */}
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

          {/* Centered College & Department Title */}
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

          {/* Centered Full Project Title */}
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

          {/* Centered Batch Badge */}
          <div className="flex items-center justify-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#1769E0] dark:text-blue-400 text-xs font-mono font-bold shadow-xs">
              <GraduationCap className="h-4 w-4" />
              <span>PROJECT BATCH NO. 34</span>
            </span>
          </div>

          {/* Action Button Centered */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={onOpenLogin}
              className="px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#1769E0] hover:bg-[#0F3B68] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Lock className="h-4 w-4 text-white" />
              <span>Explore Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. DUAL COLUMN SECTION: PROBLEM (LEFT) vs WHAT IS ZERO TRUST AI-POWERED NIDS (RIGHT) */}
      <section id="problem-and-solution" className="py-14 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* LEFT COLUMN: PROBLEM STATEMENT */}
            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-red-200/80 dark:border-red-950/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-card hover-card-rise">
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-mono font-bold border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span>THE SECURITY PROBLEM</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">INTRUSION VULNERABILITIES</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033] dark:text-[#F3F4F1] tracking-tight">
                  Traditional Network Security & Perimeter Vulnerabilities
                </h2>

                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                  Conventional network architectures rely on perimeter firewalls that assume internal traffic is inherently trustworthy. Once attackers breach the perimeter, they move laterally without obstruction.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] flex items-start space-x-3">
                    <span className="p-1 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1]">Implicit Trust Assumption</h4>
                      <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8]">Legacy networks automatically trust internal IP addresses and nodes once inside the firewall.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] flex items-start space-x-3">
                    <span className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                      <Sliders className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1]">Signature Bypass & Zero-Day Exploits</h4>
                      <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8]">Static rule-based IDS cannot detect encrypted anomalies, stealth probes, or unknown zero-day attacks.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] flex items-start space-x-3">
                    <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                      <Lock className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1]">Lack of Granular Role Control</h4>
                      <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8]">Without strict Role-Based Access Control (RBAC), unauthorized users can execute critical model training or upload unverified datasets.</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#252A2E] text-[11px] font-mono text-red-600 dark:text-red-400 font-semibold flex items-center justify-between">
                <span>Vulnerability Impact: High Risk</span>
                <span>Requires AI + Zero Trust</span>
              </div>
            </div>

            {/* RIGHT COLUMN: WHAT IS ZERO TRUST AI-POWERED NIDS? */}
            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-blue-200/80 dark:border-blue-950/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-card hover-card-rise">
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#1769E0] dark:text-blue-400 text-xs font-mono font-bold border border-blue-200 dark:border-blue-800">
                    <Shield className="h-4 w-4" />
                    <span>THE PROPOSED SOLUTION</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">AI + ZERO TRUST PARADIGM</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033] dark:text-[#F3F4F1] tracking-tight">
                  What is Zero Trust AI-Powered NIDS?
                </h2>

                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
                  A modern intrusion detection platform that enforces <strong>Zero Trust Security ("Never Trust, Always Verify")</strong> alongside a <strong>TensorFlow/Keras LSTM Deep Learning Neural Network</strong> for multi-class traffic anomaly classification.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] flex items-start space-x-3">
                    <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#1769E0] shrink-0 mt-0.5">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1]">Zero Trust Verification ("Never Trust, Always Verify")</h4>
                      <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8]">Every access request and API endpoint requires HMAC-SHA256 JWT tokens and RBAC role boundaries (Admin, Analyst, User).</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] flex items-start space-x-3">
                    <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 shrink-0 mt-0.5">
                      <Cpu className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1]">64-Unit LSTM Recurrent Neural Network</h4>
                      <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8]">Deep learning sequential model that learns temporal packet features to accurately classify normal traffic vs. multi-class attacks.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] flex items-start space-x-3">
                    <span className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600 shrink-0 mt-0.5">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1]">Comprehensive Audit Log Governance</h4>
                      <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8]">All login sessions, dataset modifications, and model training events are logged to SQLite for complete security auditing.</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#252A2E] text-[11px] font-mono text-[#1769E0] font-semibold flex items-center justify-between">
                <span>Phase 1 Implementation</span>
                <span>LSTM Classification Ready</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. MIDDLE SECTION: HOW THE SYSTEM WORKS, PROJECT CAPABILITIES, FUTURE PLANNED EXTENSIONS & INSTITUTION & BATCH DETAILS */}
      <div className="space-y-0">
        
        {/* 4.1 HOW THE SYSTEM WORKS */}
        <section id="how-it-works" className="py-16 bg-[#F5F7FA] dark:bg-[#0B0D0F] border-b border-[#E2E8F0] dark:border-[#252A2E]">
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
                  <div key={s.step} className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 shadow-card hover-card-rise flex flex-col justify-between">
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

        {/* 4.2 PROJECT CAPABILITIES */}
        <section id="project-capabilities" className="py-16 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#1769E0] uppercase tracking-wider font-mono">SYSTEM FEATURES</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">
                PROJECT CAPABILITIES
              </h2>
              <p className="text-sm text-[#475569] dark:text-[#9FA6A8] mt-2">
                Engineered features built and verified in the Phase 1 architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {[
                'Zero Trust Security Architecture',
                'Authentication & Signed JWT Tokens',
                'Role-Based Access Control (RBAC)',
                'Dataset Ingestion & Inventory Selection',
                'Missing Value Handling & Duplicate Removal',
                'Feature Engineering & MinMax Scaling',
                'Comparative Dataset Analysis Matrix',
                '64-Unit Keras LSTM Training Engine',
                'Model Architecture Layer Visualizer',
                'Confusion Matrix & Evaluation Reports',
                'SQLite Audit Log Governance Trail'
              ].map((cap) => (
                <div key={cap} className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-4 flex items-center space-x-3 shadow-xs hover-card-rise">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-[#172033] dark:text-[#F3F4F1]">{cap}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4.3 FUTURE PLANNED EXTENSIONS */}
        <section id="future-extensions" className="py-16 bg-[#F5F7FA] dark:bg-[#0B0D0F] border-b border-[#E2E8F0] dark:border-[#252A2E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">ROADMAP</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">
                FUTURE PLANNED EXTENSIONS
              </h2>
              <p className="text-sm text-[#475569] dark:text-[#9FA6A8] mt-2">
                Planned enhancements for future production phases beyond Phase 1 scope.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { title: 'Real-Time Packet Capture', desc: 'Live Wireshark/Pyshark network socket sniffing' },
                { title: 'Behavioral Network Analytics', desc: 'User entity behavioral analysis & anomaly scoring' },
                { title: 'Live SOC Monitoring Dashboard', desc: 'Real-time incident response & threat map' },
                { title: 'Automated Threat Prevention', desc: 'Active firewall rule pushing & IP isolation' }
              ].map((fut) => (
                <div key={fut.title} className="bg-white dark:bg-[#15191C] border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center shadow-xs">
                  <span className="text-xs font-bold font-mono text-[#172033] dark:text-[#F3F4F1] block mb-1">{fut.title}</span>
                  <p className="text-[11px] text-[#475569] dark:text-[#9FA6A8] leading-tight">{fut.desc}</p>
                  <span className="inline-block mt-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    FUTURE PHASE
                  </span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4.4 INSTITUTION & BATCH DETAILS */}
        <section id="academic-details" className="py-16 bg-white dark:bg-[#15191C] border-b border-[#E2E8F0] dark:border-[#252A2E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#1769E0] uppercase tracking-wider font-mono">ACADEMIC CREDENTIALS</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172033] dark:text-[#F3F4F1] mt-1">
                INSTITUTION & BATCH DETAILS
              </h2>
            </div>

            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-card">
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
                    <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">B.E. Final Year Academic Project</span>
                  </div>
                  <div>
                    <span className="text-[#475569] dark:text-[#9FA6A8] block text-[10px]">UNIVERSITY AFFILIATION</span>
                    <span className="text-[#172033] dark:text-[#F3F4F1] font-bold">Visvesvaraya Technological University (VTU), Belagavi</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </div>

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
