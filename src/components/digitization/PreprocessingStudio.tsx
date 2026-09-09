import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import { PreprocessingConfig, LandRecord } from '../../types/landRecord';
import { renderSyntheticLandRecordToCanvas } from '../../utils/documentRenderer';
import { applyDocumentFilters } from '../../utils/canvasFilters';
import {
  Sliders,
  RotateCw,
  Sparkles,
  Layers,
  Wand2,
  FileCheck,
  CheckCircle2,
  Download,
  Eye,
  RefreshCw,
  Split,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

export const PreprocessingStudio: React.FC = () => {
  const { activeRecord, updateActiveRecord, runOcrExtraction, setActiveTab, records, setActiveRecordId, t } = useLandRecord();

  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement>(null);

  const [config, setConfig] = useState<PreprocessingConfig>(
    activeRecord?.preprocessingConfig || {
      deskewAngle: 0.8,
      binarizationThreshold: 145,
      denoisingLevel: 30,
      contrastBoost: 40,
      inkRecovery: true,
      stampSuppression: false,
      superResolution: true
    }
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTabMode, setActiveTabMode] = useState<'SIDE_BY_SIDE' | 'PROCESSED_ONLY' | 'ORIGINAL_ONLY'>('SIDE_BY_SIDE');

  // Sync config when activeRecord changes
  useEffect(() => {
    if (activeRecord) {
      setConfig(activeRecord.preprocessingConfig);
    }
  }, [activeRecord?.id]);

  // Render original canvas and apply filters to processed canvas
  useEffect(() => {
    if (!activeRecord || !originalCanvasRef.current || !processedCanvasRef.current) return;

    renderSyntheticLandRecordToCanvas(originalCanvasRef.current, activeRecord);
    applyDocumentFilters(originalCanvasRef.current, processedCanvasRef.current, config);
  }, [activeRecord, config]);

  const handleAutoEnhance = () => {
    setConfig({
      deskewAngle: 0.0,
      binarizationThreshold: 140,
      denoisingLevel: 35,
      contrastBoost: 45,
      inkRecovery: true,
      stampSuppression: false,
      superResolution: true
    });
  };

  const handleRunOcr = async () => {
    if (!activeRecord) return;
    setIsProcessing(true);
    setProcessingProgress(20);
    setProcessingStep('Applying Sauvola adaptive binarization & deskew filters...');
    updateActiveRecord({ preprocessingConfig: config });

    await new Promise(r => setTimeout(r, 450));
    setProcessingProgress(55);
    setProcessingStep('Executing Multilingual Indic OCR Pipeline on bounding boxes...');

    await new Promise(r => setTimeout(r, 500));
    setProcessingProgress(85);
    setProcessingStep('Verifying DILRMP revenue geometry constraints & share totals...');

    await new Promise(r => setTimeout(r, 450));
    setProcessingProgress(100);
    setProcessingStep('OCR extraction complete. Routing to Officer Verification Studio...');

    await runOcrExtraction(activeRecord.id);
    await new Promise(r => setTimeout(r, 300));
    setIsProcessing(false);
    setProcessingStep('');
    setActiveTab('SPLIT_VERIFY');
  };

  if (!activeRecord) {
    return (
      <div className="p-8 space-y-6 max-w-xl mx-auto text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
          <Wand2 className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No Document Loaded for Vision Pre-Processing
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Select a land record from the archive or load a sample document to test Sauvola binarization, noise reduction, and Deep OCR extraction.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {records.length > 0 && (
            <button
              onClick={() => setActiveRecordId(records[0].id)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Load Sample: {records[0].recordNumber.split('-').slice(0, 2).join('-')}
            </button>
          )}
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            Return to Executive Command
          </button>
        </div>
      </div>
    );
  }

  const hasDiscrepancies = activeRecord.status === 'DISPUTED' || (activeRecord.validationIssues && activeRecord.validationIssues.some(i => i.severity === 'CRITICAL'));
  const hasLowConfidence = (activeRecord.overallConfidence || 0) < 92 || activeRecord.ocrBoundingBoxes.some(b => b.confidence < 80);

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-85px)] bg-[var(--bg-base)] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header & Record Switcher Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Wand2 className="w-4 h-4" />
            AI Document Ingestion & Vision Pre-Processing Studio
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('preprocTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('preprocSubtitle')}
          </p>
        </div>

        {/* Top Actions & Quick Sample Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition font-medium shadow-sm cursor-pointer"
            title="Cancel / Return to Executive Command"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Executive Command
          </button>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 px-2 font-medium">Sample:</span>
            {records.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRecordId(r.id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeRecord.id === r.id
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r.documentLanguage.toUpperCase()} - {r.documentType.slice(0, 7)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 1 Col: Vision Filters Control Panel */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-5 h-fit">
          {/* Low Confidence / Dispute Guidance Banner */}
          {(hasDiscrepancies || hasLowConfidence) && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Human Review Required</span>
              </div>
              <p className="text-[11px] text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
                {hasDiscrepancies 
                  ? "Discrepancy flag detected in revenue shares or land area. Deep OCR will extract coordinates and route directly to Officer HITL Verification."
                  : "Low OCR confidence (<92%) detected on degraded characters. Extracted fields will be flagged for human sign-off."}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              {t('restorationParams')}
            </h3>
            <button
              onClick={handleAutoEnhance}
              className="text-[11px] bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-500/30 font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> {t('autoTune')}
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Deskew Angle */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                  {t('skewAngle')}
                </label>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{config.deskewAngle}°</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.2"
                value={config.deskewAngle}
                onChange={(e) => setConfig({ ...config, deskewAngle: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Deskew rotation angle in degrees"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-10°</span>
                <span>0° (Level)</span>
                <span>+10°</span>
              </div>
            </div>

            {/* 2. Adaptive Binarization Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-slate-700 dark:text-slate-300 font-medium">{t('binarizationSauvola')}</label>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{config.binarizationThreshold}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                step="1"
                value={config.binarizationThreshold}
                onChange={(e) => setConfig({ ...config, binarizationThreshold: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Adaptive binarization threshold value"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 (Grayscale)</span>
                <span>140 (Standard)</span>
                <span>255 (Max Contrast)</span>
              </div>
            </div>

            {/* 3. Contrast & Gamma Boost */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-slate-700 dark:text-slate-300 font-medium">{t('contrastBoost')}</label>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">+{config.contrastBoost}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={config.contrastBoost}
                onChange={(e) => setConfig({ ...config, contrastBoost: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Contrast and gamma boost percentage"
              />
            </div>

            {/* 4. Denoising Level */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-slate-700 dark:text-slate-300 font-medium">{t('noiseSmoothing')}</label>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{config.denoisingLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={config.denoisingLevel}
                onChange={(e) => setConfig({ ...config, denoisingLevel: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Noise reduction smoothing percentage"
              />
            </div>

            {/* Feature Toggles */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">{t('inkRecovery')}</span>
                <input
                  type="checkbox"
                  checked={config.inkRecovery}
                  onChange={(e) => setConfig({ ...config, inkRecovery: e.target.checked })}
                  aria-label="Toggle morphological ink recovery"
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">{t('stampSuppression')}</span>
                <input
                  type="checkbox"
                  checked={config.stampSuppression}
                  onChange={(e) => setConfig({ ...config, stampSuppression: e.target.checked })}
                  aria-label="Toggle revenue stamp and ink seal suppression"
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">{t('superResolution')}</span>
                <input
                  type="checkbox"
                  checked={config.superResolution}
                  onChange={(e) => setConfig({ ...config, superResolution: e.target.checked })}
                  aria-label="Toggle 2x super resolution upscaling"
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleRunOcr}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                  <span>Running Vision Transformer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('applyAndRunOcr')}</span>
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => setActiveTab('DASHBOARD')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs border border-slate-200 dark:border-slate-700/80 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              Cancel & Return to Executive Command
            </button>
          </div>
        </div>

        {/* Right 3 Cols: Dual Canvas Before / After Viewer */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-4 flex flex-col">
          {/* Canvas Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTabMode('SIDE_BY_SIDE')}
                className={`relative text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTabMode === 'SIDE_BY_SIDE'
                    ? 'text-indigo-600 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTabMode === 'SIDE_BY_SIDE' && (
                  <motion.div
                    layoutId="preprocActiveTab"
                    className="absolute inset-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 rounded-lg"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{t('splitView')}</span>
              </button>
              <button
                onClick={() => setActiveTabMode('PROCESSED_ONLY')}
                className={`relative text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTabMode === 'PROCESSED_ONLY'
                    ? 'text-indigo-600 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTabMode === 'PROCESSED_ONLY' && (
                  <motion.div
                    layoutId="preprocActiveTab"
                    className="absolute inset-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 rounded-lg"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{t('aiEnhancedView')}</span>
              </button>
              <button
                onClick={() => setActiveTabMode('ORIGINAL_ONLY')}
                className={`relative text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTabMode === 'ORIGINAL_ONLY'
                    ? 'text-indigo-600 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTabMode === 'ORIGINAL_ONLY' && (
                  <motion.div
                    layoutId="preprocActiveTab"
                    className="absolute inset-0 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 rounded-lg"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{t('rawScanView')}</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setZoomLevel(Math.max(40, zoomLevel - 15))}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 min-w-[3rem] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 15))}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline ml-1 cursor-pointer font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Canvas Render Area */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-950/90 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 overflow-auto min-h-[520px] max-h-[640px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex flex-wrap items-start justify-center gap-6"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
              >
                {/* Original Canvas */}
                {(activeTabMode === 'SIDE_BY_SIDE' || activeTabMode === 'ORIGINAL_ONLY') && (
                  <div className="flex flex-col items-center">
                    <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/90 px-3 py-1 rounded-t-xl border-t border-x border-slate-200 dark:border-slate-800 font-mono shadow-xs">
                      RAW SCAN (Original)
                    </div>
                    <div className="shadow-lg rounded-b-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
                      <canvas ref={originalCanvasRef} className="max-w-[440px] h-auto object-contain block" />
                    </div>
                  </div>
                )}

                {/* Filtered Processed Canvas */}
                {(activeTabMode === 'SIDE_BY_SIDE' || activeTabMode === 'PROCESSED_ONLY') && (
                  <div className="flex flex-col items-center">
                    <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900/90 px-3 py-1 rounded-t-xl border-t border-x border-indigo-200 dark:border-indigo-500/30 font-mono flex items-center gap-1.5 shadow-xs">
                      <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      AI RESTORED (Deskewed & Binarized)
                    </div>
                    <div className="shadow-lg rounded-b-xl overflow-hidden border border-indigo-300 dark:border-indigo-500/30 bg-white">
                      <canvas ref={processedCanvasRef} className="max-w-[440px] h-auto object-contain block" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Multi-step Processing Modal Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Executing AI Vision Pipeline
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Model: Bhoomi-Indic-OCR (v2.4.1)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{processingStep}</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{processingProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${processingProgress}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                Deskewing, binarizing, and tokenizing vernacular Devanagari/Tamil land record fields with DILRMP revenue geometry validation.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
