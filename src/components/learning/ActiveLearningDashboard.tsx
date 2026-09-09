import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Cpu,
  RefreshCw,
  CheckCircle2,
  Database,
  Layers,
  Zap,
  ArrowRight,
  GitBranch
} from 'lucide-react';

export const ActiveLearningDashboard: React.FC = () => {
  const { activeLearningTokens, modelMetrics, retrainModelBatch, t } = useLandRecord();
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [retrainStepText, setRetrainStepText] = useState('');
  const [retrainSuccess, setRetrainSuccess] = useState(false);

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainProgress(15);
    setRetrainStepText('Compiling Synthetic Hard Negatives & Patwari Edits...');

    setTimeout(() => {
      setRetrainProgress(55);
      setRetrainStepText('Fine-Tuning Devanagari CRNN + Attention Head...');
    }, 600);

    setTimeout(() => {
      setRetrainProgress(88);
      setRetrainStepText('Evaluating Checkpoint Weights & Loss Metrics...');
    }, 1300);

    setTimeout(() => {
      setRetrainProgress(100);
      setRetrainStepText('Checkpointing BhoomiVision v2.4.1 Model Weights...');
    }, 1900);

    setTimeout(() => {
      retrainModelBatch();
      setIsRetraining(false);
      setRetrainProgress(0);
      setRetrainStepText('');
      setRetrainSuccess(true);
      setTimeout(() => setRetrainSuccess(false), 4000);
    }, 2400);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-85px)] bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Toast Alert */}
      <AnimatePresence>
        {retrainSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-card"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Model retrained on {activeLearningTokens.length * 120} feedback tokens! CRR Accuracy increased to {modelMetrics.overallAccuracyPercent}%.
            </span>
            <button onClick={() => setRetrainSuccess(false)} className="text-white/80 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <BrainCircuit className="w-4 h-4" />
            Continuous Learning & Human-in-the-Loop Feedback Loop
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('learningTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('learningSubtitle')}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRetrain}
          disabled={isRetraining}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-card flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isRetraining ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Retraining Transformer Epoch...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('triggerRetrain')}</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Retrain Active Progress Bar Ticker */}
      <AnimatePresence>
        {isRetraining && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white/95 dark:bg-slate-900/95 border border-brand-500/40 rounded-2xl p-4 shadow-card space-y-2 overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600 dark:text-brand-400" />
                {retrainStepText}
              </span>
              <span className="text-slate-900 dark:text-white font-bold">{retrainProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-800">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full"
                animate={{ width: `${retrainProgress}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-card hover:border-brand-500/40 transition-colors">
          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Model Checkpoint</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">{modelMetrics.modelVersion}</div>
          <div className="text-[11px] text-brand-600 dark:text-brand-400 mt-1.5 flex items-center gap-1 font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Epoch {modelMetrics.feedbackBatchesProcessed}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-card hover:border-brand-500/40 transition-colors">
          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Mean CRR Accuracy</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">{modelMetrics.overallAccuracyPercent}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            +2.4% gain over last 5 batches
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-card hover:border-brand-500/40 transition-colors">
          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Handwritten Devanagari CRR</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-300 font-mono tracking-tight">{modelMetrics.handwrittenAccuracyPercent}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Character Error Rate: {modelMetrics.characterErrorRatePercent}%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/85 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-card hover:border-brand-500/40 transition-colors">
          <div className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Feedback Tokens Trained</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-300 font-mono tracking-tight">{(modelMetrics.totalTokensTrained / 1000000).toFixed(2)}M</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            {activeLearningTokens.length} Pending in Buffer
          </div>
        </div>
      </div>

      {/* Accuracy Progression Trend & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Accuracy Epoch Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              OCR Character Recognition Rate (CRR) Progression
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Last retrained: {new Date().toLocaleDateString()}
            </span>
          </div>

          {/* Bar / Progression visualizer */}
          <div className="space-y-3 pt-2">
            {modelMetrics.accuracyTrend.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Epoch {item.epoch} ({item.date})</span>
                  <span className="text-brand-600 dark:text-brand-400 font-bold">{item.accuracy}% CRR</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(item.accuracy - 80) * 5}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Confusion Matrix Preview */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Layers className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Top Confused Glyphs (Devanagari / Modi)
          </h3>

          <div className="space-y-2 text-xs">
            {modelMetrics.confusionMatrixSample.map((c, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, x: 2 }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 hover:border-brand-500/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-brand-600 dark:text-brand-400 font-mono">{c.expected}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">{c.predicted}</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {c.count} corrections
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Learning Corrected Tokens Queue Table */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('feedbackTokens')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tokens transcribed and approved by Patwaris across revenue circles awaiting next fine-tuning epoch.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-3 py-2.5">Field / Doc Type</th>
                <th className="px-3 py-2.5">Original OCR (Misrecognized)</th>
                <th className="px-3 py-2.5">Corrected Ground Truth</th>
                <th className="px-3 py-2.5">Language / Script</th>
                <th className="px-3 py-2.5">Verified By</th>
                <th className="px-3 py-2.5 text-right">Queue Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {activeLearningTokens.map((tok) => (
                <tr key={tok.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-3 py-2.5">
                    <div className="font-bold text-slate-900 dark:text-white">{tok.fieldLabel}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{tok.documentType}</div>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-rose-600 dark:text-rose-300 line-through">
                    {tok.originalOcrText}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {tok.correctedText}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">{tok.language}</div>
                    <div className="text-[10px] text-slate-500">{tok.script}</div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">{tok.correctedBy}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        tok.status === 'DEPLOYED'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tok.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
