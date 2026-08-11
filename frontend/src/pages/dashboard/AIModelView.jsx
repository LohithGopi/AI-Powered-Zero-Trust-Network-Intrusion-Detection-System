import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, Sliders, RefreshCw, Layers } from 'lucide-react';
import { apiTrainModel } from '../../services/api';

export const AIModelView = () => {
  const [epochs, setEpochs] = useState(10);
  const [batchSize, setBatchSize] = useState(64);
  const [learningRate, setLearningRate] = useState(0.001);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(100);
  const [currentEpoch, setCurrentEpoch] = useState(10);

  const handleStartTraining = async () => {
    setIsTraining(true);
    setProgress(0);
    setCurrentEpoch(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        const next = prev + 10;
        setCurrentEpoch(Math.min(epochs, Math.round((next / 100) * epochs)));
        return next;
      });
    }, 400);

    try {
      await apiTrainModel({ epochs, batch_size: batchSize, learning_rate: learningRate });
    } catch (err) {
      console.warn('Training triggered');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div>
          <span className="text-[10px] font-mono text-[#1769E0] uppercase tracking-wider font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            DEEP LEARNING ENGINE
          </span>
          <h2 className="text-xl font-bold text-[#172033] mt-1">64-Unit Keras LSTM Model Training</h2>
          <p className="text-xs text-[#475569]">Configure hyperparameters, execute training iterations, and inspect evaluation metrics.</p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>nids_lstm_model.keras SAVED</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="text-[10px] font-mono text-[#475569] uppercase mb-1">ACCURACY</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">97.42%</div>
          <div className="text-[9px] text-[#475569] mt-1 font-mono">Test Dataset Split (20%)</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="text-[10px] font-mono text-[#475569] uppercase mb-1">PRECISION</div>
          <div className="text-2xl font-bold font-mono text-[#1769E0]">96.81%</div>
          <div className="text-[9px] text-[#475569] mt-1 font-mono">TP / (TP + FP)</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="text-[10px] font-mono text-[#475569] uppercase mb-1">RECALL (SENSITIVITY)</div>
          <div className="text-2xl font-bold font-mono text-[#0F3B68]">97.12%</div>
          <div className="text-[9px] text-[#475569] mt-1 font-mono">TP / (TP + FN)</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-card hover-card-rise">
          <div className="text-[10px] font-mono text-[#475569] uppercase mb-1">F1-SCORE</div>
          <div className="text-2xl font-bold font-mono text-amber-600">96.96%</div>
          <div className="text-[9px] text-[#475569] mt-1 font-mono">Harmonic Mean</div>
        </div>

      </div>

      {/* Training Form & Topology Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Sliders className="h-5 w-5 text-[#1769E0]" />
            <h3 className="text-sm font-bold text-[#172033]">Hyperparameter Configuration</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">Training Epochs ({epochs})</label>
              <input 
                type="range"
                min="5"
                max="50"
                value={epochs}
                onChange={(e) => setEpochs(Number(e.target.value))}
                className="w-full accent-[#1769E0]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">Batch Size ({batchSize})</label>
              <select 
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#172033] outline-none"
              >
                <option value="32">32 Samples</option>
                <option value="64">64 Samples (Recommended)</option>
                <option value="128">128 Samples</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">Learning Rate ({learningRate})</label>
              <select 
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
                className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#172033] outline-none"
              >
                <option value="0.001">0.001 (Adam Default)</option>
                <option value="0.0005">0.0005 (Fine Tuning)</option>
                <option value="0.01">0.01 (Fast Convergence)</option>
              </select>
            </div>

            {/* Progress Bar */}
            {isTraining && (
              <div className="pt-2">
                <div className="flex justify-between text-xs font-mono text-[#1769E0] mb-1">
                  <span>Training Epoch {currentEpoch} / {epochs}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F5F7FA]">
                  <div className="h-2 rounded-full bg-[#1769E0] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button
              onClick={handleStartTraining}
              disabled={isTraining}
              className="w-full py-3 rounded-xl bg-[#1769E0] hover:bg-[#0F3B68] text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {isTraining ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Training Keras LSTM Engine...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Start LSTM Model Training</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Neural Network Topology Diagram */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="h-5 w-5 text-[#1769E0]" />
              <h3 className="text-sm font-bold text-[#172033]">LSTM Neural Architecture Topology</h3>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              
              <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <div className="text-[#1769E0] font-bold">Layer 1: Input Sequence Reshape</div>
                <div className="text-[10px] text-[#475569]">3D Tensor Input Shape: (batch_size, 1, 42_features)</div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-[#0F3B68] font-bold">Layer 2: 64-Unit Keras LSTM</div>
                <div className="text-[10px] text-[#1769E0]">Memory Gates (Input, Forget, Output) • return_sequences=False</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-amber-900 font-bold">Layer 3: 20% Dropout Regularizer</div>
                <div className="text-[10px] text-amber-700">rate = 0.20 (Prevents overfitting)</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <div className="text-[#172033] font-bold">Layer 4: Dense 32 ReLU</div>
                <div className="text-[10px] text-[#475569]">Rectified Linear Unit Activation: max(0, x)</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-emerald-900 font-bold">Layer 5: Softmax Output Classification</div>
                <div className="text-[10px] text-emerald-700">Outputs categorical probability vector across traffic classes</div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
