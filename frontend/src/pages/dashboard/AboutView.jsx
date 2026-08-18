import React from 'react';
import { 
  ShieldCheck, Cpu, Layers, GitBranch, Database, FileText, AlertCircle, 
  CheckCircle2, ArrowDown, Server, Network, Lock, Sliders, Activity, GraduationCap
} from 'lucide-react';

export const AboutView = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER BANNER */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1769E0] dark:text-blue-400 text-xs font-mono font-bold border border-blue-200 dark:border-blue-800">
              SYSTEM DOCUMENTATION
            </span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold border border-emerald-200 dark:border-emerald-800">
              PHASE 1 ARCHITECTURE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#172033] dark:text-[#F3F4F1] tracking-tight">
            About System & Technical Architecture
          </h1>
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
            Comprehensive overview of Zero Trust principles, AI/ML LSTM Intrusion Detection Pipeline, and Institution Details.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#1769E0] dark:text-blue-400 text-xs font-mono font-bold">
            <GraduationCap className="h-4 w-4" />
            <span>BATCH 2023–2027 (BATCH 34)</span>
          </span>
        </div>
      </div>

      {/* SECTION 1: PROBLEM & SOLUTION */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-[#252A2E] pb-4">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1769E0] border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172033] dark:text-[#F3F4F1]">
              1. Problem & Solution
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Challenge in perimeter defense vs. AI-driven Zero Trust response
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PROBLEM CARD */}
          <div className="p-5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40 space-y-3">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <AlertCircle className="h-4 w-4" />
              <h3>Problem</h3>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
              Traditional network security approaches may struggle to detect evolving cyber threats and provide sufficient protection for modern network environments.
            </p>
          </div>

          {/* SOLUTION CARD */}
          <div className="p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <h3>Solution</h3>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
              The proposed <strong>AI-Powered Zero Trust Network Intrusion Detection System (NIDS)</strong> combines Zero Trust security principles with an AI-based intrusion detection model.
            </p>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8] leading-relaxed">
              It processes network traffic datasets, performs preprocessing, and uses an LSTM-based model to identify normal and malicious network activity.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-[#252A2E] pb-4">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 border border-indigo-200 dark:border-indigo-800">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172033] dark:text-[#F3F4F1]">
              2. How It Works
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Step-by-step workflow of dataset ingestion, preprocessing, training, and classification
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="flex items-center space-x-2 text-[#1769E0] font-bold text-xs">
              <span className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-xs">1</span>
              <h4>Dataset Collection</h4>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Network intrusion datasets are imported into the system.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="flex items-center space-x-2 text-[#1769E0] font-bold text-xs">
              <span className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-xs">2</span>
              <h4>Data Preprocessing</h4>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Missing values and duplicate records are identified and handled.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="flex items-center space-x-2 text-[#1769E0] font-bold text-xs">
              <span className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-xs">3</span>
              <h4>Feature Processing</h4>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Relevant network traffic features are encoded, normalized, and prepared for model training.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="flex items-center space-x-2 text-[#1769E0] font-bold text-xs">
              <span className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-xs">4</span>
              <h4>Sequential Data Preparation</h4>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Processed features are converted into sequences suitable for the LSTM model where applicable.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="flex items-center space-x-2 text-[#1769E0] font-bold text-xs">
              <span className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-xs">5</span>
              <h4>AI Model Training</h4>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              The LSTM model learns patterns from the prepared network traffic data.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="flex items-center space-x-2 text-[#1769E0] font-bold text-xs">
              <span className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-xs">6</span>
              <h4>Intrusion Detection</h4>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              The trained model is used to classify network traffic based on learned patterns.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: CAPABILITIES */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-[#252A2E] pb-4">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172033] dark:text-[#F3F4F1]">
              3. System Capabilities
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Implemented Phase 1 operational capabilities
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Import and manage NIDS datasets.',
            'Detect and handle missing values and duplicate records.',
            'Preprocess network traffic features automatically.',
            'Prepare sequential data for LSTM-based learning.',
            'Train an AI-based intrusion detection model.',
            'Store datasets, model information, and system records.',
            'Provide role-based access for Analyst and Admin users.',
            'Maintain security through authentication, authorization, and audit logging.'
          ].map((cap, idx) => (
            <li key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] text-xs text-[#172033] dark:text-[#F3F4F1]">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{cap}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION 4: FUTURE EXTENSIONS */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-[#252A2E] pb-4">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-800">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172033] dark:text-[#F3F4F1]">
              4. Future Extensions
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Planned Phase 2 enhancements (Not currently implemented in Phase 1)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Real-time network packet inspection.',
            'Live network traffic monitoring.',
            'Advanced behavioral analytics.',
            'Real-time intrusion alerts and notifications.',
            'Additional AI/ML intrusion detection models.',
            'Advanced security analytics and visualization.',
            'Integration with larger-scale network security infrastructure.'
          ].map((ext, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-amber-50/30 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/30 text-xs text-[#475569] dark:text-[#9FA6A8]">
              <span className="p-1 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-mono font-bold text-[10px] shrink-0">
                P2
              </span>
              <span>{ext}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: TECHNICAL OVERVIEW & ZERO TRUST ARCHITECTURE */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-[#252A2E] pb-4">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 border border-purple-200 dark:border-purple-800">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172033] dark:text-[#F3F4F1]">
              5. Actual Implemented Architecture
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Zero Trust Security & AI-Based NIDS Pipeline
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ZERO TRUST CONTROLS */}
          <div className="p-5 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-3">
            <h3 className="text-xs font-bold text-[#1769E0] uppercase tracking-wider">Zero Trust Security Controls</h3>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-[#9FA6A8]">
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1769E0]"></span>
                <span><strong>Never trust by default:</strong> Stateless JWT verification on all endpoints.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1769E0]"></span>
                <span><strong>Verify access requests:</strong> Cryptographic token signature check.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1769E0]"></span>
                <span><strong>Authentication & Authorization:</strong> Bcrypt password hashing + RBAC.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1769E0]"></span>
                <span><strong>Role-Based Access Control:</strong> Strict Admin vs Analyst permissions.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1769E0]"></span>
                <span><strong>Least-privilege access:</strong> Restricted API routes by role claims.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1769E0]"></span>
                <span><strong>Audit Logging:</strong> Immutable database logging for security events.</span>
              </li>
            </ul>
          </div>

          {/* AI NIDS PIPELINE */}
          <div className="p-5 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-3">
            <h3 className="text-xs font-bold text-[#1769E0] uppercase tracking-wider">AI-Based NIDS Features</h3>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-[#9FA6A8]">
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span><strong>Dataset Ingestion:</strong> CSV validation & schema matching.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span><strong>Cleaning:</strong> Duplicate removal & missing value median/mode imputation.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span><strong>Preprocessing:</strong> LabelEncoder & StandardScaler normalization.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span><strong>Sequential Reshaping:</strong> 3D tensor sequence format (N, 1, F).</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span><strong>LSTM Engine:</strong> 64-unit Keras model with Dropout regularization.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span><strong>Evaluation:</strong> Held-out test set performance reporting.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* VISUAL DATASET PIPELINE FLOWCHART */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#252A2E]">
          <h3 className="text-xs font-bold text-[#172033] dark:text-[#F3F4F1] uppercase tracking-wider mb-4 text-center">
            Dataset Processing & Model Pipeline Flowchart
          </h3>
          <div className="bg-[#081A35] text-slate-200 p-6 rounded-xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
              <span className="px-3 py-1.5 bg-blue-900/60 border border-blue-700 rounded text-blue-300">Raw Dataset</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Validation</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Missing Value Handling</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Duplicate Removal</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Data Cleaning</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-indigo-900/60 border border-indigo-700 rounded text-indigo-300">Feature Encoding</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-indigo-900/60 border border-indigo-700 rounded text-indigo-300">Feature Scaling</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Train/Test Split</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-purple-900/60 border border-purple-700 rounded text-purple-300">Sequence Prep (3D)</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-emerald-900/60 border border-emerald-700 rounded text-emerald-300 font-bold">LSTM Training</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-amber-900/60 border border-amber-700 rounded text-amber-300">Evaluation</span>
              <span className="text-slate-500">➔</span>
              <span className="px-3 py-1.5 bg-emerald-950 border border-emerald-600 rounded text-emerald-400 font-bold">Saved Model</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: INSTITUTION DETAILS */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-[#252A2E] pb-4">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1769E0] border border-blue-200 dark:border-blue-800">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172033] dark:text-[#F3F4F1]">
              6. Institution Details
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#9FA6A8]">
              Academic project metadata & department specifications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="text-[#475569] dark:text-[#9FA6A8] font-medium">Institution</div>
            <div className="font-bold text-[#172033] dark:text-[#F3F4F1]">JNN College of Engineering (JNNCE), Shivamogga</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="text-[#475569] dark:text-[#9FA6A8] font-medium">Department</div>
            <div className="font-bold text-[#172033] dark:text-[#F3F4F1]">Information Science and Engineering</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="text-[#475569] dark:text-[#9FA6A8] font-medium">Project Title</div>
            <div className="font-bold text-[#1769E0]">AI-Powered Zero Trust Network Intrusion Detection System</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-2">
            <div className="text-[#475569] dark:text-[#9FA6A8] font-medium">Academic Batch</div>
            <div className="font-bold text-[#172033] dark:text-[#F3F4F1]">2023–2027 (Batch No. 34)</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 space-y-2 text-xs">
          <div className="font-bold text-[#1769E0] uppercase tracking-wider">Project Phase</div>
          <div className="font-semibold text-[#172033] dark:text-[#F3F4F1]">
            Phase 1 – Dataset Preparation, Zero Trust Architecture, and AI-Based Intrusion Detection Model
          </div>
          <blockquote className="italic text-[#475569] dark:text-[#9FA6A8] border-l-2 border-[#1769E0] pl-3 mt-2">
            "The system is developed as an academic project to demonstrate the application of Artificial Intelligence and Zero Trust security principles in network intrusion detection."
          </blockquote>
        </div>
      </section>

    </div>
  );
};
