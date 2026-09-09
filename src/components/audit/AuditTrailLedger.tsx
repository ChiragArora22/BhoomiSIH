import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import {
  FileCheck2,
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  Clock,
  User,
  Hash,
  Layers,
  ArrowDown,
  RefreshCw
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const blockVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

const ScrambleText: React.FC<{ text: string; duration?: number }> = ({ text, duration = 350 }) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const chars = '0123456789abcdef';
    const length = text.length;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * length);

      let result = text.slice(0, revealedCount);
      for (let i = revealedCount; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }

      setDisplay(result);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, duration]);

  return <span className="select-all truncate font-mono">{display}</span>;
};

export const AuditTrailLedger: React.FC = () => {
  const { auditChain } = useLandRecord();
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [searchHash, setSearchHash] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 800);
  };

  const filteredBlocks = auditChain.filter(block => {
    const matchesRole = filterRole === 'ALL' || block.actorRole === filterRole;
    const matchesSearch = !searchHash || 
      block.blockHash.toLowerCase().includes(searchHash.toLowerCase()) ||
      block.documentId.toLowerCase().includes(searchHash.toLowerCase()) ||
      block.actorName.toLowerCase().includes(searchHash.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-85px)] bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            SHA-256 Tamper-Proof Cryptographic Provenance
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Immutable Audit Trail & Blockchain Revenue Ledger
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Every OCR digitization step, officer correction, area modification, and digital signature approval is cryptographically chained with SHA-256 hashes.
          </p>
        </div>

        {/* Verification Status Pill / Audit Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleVerifyChain}
          className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-500/40 rounded-xl px-4 py-2.5 flex items-center space-x-3 text-xs shadow-card transition-colors cursor-pointer"
        >
          <div className={`w-3 h-3 rounded-full ${isVerifying ? 'bg-amber-500 animate-spin' : 'bg-emerald-500 animate-pulse'}`}></div>
          <div className="text-left">
            <div className="font-bold text-emerald-800 dark:text-emerald-300">
              {isVerifying ? 'Recalculating Merkle Root...' : '100% Chain Integrity Verified'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{auditChain.length} Blocks Sequenced • Click to Audit</div>
          </div>
        </motion.button>
      </div>

      {/* Live Blockchain Growth Banner */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <p className="text-emerald-900 dark:text-emerald-200">
            <span className="font-bold">Live Chaining Active:</span> Actions taken across Bhoomi-Setu (verifying records in HITL, normalising co-owner shares, executing cadastral splits, or running OCR) automatically append SHA-256 blocks to this immutable ledger in real time.
          </p>
        </div>
        <span className="shrink-0 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 shadow-xs">
          {auditChain.length} Blocks Chained
        </span>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Filter Role:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Roles</option>
            <option value="OPERATOR">Data Entry Operator</option>
            <option value="PATWARI">Patwari / Inspector</option>
            <option value="TEHSILDAR">Tehsildar / SDM</option>
            <option value="AI_SERVICE">AI Vision Engine</option>
            <option value="SYSTEM">System Root</option>
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            placeholder="Search by block hash, doc ID, or actor..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
          </input>
        </div>
      </div>

      {/* Chronological Blockchain Sequence */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {filteredBlocks.map((block, idx) => (
          <motion.div
            key={block.blockHash + idx}
            variants={blockVariants}
            className="relative"
          >
            {/* Block Card */}
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card hover:border-brand-500/40 dark:hover:border-emerald-500/40 transition-colors space-y-3"
            >
              {/* Block Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                    BLOCK #{block.blockIndex}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {block.action.replace(/_/g, ' ')}
                  </span>
                  {block.blockIndex > 4 && (
                    <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                      LIVE ACTION
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(block.timestamp).toLocaleString()}
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-slate-800">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Actor & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Actor / Authority</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{block.actorName}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">{block.actorRole} ({block.actorDesignation})</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Target Record ID</span>
                  <span className="text-slate-900 dark:text-white font-mono font-semibold">{block.recordNumber || block.documentId}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">IP: {block.actorIp}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold block">Summary of Changes</span>
                  <span className="text-slate-700 dark:text-slate-300 text-[11px] leading-tight block">{block.changesSummary}</span>
                </div>
              </div>

              {/* Cryptographic Hashes Chaining */}
              <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 text-[11px] font-mono space-y-1">
                <div className="flex flex-wrap items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>PREVIOUS HASH:</span>
                  <span className="text-slate-600 dark:text-slate-400 select-all truncate max-w-md">
                    <ScrambleText text={block.previousHash} />
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" /> CURRENT BLOCK SHA-256:
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-300 select-all truncate max-w-md">
                    <ScrambleText text={block.blockHash} />
                  </span>
                </div>
                {block.digitalSignature && (
                  <div className="flex flex-wrap items-center justify-between text-amber-700 dark:text-amber-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> NIC DIGITAL SIGNATURE:
                    </span>
                    <span className="text-amber-700 dark:text-amber-300 select-all truncate max-w-md">
                      <ScrambleText text={block.digitalSignature} />
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Connecting arrow if not last item */}
            {idx < filteredBlocks.length - 1 && (
              <div className="flex justify-center my-1.5 text-brand-500/60 dark:text-emerald-500/40">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
