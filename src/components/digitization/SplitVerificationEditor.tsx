import React, { useState } from 'react';
import { useLandRecord } from '../../context/LandRecordContext';
import { DocumentCanvasViewer } from './DocumentCanvasViewer';
import { ExtractedFieldsForm } from './ExtractedFieldsForm';
import {
  SplitSquareVertical,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Sparkles,
  ArrowLeftRight,
  ArrowLeft
} from 'lucide-react';

export const SplitVerificationEditor: React.FC = () => {
  const { records, activeRecord, setActiveRecordId, setActiveTab } = useLandRecord();
  const [queueFilter, setQueueFilter] = useState<'PENDING' | 'ALL'>('PENDING');

  const pendingRecords = records.filter(
    r => r.status === 'VERIFICATION_PENDING' || r.status === 'DISPUTED' || r.status === 'EXTRACTED'
  );

  const displayedRecords = queueFilter === 'PENDING' ? pendingRecords : records;

  // Sync active record when filter changes
  React.useEffect(() => {
    if (displayedRecords.length > 0 && (!activeRecord || !displayedRecords.some(r => r.id === activeRecord.id))) {
      setActiveRecordId(displayedRecords[0].id);
    }
  }, [queueFilter, displayedRecords.length]);

  return (
    <div className="flex flex-col h-[calc(100vh-85px)] p-4 space-y-3 bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden">
      {/* Top Document Shelf Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs shrink-0 shadow-card">
        <div className="flex items-center space-x-3 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all shrink-0 font-medium shadow-sm cursor-pointer"
            title="Exit verification and return to Executive Command Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            Executive Command
          </button>

          {/* Queue Mode Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setQueueFilter('PENDING')}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                queueFilter === 'PENDING'
                  ? 'bg-brand-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pending ({pendingRecords.length})
            </button>
            <button
              onClick={() => setQueueFilter('ALL')}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                queueFilter === 'ALL'
                  ? 'bg-brand-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({records.length})
            </button>
          </div>

          {/* Quick Demo Shortcut for Hackathon Judges */}
          <button
            type="button"
            onClick={() => {
              setActiveRecordId('REC_DISPUTED_AREA_MISMATCH_004');
              setQueueFilter('ALL');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer border ${
              activeRecord?.id === 'REC_DISPUTED_AREA_MISMATCH_004'
                ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-400/40'
                : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800/80 animate-pulse hover:animate-none'
            }`}
            title="Jump directly to flagged share mismatch anomaly on Khasra 118/3 (125% co-owner shares)"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
            <span>Demo Anomaly: Khasra 118/3 (125% Share Mismatch)</span>
          </button>

          <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-800">
            <FileText className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Queue:
          </span>
          {displayedRecords.map((r) => {
            const isSelected = activeRecord?.id === r.id;
            const hasDispute = r.status === 'DISPUTED' || (r.validationIssues && r.validationIssues.some(i => i.severity === 'CRITICAL'));
            return (
              <button
                key={r.id}
                onClick={() => setActiveRecordId(r.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 border cursor-pointer ${
                  isSelected
                    ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border-brand-500/40 shadow-sm font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${hasDispute ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                <span>{r.recordNumber.split('-').slice(0, 2).join('-')} ({r.documentLanguage.toUpperCase()})</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {r.khasraNumber}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 shrink-0 ml-3">
          <button
            onClick={() => setActiveTab('DIGITIZE_STUDIO')}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors font-medium shadow-sm cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            Image Preprocessing Studio
          </button>
        </div>
      </div>

      {displayedRecords.length === 0 ? (
        /* Celebratory Empty Queue State */
        <div className="flex-1 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-5 shadow-card min-h-0">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Records Validated & Signed Off
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              HITL Verification Queue Clear
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No revenue records currently require manual officer intervention or bounding box correction. All documents have either been certified or approved by the Revenue Authority.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setQueueFilter('ALL')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              View Ingested Archive ({records.length} Records)
            </button>
            <button
              onClick={() => setActiveTab('DIGITIZE_STUDIO')}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-card transition cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" /> Ingest New Document
            </button>
            <button
              onClick={() => setActiveTab('CADASTRAL_GIS')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              Inspect Cadastral GIS Map
            </button>
          </div>
        </div>
      ) : (
        /* Dual Pane Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">
          {/* Left Pane: High-Res Interactive Canvas with Bounding Boxes (5 cols on lg, 6 cols on xl) */}
          <div className="lg:col-span-6 xl:col-span-5 h-full overflow-hidden">
            <DocumentCanvasViewer />
          </div>

          {/* Right Pane: Comprehensive Extracted DILRMP Form (7 cols on lg, 7 cols on xl) */}
          <div className="lg:col-span-6 xl:col-span-7 h-full overflow-hidden">
            <ExtractedFieldsForm />
          </div>
        </div>
      )}
    </div>
  );
};
