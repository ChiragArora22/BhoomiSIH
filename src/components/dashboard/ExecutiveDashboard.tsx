import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import { STATE_DIGITIZATION_PROGRESS, OCR_PERFORMANCE_METRICS } from '../../data/mockAnalytics';
import { useCountUp } from '../../utils/useCountUp';
import { TutorialVideoModal } from '../common/TutorialVideoModal';
import {
  FileText,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Sparkles,
  TrendingUp,
  Map,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Database,
  Search,
  ScanLine,
  ChevronRight,
  Award,
  Layers,
  BarChart3,
  Play,
  Scale,
  ArrowRight
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

const CountUpValue: React.FC<{
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  formatIndian?: boolean;
}> = ({ to, duration = 800, decimals = 0, prefix = '', suffix = '', formatIndian = true }) => {
  const count = useCountUp(to, { duration, decimals, formatIndian });
  return <>{prefix}{count}{suffix}</>;
};

export const ExecutiveDashboard: React.FC = () => {
  const { records, setActiveRecordId, setActiveTab, modelMetrics, auditChain, t } = useLandRecord();
  const [selectedStateCode, setSelectedStateCode] = useState<string>('UP');
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  const selectedState = STATE_DIGITIZATION_PROGRESS.find(s => s.stateCode === selectedStateCode) || STATE_DIGITIZATION_PROGRESS[0];

  const totalDigitized = records.length;
  const verifiedCount = records.filter(r => r.status === 'APPROVED_TEHSILDAR' || r.status === 'SYNCED_LRMS' || r.status === 'VERIFIED_PATWARI').length;
  const pendingCount = records.filter(r => r.status === 'VERIFICATION_PENDING').length;
  const disputedCount = records.filter(r => r.status === 'DISPUTED' || (r.validationIssues && r.validationIssues.some(i => i.severity === 'CRITICAL'))).length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-85px)] bg-[var(--bg-base)] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Hero Welcome & Quick Launch Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 shadow-md text-white">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {t('heroTitle')}
            </h2>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/35 text-white border border-indigo-400/40 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer backdrop-blur-sm shadow-sm hover:border-indigo-400/70"
            >
              <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              <span>Watch Video Tour (25s)</span>
            </button>
            <button
              onClick={() => setActiveTab('DIGITIZE_STUDIO')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-900/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              {t('uploadAndDigitize')}
            </button>
            <button
              onClick={() => setActiveTab('SPLIT_VERIFY')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer backdrop-blur-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t('launchHitl')} ({pendingCount})
            </button>
          </div>
        </div>
      </div>

      {/* P1.4 HERO IMPACT STAT CARD: DILRMP Modernization Benchmark */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-900/90 border-2 border-indigo-500/30 dark:border-indigo-500/40 rounded-3xl p-6 shadow-card relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Program Objective Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Official DILRMP Modernization Benchmark
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  DoLR / DILRMP-MIS (31-Dec-2023)
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                National Progress Baseline & Local Evaluation Harness
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Source</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
              DoLR-MIS · 31-Dec-2023
            </span>
          </div>
        </div>

        {/* 4 Hero Impact Big Metric Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5 relative z-10">
          {/* Pillar 1: RoR Computerisation */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 relative group hover:border-indigo-500/50 transition-all">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1">
              <span>RoR Computerisation</span>
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">95.09%</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">National</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-snug">
              Official DoLR MIS benchmark: 6,24,000+ revenue villages with computerised Records of Rights across participating States.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Official MIS Baseline</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">As on 31-Dec-2023</span>
            </div>
          </div>

          {/* Pillar 2: Cadastral Map Digitisation */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 relative group hover:border-emerald-500/50 transition-all">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1">
              <span>Cadastral Geo-Referencing</span>
              <Map className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">49.10%</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">National</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-snug">
              Official DoLR MIS figure: cadastral maps digitised, geo-referenced, and linked to land revenue records pan-India.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Official MIS Baseline</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">As on 31-Dec-2023</span>
            </div>
          </div>

          {/* Pillar 3: Share Math Check Consistency */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 relative group hover:border-amber-500/50 transition-all">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1">
              <span>Statutory Rule Consistency</span>
              <Scale className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight">100%</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Deterministic</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-snug">
              Local test harness: deterministic mathematical validation checks 100% of co-owner share sums under UP Revenue Code Sec 31.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Evaluation Suite</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">5 Test Records</span>
            </div>
          </div>

          {/* Pillar 4: Discrepancy Detection Rate */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 relative group hover:border-cyan-500/50 transition-all">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1">
              <span>Discrepancy Catch Rate</span>
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono tracking-tight">20.0%</span>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">Flagged</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-snug">
              Local harness: 1 of 5 records correctly identified with mathematical share mismatch (112.5% &gt; 100.0%) for Patwari review.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>1 Flagged / 4 Valid</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">Deterministic</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs relative z-10">
          {/* Legacy Flow */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold uppercase text-[10px] tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Standard Paper-Based Tehsil Workflow</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Manual Transcription:</strong> Physical record registers prone to clerical discrepancies in regional scripts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>Unchecked Fractions:</strong> Partition share ratios are not automatically summed to match gross parcel area.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>No Cryptographic Audit:</strong> Disconnected paper registers lack machine-verifiable modification provenance.</span>
              </li>
            </ul>
          </div>

          {/* Bhoomi-Setu Flow */}
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-4">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bhoomi-Setu Verification Architecture</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>HITL Verification:</strong> Split-screen review pairs OCR bounding boxes with interactive field confirmation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Sec 31 Rule Engine:</strong> Deterministic share validation flags mismatches and offers proportional rebalancing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Append-Only Provenance:</strong> Local SHA-256 chained log records every operator action and Tehsildar sanction.</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Top 6 KPI Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {/* Total Processed */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3 }}
          onClick={() => {
            if (records[0]) setActiveRecordId(records[0].id);
            setActiveTab('SPLIT_VERIFY');
          }}
          className="bg-white dark:bg-slate-900/85 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm dark:shadow-none hover:shadow-card-hover dark:hover:border-indigo-500/50 transition-all cursor-pointer group"
          title="Click to view all land records in HITL Verification"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t('kpiMonthly')}</span>
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            <CountUpValue to={records.length} duration={800} formatIndian={false} suffix=" Records" />
          </div>
          <div className="flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Evaluation suite active
          </div>
        </motion.div>

        {/* Mean OCR Accuracy */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3 }}
          onClick={() => setActiveTab('ACTIVE_LEARNING')}
          className="bg-white dark:bg-slate-900/85 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm dark:shadow-none hover:shadow-card-hover dark:hover:border-emerald-500/50 transition-all cursor-pointer group"
          title="Click to view Active Learning OCR accuracy and retraining queue"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{t('kpiAccuracy')}</span>
            <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
            <CountUpValue to={modelMetrics.overallAccuracyPercent} duration={800} decimals={1} suffix="%" />
          </div>
          <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold mr-1">{modelMetrics.printedAccuracyPercent}%</span> printed / {modelMetrics.handwrittenAccuracyPercent}% hand
          </div>
        </motion.div>

        {/* Auto-Validated Pass */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3 }}
          onClick={() => {
            const valRec = records.find(r => r.status === 'APPROVED_TEHSILDAR' || r.status === 'SYNCED_LRMS') || records[0];
            if (valRec) setActiveRecordId(valRec.id);
            setActiveTab('SPLIT_VERIFY');
          }}
          className="bg-white dark:bg-slate-900/85 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm dark:shadow-none hover:shadow-card-hover dark:hover:border-indigo-500/50 transition-all cursor-pointer group"
          title="Click to open auto-validated land record"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t('kpiAutoRule')}</span>
            <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
            <CountUpValue to={80.0} duration={800} decimals={1} suffix="%" />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            4 of 5 records passed math rules
          </div>
        </motion.div>

        {/* Pending Verification */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3 }}
          onClick={() => {
            const pendRec = records.find(r => r.status === 'VERIFICATION_PENDING') || records[0];
            if (pendRec) setActiveRecordId(pendRec.id);
            setActiveTab('SPLIT_VERIFY');
          }}
          className="bg-white dark:bg-slate-900/85 border border-amber-300 dark:border-amber-500/30 rounded-2xl p-4 shadow-sm dark:shadow-none hover:shadow-card-hover hover:border-amber-500 transition-all cursor-pointer group"
          title="Click to immediately open pending record in Split Verification"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 transition-colors">{t('kpiPending')}</span>
            <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tracking-tight">
            <CountUpValue to={pendingCount} duration={800} suffix=" Records" />
          </div>
          <div className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-2 font-medium">
            Awaiting HITL verification
          </div>
        </motion.div>

        {/* Disputed / High Risk */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3 }}
          onClick={() => {
            const dispRec = records.find(r => r.status === 'DISPUTED' || (r.validationIssues && r.validationIssues.length > 0)) || records[0];
            if (dispRec) setActiveRecordId(dispRec.id);
            setActiveTab('SPLIT_VERIFY');
          }}
          className="bg-white dark:bg-slate-900/85 border border-rose-300 dark:border-rose-500/30 rounded-2xl p-4 shadow-sm dark:shadow-none hover:shadow-card-hover hover:border-rose-500 transition-all cursor-pointer group"
          title="Click to immediately open flagged/disputed record in Split Verification"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 transition-colors">{t('kpiDisputes')}</span>
            <div className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tracking-tight">
            <CountUpValue to={disputedCount} duration={800} suffix=" Cases" />
          </div>
          <div className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-2">
            UP Rev Code Sec 31 flag
          </div>
        </motion.div>

        {/* SHA-256 Audit Blocks */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -3 }}
          onClick={() => setActiveTab('AUDIT_LEDGER')}
          className="bg-white dark:bg-slate-900/85 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm dark:shadow-none hover:shadow-card-hover dark:hover:border-cyan-500/50 transition-all cursor-pointer group"
          title="Click to inspect Local Audit Ledger"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{t('kpiAuditLog')}</span>
            <div className="p-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-300 font-mono tracking-tight">
            <CountUpValue to={auditChain.length} duration={800} formatIndian={false} suffix=" Blocks" />
          </div>
          <div className="flex items-center text-[11px] text-cyan-600 dark:text-cyan-400/80 mt-2 font-medium">
            SHA-256 chained blocks
          </div>
        </motion.div>
      </motion.div>

      {/* Main Two-Column Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: State-wise DILRMP Modernization Heatmap & Progress */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Map className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {t('stateProgressTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('stateProgressSubtitle')}
              </p>
            </div>

            {/* State Selector Buttons */}
            <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {STATE_DIGITIZATION_PROGRESS.map((st) => (
                <button
                  key={st.stateCode}
                  onClick={() => setSelectedStateCode(st.stateCode)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedStateCode === st.stateCode
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {st.stateCode}
                </button>
              ))}
            </div>
          </div>

          {/* Selected State Spotlight Detail Card */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('selectedTerritory')}</span>
              <span className="text-base font-bold text-slate-900 dark:text-white block">{selectedState.stateName}</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-devanagari font-medium">{selectedState.vernacularName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('villagesModernized')}</span>
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {selectedState.digitizedVillages.toLocaleString('en-IN')} / {selectedState.totalVillages.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">({selectedState.progressPercent}% Completed)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('parcelsMapped')}</span>
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {(selectedState.digitizedParcelsCount / 1000000).toFixed(1)}M / {(selectedState.totalParcelsCount / 1000000).toFixed(1)}M
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium font-mono">
                {((selectedState.digitizedParcelsCount / selectedState.totalParcelsCount) * 100).toFixed(1)}% GIS Vectorized
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{t('aiAccuracyRate')}</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{selectedState.accuracyRatePercent}%</span>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{selectedState.activeDisputesCount} Active Disputes</span>
            </div>
          </div>

          {/* All States Progress Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">State / UT</th>
                  <th className="px-3 py-2.5">Progress</th>
                  <th className="px-3 py-2.5">Digitized Villages</th>
                  <th className="px-3 py-2.5">Parcels Mapped</th>
                  <th className="px-3 py-2.5">AI OCR CRR</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {STATE_DIGITIZATION_PROGRESS.map((st) => (
                  <tr 
                    key={st.stateCode} 
                    onClick={() => setSelectedStateCode(st.stateCode)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      selectedStateCode === st.stateCode ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="px-3 py-2.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] flex items-center justify-center font-bold border border-slate-200 dark:border-slate-700">
                        {st.stateCode}
                      </span>
                      <div>
                        <div>{st.stateName}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{st.vernacularName}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 w-36">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${st.progressPercent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              st.progressPercent >= 95 ? 'bg-emerald-500' : st.progressPercent >= 90 ? 'bg-teal-500' : 'bg-amber-500'
                            }`}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">{st.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono">{st.digitizedVillages.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2.5 font-mono">{(st.digitizedParcelsCount / 100000).toFixed(1)} Lakh</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                        {st.accuracyRatePercent}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('CADASTRAL_GIS');
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        GIS Map <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: AI Processing Pipeline & Language Breakdown */}
        <div className="space-y-6">
          {/* AI Vision Pipeline Engine Stats */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                AI Inference & OCR Pipeline
              </h3>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-mono border border-emerald-200 dark:border-emerald-500/30 font-medium">
                Online (2.8s Latency)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Core Document Parser</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">Bhoomi Indic OCR Pipeline</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Handwritten Devanagari OCR</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">CRNN + CTC Attention</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Dravidian Script Parser</span>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">Tamil / Telugu VGG-Seq2Seq</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Area Math Summation Engine</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">UP Revenue Code Sec 31 Engine</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Active Learning Retrain Cycles</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">44 Batches Processed</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('ACTIVE_LEARNING')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Inspect AI Model Feedback Queue
            </button>
          </div>

          {/* Multilingual Document Distribution */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Multilingual Records Ingestion
            </h3>

            <div className="space-y-2.5">
              {OCR_PERFORMANCE_METRICS.languageDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.language}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">{item.share}% ({item.count.toLocaleString('en-IN')})</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.share}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: idx * 0.08, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-teal-500' : idx === 2 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preloaded Authentic Sample Records Quick-Launch Shelf */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              {t('sampleRecordsTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('sampleRecordsSubtitle')}
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {records.length} Documents Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {records.map((rec) => {
            const hasIssue = rec.validationIssues && rec.validationIssues.length > 0;
            return (
              <motion.div
                key={rec.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setActiveRecordId(rec.id);
                  setActiveTab('SPLIT_VERIFY');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-card-hover ${
                  rec.status === 'DISPUTED' || hasIssue
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/40 hover:border-rose-400'
                    : rec.status === 'APPROVED_TEHSILDAR' || rec.status === 'SYNCED_LRMS'
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-slate-50/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">{rec.recordNumber.split('-').slice(0, 2).join('-')}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'DISPUTED' || hasIssue
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                          : rec.status === 'APPROVED_TEHSILDAR'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                      }`}
                    >
                      {rec.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {rec.documentTitle}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {rec.district.split(' ')[0]}, {rec.state.split(' ')[0]}
                  </div>

                  <div className="mt-3 text-[11px] space-y-1 bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono shadow-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{t('khasraNoLabel').split('/')[0]}:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">{rec.khasraNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{t('plotAreaLabel')}:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{rec.plotAreaOriginal} {rec.plotAreaUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">OCR CRR:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{rec.characterAccuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500">{rec.owners.length} Co-Owner(s)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1">
                    {t('openStudio')} <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tutorial Video Modal */}
      <TutorialVideoModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </div>
  );
};
