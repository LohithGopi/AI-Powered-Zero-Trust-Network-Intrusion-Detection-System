import React, { useState } from 'react';
import { ArrowRight, Shield, Cpu, Lock, CheckCircle2, Sliders, Database, AlertOctagon } from 'lucide-react';

export const SecurityPipelineVisual = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: 'Network Traffic', desc: 'Ingests network flow stream & CSV benchmark dataset samples (NSL-KDD / UNSW-NB15).', icon: Database, detail: 'Raw flow packet statistics containing durations, byte counts, and connection state flags.' },
    { title: 'Packet Capture', desc: 'Aggregates packet headers and flow socket timestamps.', icon: Sliders, detail: 'Parses TCP/UDP/ICMP headers and records connection frequency rates per window.' },
    { title: 'Feature Extraction', desc: 'Extracts 42+ numerical and categorical flow attributes.', icon: Cpu, detail: 'Extracts duration, src_bytes, dst_bytes, count, srv_count, and TCP state flags.' },
    { title: 'Preprocessing', desc: 'Executes median NaN imputation, LabelEncoder, and StandardScaler.', icon: Sliders, detail: 'Normalizes numerical features (z = (x - mu) / sigma) and reshapes 2D matrices into 3D tensors.' },
    { title: 'LSTM Neural Model', desc: 'Processes 3D tensors through a 64-unit Keras LSTM layer with 20% Dropout.', icon: Cpu, detail: 'Extracts temporal sequence patterns across flow steps using internal memory gates.' },
    { title: 'Prediction & Conf', desc: 'Computes Softmax categorical probability distribution vector.', icon: CheckCircle2, detail: 'Outputs prediction probability matrix and confidence score (e.g. 98.4%).' },
    { title: 'Threat Classification', desc: 'Classifies traffic into Normal, DoS, Exploits, Fuzzers, or Reconnaissance.', icon: AlertOctagon, detail: 'Categorizes attack type and assigns severity level (Normal, Low, Medium, High, Critical).' },
    { title: 'Security Response', desc: 'Enforces Zero Trust verification policies and records immutable audit log.', icon: Shield, detail: 'Writes audit event record to SQLite and triggers SOC dashboard telemetry updates.' }
  ];

  return (
    <div className="w-full bg-[#111417] border border-[#252A2E] rounded-xl p-6 my-8">
      
      {/* Title */}
      <div className="mb-6">
        <span className="text-[10px] font-mono text-sky-400 tracking-wider uppercase font-semibold">AI SECURITY ENGINE PIPELINE</span>
        <h3 className="text-base font-bold text-[#F3F4F1]">Intelligence Behind Every Detection</h3>
        <p className="text-xs text-[#9FA6A8]">Step-by-step processing pipeline from raw traffic flows to Zero Trust decision enforcement.</p>
      </div>

      {/* Horizontal Steps Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-sky-500/10 border-sky-500/40 shadow-lg shadow-sky-500/10'
                  : 'bg-[#15191C] border-[#252A2E] hover:border-sky-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0B0D0F] text-sky-400 font-bold border border-[#252A2E]">
                  0{idx + 1}
                </span>
                <Icon className={`h-4 w-4 ${isActive ? 'text-sky-400' : 'text-[#9FA6A8]'}`} />
              </div>
              <h4 className="text-xs font-semibold text-[#F3F4F1] truncate">{step.title}</h4>
              <p className="text-[10px] text-[#9FA6A8] line-clamp-2 mt-1">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Step Detail Card */}
      <div className="bg-[#0B0D0F] border border-[#252A2E] rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#F3F4F1]">
              Pipeline Phase 0{activeStep + 1}: {steps[activeStep].title}
            </div>
            <div className="text-xs text-[#9FA6A8] mt-0.5">{steps[activeStep].detail}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>VERIFIED PIPELINE STEP</span>
        </div>
      </div>

    </div>
  );
};
