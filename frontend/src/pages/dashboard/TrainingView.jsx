import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Activity, Play, RefreshCw, Lock, CheckCircle2, AlertCircle, Database, Info, Layers, RefreshCw as LoopIcon } from 'lucide-react';
import { apiTrainModel, apiGetModelStatus, apiGetModelReport, apiSampleDataset } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const TrainingView = ({ onNavigate }) => {
  const { user, role, modelStatus, setModelStatus, modelMetrics, setTrainedModel, datasets = [], activeDataset, selectDataset } = useAuth();
  const currentRole = role || user?.role || 'Admin';
  const isAdmin = currentRole === 'Admin';
  const canTrain = isAdmin;

  const safeDatasets = Array.isArray(datasets) ? datasets : [];

  // Selected Dataset State
  const [selectedDatasetId, setSelectedDatasetId] = useState(activeDataset?.id || (safeDatasets[0]?.id || 1));
  const currentDs = safeDatasets.find(d => d.id === selectedDatasetId) || activeDataset || safeDatasets[0] || {
    id: 1, filename: 'cicids2017_raw.csv', dataset_type: 'CIC-IDS2017', total_rows: 2830743, col_count: 79
  };

  const dsType = currentDs.dataset_type || currentDs.type || 'CIC-IDS2017';
  
  // Dataset specifications
  const totalAvailableRows = dsType.includes('CIC') ? 2830743 : dsType.includes('UNSW') ? 2540044 : 148517;

  // Training parameters
  const [trainingRows, setTrainingRows] = useState(dsType.includes('NSL') ? 148517 : 25000);
  const [epochs, setEpochs] = useState(10);
  const [batchSize, setBatchSize] = useState(32);
  const [learningRate, setLearningRate] = useState('0.001');
  const [randomSeed, setRandomSeed] = useState(42);
  const [sequenceLength, setSequenceLength] = useState(1);
  const [optimizer] = useState('Adam');
  const [lossFunction] = useState('Sparse Categorical Crossentropy');

  // Pre-training confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [samplingPreview, setSamplingPreview] = useState(null);
  const [isSamplingLoading, setIsSamplingLoading] = useState(false);

  const [runId, setRunId] = useState(null);
  const [progress, setProgress] = useState(modelStatus === 'Trained' ? 100 : 0);
  const [currentEpoch, setCurrentEpoch] = useState(modelStatus === 'Trained' ? epochs : 0);
  const [trainAcc, setTrainAcc] = useState(modelStatus === 'Trained' ? modelMetrics.accuracy : '0.00%');
  const [trainLoss, setTrainLoss] = useState(modelStatus === 'Trained' ? modelMetrics.loss : '0.0000');
  const [remainingTime, setRemainingTime] = useState('0s');
  const [errorMessage, setErrorMessage] = useState('');

  const [epochHistory, setEpochHistory] = useState([]);
  const [hoveredEpoch, setHoveredEpoch] = useState(null);

  const pollIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Update default training rows when dataset changes
  const handleDatasetChange = (newId) => {
    const targetId = Number(newId);
    setSelectedDatasetId(targetId);
    selectDataset(targetId);

    const dsObj = safeDatasets.find(d => d.id === targetId);
    const type = dsObj?.dataset_type || dsObj?.type || 'CIC-IDS2017';

    if (type.includes('NSL')) {
      setTrainingRows(148517);
    } else {
      setTrainingRows(25000);
    }
  };

  // Step 1: Open Sampling Confirmation Modal
  const handleOpenConfirmationModal = async (e) => {
    e.preventDefault();

    if (!canTrain) {
      alert('Role Restriction: Only Admin can initiate neural network model training.');
      return;
    }

    setErrorMessage('');
    setIsSamplingLoading(true);
    setShowConfirmModal(true);

    try {
      const preview = await apiSampleDataset(currentDs.id || selectedDatasetId, {
        training_rows: Number(trainingRows),
        random_seed: Number(randomSeed)
      });
      setSamplingPreview(preview);
    } catch (err) {
      console.warn('Sampling preview fallback notice:', err);
      // Fallback preview
      setSamplingPreview({
        dataset_name: currentDs.filename || currentDs.name || 'Dataset',
        dataset_type: dsType,
        total_available_rows: totalAvailableRows,
        requested_rows: Number(trainingRows),
        actual_sampled_rows: Number(trainingRows),
        sampling_method: 'Stratified Class-Aware',
        random_seed: Number(randomSeed),
        features_count: currentDs.col_count ? currentDs.col_count - 1 : 42,
        num_classes: dsType.includes('CIC') ? 15 : dsType.includes('UNSW') ? 10 : 5,
        class_distribution_after: { "Normal": Math.round(trainingRows * 0.6), "Attack": Math.round(trainingRows * 0.4) }
      });
    } finally {
      setIsSamplingLoading(false);
    }
  };

  // Step 2: Confirm & Launch Training
  const handleConfirmAndLaunch = async () => {
    setShowConfirmModal(false);

    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    setModelStatus('Preprocessing');
    setProgress(5);
    setCurrentEpoch(0);
    setTrainAcc('0.00%');
    setTrainLoss('0.0000');
    setEpochHistory([]);
    setRemainingTime('Initializing TensorFlow model...');

    try {
      const response = await apiTrainModel({
        dataset_id: currentDs.id || selectedDatasetId,
        training_rows: Number(trainingRows),
        epochs: Number(epochs),
        batch_size: Number(batchSize),
        learning_rate: parseFloat(learningRate),
        random_seed: Number(randomSeed),
        sequence_length: Number(sequenceLength)
      });

      if (response && response.run_id) {
        setRunId(response.run_id);
      }
      setModelStatus('Training');
    } catch (err) {
      console.error('Training initialization error:', err);
      setErrorMessage(err?.message || 'Failed to start model training backend.');
      setModelStatus('Untrained');
      return;
    }

    // Start Polling Backend Status
    pollIntervalRef.current = setInterval(async () => {
      try {
        const statusData = await apiGetModelStatus();
        
        if (statusData) {
          if (statusData.run_id) setRunId(statusData.run_id);

          const ep = statusData.current_epoch || 0;
          const totalEp = statusData.total_epochs || epochs;
          const p = Math.min(100, Math.round((ep / totalEp) * 100));

          const rawAcc = statusData.accuracy || 0;
          const rawLoss = statusData.loss || 0;

          const accNum = rawAcc > 1 ? rawAcc : rawAcc * 100;
          const accStr = `${accNum.toFixed(2)}%`;
          const lossStr = rawLoss.toFixed(4);

          setCurrentEpoch(ep);
          setProgress(p);
          if (rawAcc > 0) setTrainAcc(accStr);
          if (rawLoss > 0) setTrainLoss(lossStr);
          if (statusData.estimated_time_remaining) setRemainingTime(statusData.estimated_time_remaining);

          if (Array.isArray(statusData.epoch_history) && statusData.epoch_history.length > 0) {
            const parsedHistory = statusData.epoch_history.map(item => ({
              epoch: item.epoch,
              trainAcc: item.accuracy > 1 ? item.accuracy : item.accuracy * 100,
              trainLoss: item.loss
            }));
            setEpochHistory(parsedHistory);
          }

          if (statusData.status === 'Completed' || (ep >= totalEp && ep > 0)) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;

            let reportAcc = accStr;
            let reportLoss = lossStr;

            try {
              const report = await apiGetModelReport();
              if (report && typeof report.accuracy === 'number') {
                reportAcc = `${(report.accuracy * 100).toFixed(2)}%`;
                reportLoss = report.loss ? report.loss.toFixed(4) : lossStr;
              }
            } catch (re) {
              console.warn('Report fetch notice:', re);
            }

            setTrainedModel({
              runId: statusData.run_id || runId,
              accuracy: reportAcc,
              loss: reportLoss,
              epochs: totalEp,
              trainedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            setProgress(100);
            setCurrentEpoch(totalEp);
            setTrainAcc(reportAcc);
            setTrainLoss(reportLoss);
            setRemainingTime('0s');
          } else if (statusData.status === 'Failed') {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
            setModelStatus('Untrained');
            setErrorMessage(statusData.message || 'Training failed on backend engine.');
          }
        }
      } catch (pollErr) {
        console.warn('Backend polling notice:', pollErr);
      }
    }, 500);
  };

  // Dynamic Graph SVG Math
  const totalEpochCount = Math.max(1, epochs);
  const getX = (ep) => {
    if (totalEpochCount <= 1) return 277;
    return 55 + ((ep - 1) / (totalEpochCount - 1)) * 445;
  };

  const allAccValues = epochHistory.map(h => h.trainAcc).filter(v => typeof v === 'number' && !isNaN(v));
  const minAccRaw = allAccValues.length > 0 ? Math.min(...allAccValues) : 0;
  const maxAccRaw = allAccValues.length > 0 ? Math.max(...allAccValues) : 100;
  const minAcc = Math.max(0, Math.floor(minAccRaw - 5));
  const maxAcc = Math.min(100, Math.ceil(maxAccRaw + 5));

  const allLossValues = epochHistory.map(h => h.trainLoss).filter(v => typeof v === 'number' && !isNaN(v));
  const minLossRaw = allLossValues.length > 0 ? Math.min(...allLossValues) : 0;
  const maxLossRaw = allLossValues.length > 0 ? Math.max(...allLossValues) : 1.0;
  const minLoss = Math.max(0, parseFloat((minLossRaw - 0.05).toFixed(2)));
  const maxLoss = Math.min(2.5, parseFloat((maxLossRaw + 0.05).toFixed(2)));

  const getYAcc = (val) => {
    const range = maxAcc - minAcc;
    if (range <= 0) return 105;
    const clamped = Math.min(maxAcc, Math.max(minAcc, val));
    return 190 - ((clamped - minAcc) / range) * 165;
  };

  const getYLoss = (val) => {
    const range = maxLoss - minLoss;
    if (range <= 0) return 105;
    const clamped = Math.min(maxLoss, Math.max(minLoss, val));
    return 190 - ((clamped - minLoss) / range) * 165;
  };

  const trainAccPoints = epochHistory.map(h => `${getX(h.epoch)},${getYAcc(h.trainAcc)}`).join(' ');
  const trainLossPoints = epochHistory.map(h => `${getX(h.epoch)},${getYLoss(h.trainLoss)}`).join(' ');

  return (
    <div className="space-y-6">
      
      {/* Role Restriction Banner if Analyst */}
      {!canTrain && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between font-mono">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>ROLE RESTRICTION:</strong> You are logged in as <strong>[{currentRole.toUpperCase()}]</strong>. Training Keras LSTM models requires Admin permissions.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-[#172033] dark:text-[#F3F4F1]">Model Training Console</h1>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              modelStatus === 'Trained'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            }`}>
              {modelStatus === 'Trained' ? '✓ Model Trained' : '⚠ Untrained Session'}
            </span>
          </div>
          <p className="text-xs text-[#475569] dark:text-[#9FA6A8] mt-1">
            Configure real NIDS dataset, controlled training row size, random seed, launch training, and monitor live curves.
          </p>
        </div>

        <button
          onClick={() => onNavigate('about')}
          className="flex items-center space-x-2 text-xs font-semibold text-[#172033] dark:text-[#F3F4F1] bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] hover:bg-slate-50 dark:hover:bg-[#1E2328] px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Info className="h-4 w-4 text-[#1769E0]" />
          <span>About Architecture</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs flex items-center space-x-2 font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Model Hyperparameters & Real Dataset Selection */}
        <div className="lg:col-span-5 bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-[#252A2E] pb-3">
            <Sliders className="h-4 w-4 text-[#1769E0]" />
            <h2 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1]">Training Configuration</h2>
          </div>

          <form onSubmit={handleOpenConfirmationModal} className="space-y-4 text-xs font-sans">
            
            {/* 1. Target Dataset Dropdown */}
            <div>
              <label className="block text-[#475569] dark:text-[#9FA6A8] font-bold mb-1">Target NIDS Dataset:</label>
              <select
                disabled={!canTrain || modelStatus === 'Training' || modelStatus === 'Preprocessing'}
                value={selectedDatasetId}
                onChange={(e) => handleDatasetChange(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-2.5 text-[#172033] dark:text-[#F3F4F1] outline-none font-mono focus:border-[#1769E0]"
              >
                {safeDatasets.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.dataset_type || d.type || 'NIDS'} — {d.filename || d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Available Rows vs Selected Training Rows Card */}
            <div className="p-3.5 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] space-y-1 font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#475569] dark:text-[#9FA6A8]">Total Available Rows:</span>
                <span className="font-bold text-[#172033] dark:text-[#F3F4F1]">{totalAvailableRows.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#475569] dark:text-[#9FA6A8]">Training Rows Selected:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{Number(trainingRows).toLocaleString()}</span>
              </div>
            </div>

            {/* 2. Configurable Training Rows Selection */}
            <div>
              <label className="block text-[#475569] dark:text-[#9FA6A8] font-bold mb-1">
                Training Rows Count:
              </label>
              {dsType.includes('NSL') ? (
                <select
                  disabled={!canTrain || modelStatus === 'Training' || modelStatus === 'Preprocessing'}
                  value={trainingRows}
                  onChange={(e) => setTrainingRows(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-2.5 text-[#172033] dark:text-[#F3F4F1] outline-none font-mono"
                >
                  <option value="148517">Full Dataset (148,517 Rows - Recommended)</option>
                  <option value="50000">50,000 Rows Subset</option>
                  <option value="25000">25,000 Rows Subset</option>
                  <option value="10000">10,000 Rows Subset</option>
                </select>
              ) : (
                <select
                  disabled={!canTrain || modelStatus === 'Training' || modelStatus === 'Preprocessing'}
                  value={trainingRows}
                  onChange={(e) => setTrainingRows(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-2.5 text-[#172033] dark:text-[#F3F4F1] outline-none font-mono"
                >
                  <option value="25000">25,000 Real Rows (Default)</option>
                  <option value="35000">35,000 Real Rows</option>
                  <option value="50000">50,000 Real Rows (Maximum)</option>
                </select>
              )}
            </div>

            {/* 3. Random Seed & Epochs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#475569] dark:text-[#9FA6A8] font-medium mb-1">Random Seed</label>
                <input
                  type="number"
                  disabled={!canTrain || modelStatus === 'Training' || modelStatus === 'Preprocessing'}
                  value={randomSeed}
                  onChange={(e) => setRandomSeed(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-2.5 text-[#172033] dark:text-[#F3F4F1] font-mono"
                />
              </div>
              <div>
                <label className="block text-[#475569] dark:text-[#9FA6A8] font-medium mb-1">Epochs (5, 10, 20, 50)</label>
                <select
                  disabled={!canTrain || modelStatus === 'Training' || modelStatus === 'Preprocessing'}
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-2.5 text-[#172033] dark:text-[#F3F4F1] outline-none font-mono"
                >
                  <option value="5">5 Epochs</option>
                  <option value="10">10 Epochs (Standard)</option>
                  <option value="20">20 Epochs</option>
                  <option value="50">50 Epochs</option>
                </select>
              </div>
            </div>

            {/* Batch Size & Learning Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#475569] dark:text-[#9FA6A8] font-medium mb-1">Batch Size</label>
                <select
                  value={batchSize}
                  disabled={!canTrain || modelStatus === 'Training' || modelStatus === 'Preprocessing'}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-2.5 text-[#172033] dark:text-[#F3F4F1] outline-none font-mono"
                >
                  <option value="16">16 Samples</option>
                  <option value="32">32 Samples (Default)</option>
                  <option value="64">64 Samples</option>
                </select>
              </div>
              <div>
                <label className="block text-[#475569] dark:text-[#9FA6A8] font-medium mb-1">Learning Rate</label>
                <input
                  type="text"
                  disabled
                  value={learningRate}
                  className="w-full bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-2.5 text-[#172033] dark:text-[#F3F4F1] font-mono"
                />
              </div>
            </div>

            {canTrain ? (
              <button
                type="submit"
                disabled={modelStatus === 'Training' || modelStatus === 'Preprocessing'}
                className={`w-full py-3 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
                  modelStatus === 'Trained'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-[#1769E0] hover:bg-[#0F3B68] text-white'
                }`}
              >
                {modelStatus === 'Training' || modelStatus === 'Preprocessing' ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Training Epochs ({currentEpoch} / {epochs})...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    <span>Configure & Review Sampling</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-[#0B0D0F] border border-slate-200 dark:border-[#252A2E] text-slate-400 font-semibold text-xs flex items-center justify-center space-x-2 cursor-not-allowed"
              >
                <Lock className="h-4 w-4 text-slate-400" />
                <span>Training Disabled (Requires Admin Role)</span>
              </button>
            )}

          </form>
        </div>

        {/* Right Column: Real-Time Progress & Calibrated X/Y Axis Graph */}
        <div className="lg:col-span-7 bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl p-6 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#252A2E] pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-[#1769E0]" />
              <h2 className="text-sm font-bold text-[#172033] dark:text-[#F3F4F1]">Live Training Progress ({dsType})</h2>
            </div>

            {runId && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#1769E0] border border-blue-200 dark:border-blue-800">
                Run ID: {runId}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-[#E2E8F0] dark:bg-[#252A2E] rounded-full overflow-hidden">
            <div className="h-full bg-[#1769E0] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          {/* 3 Telemetry Statistic Boxes */}
          <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-3">
              <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] block font-sans mb-1 uppercase font-bold">Current Epoch</span>
              <span className="text-[#172033] dark:text-[#F3F4F1] font-bold text-base">{currentEpoch} / {epochs}</span>
            </div>

            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-3">
              <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] block font-sans mb-1 uppercase font-bold text-amber-600 dark:text-amber-400">Training Loss (t_loss)</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold text-base">{trainLoss}</span>
            </div>

            <div className="bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E] rounded-xl p-3">
              <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] block font-sans mb-1 uppercase font-bold text-[#1769E0]">Training Accuracy (t_acc)</span>
              <span className="text-[#1769E0] font-bold text-base">{trainAcc}</span>
            </div>
          </div>

          {/* Calibrated SVG Plotting Canvas with X & Y Axes */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#172033] dark:text-[#F3F4F1]">Calibrated Training Graph</span>
              
              {/* Legend */}
              <div className="flex items-center space-x-5 text-xs font-mono font-bold">
                <span className="flex items-center space-x-1.5 text-[#1769E0]">
                  <span className="h-3 w-3 rounded-full bg-[#1769E0]"></span>
                  <span>Training Accuracy (t_acc)</span>
                </span>
                <span className="flex items-center space-x-1.5 text-amber-500">
                  <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                  <span>Training Loss (t_loss)</span>
                </span>
              </div>
            </div>

            <div className="bg-[#081A35] rounded-2xl p-5 border border-slate-800 relative shadow-inner">
              {epochHistory.length === 0 ? (
                <div className="h-60 flex flex-col items-center justify-center text-xs font-mono text-slate-400 space-y-2">
                  <Activity className="h-8 w-8 text-blue-500/40 animate-pulse" />
                  <span>Click 'Configure & Review Sampling' to prepare model training...</span>
                </div>
              ) : (
                <svg viewBox="0 0 540 250" className="w-full h-60 overflow-visible">
                  
                  {/* Grid Lines */}
                  {[25, 66, 107, 148, 190].map((y, idx) => (
                    <line key={idx} x1="55" y1={y} x2="500" y2={y} stroke="#1E293B" strokeDasharray="3 3" />
                  ))}

                  {/* ── Y-AXIS (LEFT VERTICAL METRIC SCALE) ── */}
                  <line x1="55" y1="25" x2="55" y2="190" stroke="#475569" strokeWidth="2" />
                  <text x="55" y="14" fill="#94A3B8" fontSize="9" fontWeight="bold" textAnchor="start">
                    Y: Metric Scale
                  </text>

                  {/* Y-Axis Ticks & Labels */}
                  <g fill="#64748B" fontSize="9" textAnchor="end" fontFamily="monospace">
                    <line x1="49" y1="25" x2="55" y2="25" stroke="#475569" strokeWidth="1.5" />
                    <text x="45" y="28" fill="#38BDF8" fontWeight="bold">100%</text>

                    <line x1="49" y1="66" x2="55" y2="66" stroke="#475569" strokeWidth="1.5" />
                    <text x="45" y="69">75%</text>

                    <line x1="49" y1="107" x2="55" y2="107" stroke="#475569" strokeWidth="1.5" />
                    <text x="45" y="110">50%</text>

                    <line x1="49" y1="148" x2="55" y2="148" stroke="#475569" strokeWidth="1.5" />
                    <text x="45" y="151">25%</text>

                    <line x1="49" y1="190" x2="55" y2="190" stroke="#475569" strokeWidth="1.5" />
                    <text x="45" y="193" fill="#94A3B8">0%</text>
                  </g>

                  {/* ── X-AXIS (BOTTOM HORIZONTAL EPOCHS SCALE) ── */}
                  <line x1="55" y1="190" x2="500" y2="190" stroke="#475569" strokeWidth="2" />
                  <text x="277" y="240" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    X-Axis: Training Epochs →
                  </text>

                  {/* X-Axis Ticks & Epoch Labels */}
                  {Array.from({ length: totalEpochCount }, (_, i) => i + 1).map((ep) => {
                    const cx = getX(ep);
                    return (
                      <g key={ep}>
                        <line x1={cx} y1="190" x2={cx} y2="196" stroke="#475569" strokeWidth="1.5" />
                        <text x={cx} y="210" fill="#94A3B8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          E{ep}
                        </text>
                      </g>
                    );
                  })}

                  {/* 1. Training Accuracy Curve */}
                  {trainAccPoints && (
                    <polyline 
                      fill="none" 
                      stroke="#1769E0" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={trainAccPoints} 
                    />
                  )}

                  {/* 2. Training Loss Curve */}
                  {trainLossPoints && (
                    <polyline 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={trainLossPoints} 
                    />
                  )}

                  {/* Interactive Data Point Circles */}
                  {epochHistory.map((h) => {
                    const cx = getX(h.epoch);
                    const cyAcc = getYAcc(h.trainAcc);
                    const cyLoss = getYLoss(h.trainLoss);

                    return (
                      <g 
                        key={h.epoch} 
                        className="cursor-pointer" 
                        onMouseEnter={() => setHoveredEpoch(h)}
                        onMouseLeave={() => setHoveredEpoch(null)}
                      >
                        <circle cx={cx} cy={cyAcc} r="5" fill="#1769E0" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx={cx} cy={cyLoss} r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
                      </g>
                    );
                  })}

                  {/* Hover Tooltip Overlay Card */}
                  {hoveredEpoch && (
                    <g transform={`translate(${Math.min(380, Math.max(60, getX(hoveredEpoch.epoch) - 60))}, 35)`}>
                      <rect width="130" height="48" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                      <text x="65" y="16" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        Epoch {hoveredEpoch.epoch}
                      </text>
                      <text x="12" y="32" fill="#60A5FA" fontSize="9" fontFamily="monospace">
                        t_acc: {hoveredEpoch.trainAcc.toFixed(2)}%
                      </text>
                      <text x="12" y="43" fill="#FBBF24" fontSize="9" fontFamily="monospace">
                        t_loss: {hoveredEpoch.trainLoss.toFixed(4)}
                      </text>
                    </g>
                  )}

                </svg>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Sampling Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#15191C] border border-[#E2E8F0] dark:border-[#252A2E] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 font-sans">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#252A2E] pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-[#1769E0]" />
                <h3 className="font-bold text-sm text-[#172033] dark:text-[#F3F4F1]">Pre-Training Stratified Sampling Confirmation</h3>
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            {isSamplingLoading ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3 text-xs font-mono text-slate-500">
                <RefreshCw className="h-6 w-6 animate-spin text-[#1769E0]" />
                <span>Computing stratified sampling distribution...</span>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E]">
                    <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] block">Dataset Name:</span>
                    <span className="font-bold text-[#172033] dark:text-[#F3F4F1] text-xs truncate block">{currentDs.filename || currentDs.name}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E]">
                    <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] block">Dataset Standard:</span>
                    <span className="font-bold text-[#1769E0] text-xs block">{dsType}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E]">
                    <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] block">Total Available Rows:</span>
                    <span className="font-bold text-[#172033] dark:text-[#F3F4F1] text-xs block">{totalAvailableRows.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#0B0D0F] border border-[#E2E8F0] dark:border-[#252A2E]">
                    <span className="text-[10px] text-[#475569] dark:text-[#9FA6A8] block">Selected Training Rows:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs block">{Number(trainingRows).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 font-mono text-[11px] space-y-1">
                  <div><strong>Sampling Method:</strong> {samplingPreview?.sampling_method || 'Stratified Class-Aware'}</div>
                  <div><strong>Random Seed:</strong> {randomSeed}</div>
                  <div><strong>Features:</strong> {samplingPreview?.features_count || 42} | <strong>Classes:</strong> {samplingPreview?.num_classes || 5}</div>
                </div>

                {/* Class Distribution Preview */}
                {samplingPreview?.class_distribution_after && (
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <span className="font-bold text-[#172033] dark:text-[#F3F4F1] block">Sampled Class Distribution Breakdown:</span>
                    <div className="max-h-28 overflow-y-auto space-y-1 pr-1 bg-[#F5F7FA] dark:bg-[#0B0D0F] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#252A2E]">
                      {Object.entries(samplingPreview.class_distribution_after).slice(0, 6).map(([cls, count]) => (
                        <div key={cls} className="flex justify-between items-center text-[10px]">
                          <span className="text-[#475569] dark:text-[#9FA6A8] truncate max-w-[180px]">{cls}</span>
                          <span className="font-bold text-[#172033] dark:text-[#F3F4F1]">{count.toLocaleString()} rows</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-2 font-mono">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#0B0D0F] text-[#475569] dark:text-[#9FA6A8] hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAndLaunch}
                    className="px-5 py-2.5 rounded-xl bg-[#1769E0] hover:bg-[#0F3B68] text-white font-bold shadow-md transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>Confirm & Launch Training</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
