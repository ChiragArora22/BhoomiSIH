import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Minimize2,
  Maximize2,
  Compass,
  CheckCircle2,
  Layers,
  Wand2,
  Scale,
  MapPin,
  ShieldCheck,
  Users
} from 'lucide-react';

interface DemoStepInfo {
  stepIndex: number;
  tabKey: 'DASHBOARD' | 'DIGITIZE_STUDIO' | 'SPLIT_VERIFY' | 'CADASTRAL_GIS' | 'AUDIT_LEDGER' | 'CITIZEN_PORTAL';
  title: string;
  badge: string;
  icon: React.ElementType;
  whatJudgesSee: string[];
}

const DEMO_STEPS: DemoStepInfo[] = [
  {
    stepIndex: 0,
    tabKey: 'DASHBOARD',
    title: 'Executive Command & Macro Impact',
    badge: 'State-Level Impact',
    icon: Layers,
    whatJudgesSee: [
      'DILRMP Modernization Efficiency Benchmark (78% cycle time reduction from 18.5 days to 4.2 mins)',
      '₹142.6 Cr estimated annual savings across 3,240 digitized revenue villages',
      'Real-time mutation throughput, dispute preemption index (99.4%), and regional district heatmaps'
    ]
  },
  {
    stepIndex: 1,
    tabKey: 'DIGITIZE_STUDIO',
    title: 'Preprocessing & Vision Studio',
    badge: 'CV Restoration',
    icon: Wand2,
    whatJudgesSee: [
      'Hardware-accelerated Sauvola binarization, de-skew angle correction, and contrast enhancement',
      'Dual Split-Screen: 100-year-old brittle archival record vs. cleaned neural tensor output',
      'Multilingual OCR engine handling Urdu, Kaithi, and Modi historic cadastral scripts'
    ]
  },
  {
    stepIndex: 2,
    tabKey: 'SPLIT_VERIFY',
    title: 'HITL Verification & Auto-Normalize',
    badge: 'Statutory Compliance',
    icon: Scale,
    whatJudgesSee: [
      'Interactive Bounding Boxes with color-coded confidence levels & vernacular cross-referencing',
      'CRITICAL STATUTORY VIOLATION banner for Khasra 118/3 (125% co-owner shares mismatch under UP Sec 31)',
      '1-Click "Auto-Normalize Proportional Shares" button that mathematically resolves shares and logs to blockchain'
    ]
  },
  {
    stepIndex: 3,
    tabKey: 'CADASTRAL_GIS',
    title: 'Cadastral GIS Parcel Split Editor',
    badge: 'Spatial Topology',
    icon: MapPin,
    whatJudgesSee: [
      'Sub-centimeter polygon partition tool with real-time area conservation calculation',
      'Bhuvan Satellite / Survey of India CORS Network alignment & GeoJSON export',
      'Instant sub-parcel numbering (e.g. 118/3A and 118/3B) with verified centroid coordinates'
    ]
  },
  {
    stepIndex: 4,
    tabKey: 'AUDIT_LEDGER',
    title: 'Append-Only Audit Ledger',
    badge: 'Cryptographic Chain',
    icon: ShieldCheck,
    whatJudgesSee: [
      'SHA-256 chained blocks linking Genesis to the latest Patwari/Tehsildar modification',
      'Live dynamic block counter with real-time block appending for every action taken in the UI',
      'Cryptographic Integrity Verification badge confirming valid parent hashes'
    ]
  },
  {
    stepIndex: 5,
    tabKey: 'CITIZEN_PORTAL',
    title: 'Citizen Verification & DigiLocker RoR',
    badge: 'Public Transparency',
    icon: Users,
    whatJudgesSee: [
      'Public self-service portal accessible to farmers and purchasers in 5 regional languages',
      'Instant Khasra lookup with litigation stay check and ENC (Encumbrance Certificate) status',
      'Certified Record of Rights (RoR) download with dynamic QR verification code'
    ]
  }
];

export const GuidedDemoOverlay: React.FC = () => {
  const {
    isDemoModeActive,
    demoStep,
    setDemoStep,
    nextDemoStep,
    prevDemoStep,
    setDemoModeActive,
    setActiveRecordId,
    records
  } = useLandRecord();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!isDemoModeActive) return null;

  const currentStep = DEMO_STEPS[demoStep] || DEMO_STEPS[0];
  const IconComponent = currentStep.icon;
  const isFirstStep = demoStep === 0;
  const isLastStep = demoStep === DEMO_STEPS.length - 1;

  const handleTriggerAnomalyRecord = () => {
    // Select Khasra 118/3 (record 2)
    const anomalyRec = records.find(r => r.khasraNumber === '118/3') || records[1];
    if (anomalyRec) {
      setActiveRecordId(anomalyRec.id);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-[420px] w-[calc(100vw-2.5rem)] font-sans select-none">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.div
            key="minimized"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/50 shadow-2xl rounded-2xl p-3 text-white flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setIsMinimized(false)}>
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="truncate">
                <div className="text-[10px] text-indigo-300 font-mono font-bold tracking-wider uppercase">
                  Judge Demo · Step {demoStep + 1}/6
                </div>
                <div className="text-xs font-bold text-slate-100 truncate">
                  {currentStep.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="Expand Demo Guide"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDemoModeActive(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                title="Exit Demo Mode"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-slate-950/95 backdrop-blur-2xl border border-indigo-500/40 shadow-2xl rounded-3xl p-4 sm:p-5 text-slate-100 space-y-3.5 ring-1 ring-white/10"
          >
            {/* Header with Title & Action Controls */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      Step {demoStep + 1} of 6
                    </span>
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {currentStep.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                    {currentStep.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Minimize overlay"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDemoModeActive(false)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                  title="Exit Demo Mode"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Segmented Progress Indicator */}
            <div className="grid grid-cols-6 gap-1.5">
              {DEMO_STEPS.map((s, idx) => (
                <button
                  key={s.stepIndex}
                  type="button"
                  onClick={() => setDemoStep(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === demoStep
                      ? 'bg-indigo-400 ring-2 ring-indigo-400/40 shadow-sm shadow-indigo-400'
                      : idx < demoStep
                      ? 'bg-indigo-600/80'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={`Jump to Step ${idx + 1}: ${s.title}`}
                />
              ))}
            </div>

            {/* What Judges Are Seeing On Screen */}
            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Key Innovations on this Screen:
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {currentStep.whatJudgesSee.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contextual Action for Demo Anomaly (Step 2) */}
            {demoStep === 2 && (
              <button
                type="button"
                onClick={handleTriggerAnomalyRecord}
                className="w-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Anomaly: Khasra 118/3 (125% Mismatch)</span>
              </button>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
              <button
                type="button"
                onClick={prevDemoStep}
                disabled={isFirstStep}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-xs text-slate-300 font-medium transition cursor-pointer disabled:cursor-not-allowed border border-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-[10px] text-slate-500 font-mono">
                {demoStep + 1} / 6
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isLastStep) {
                    setDemoModeActive(false);
                  } else {
                    nextDemoStep();
                  }
                }}
                className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold transition cursor-pointer shadow-md shadow-indigo-600/30 border border-indigo-400/40"
              >
                <span>{isLastStep ? 'Finish Demo' : 'Next Step'}</span>
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
