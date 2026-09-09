import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import { LandClassification, LandOwner, AreaUnit } from '../../types/landRecord';
import {
  convertArea,
  parseShareFraction,
  percentageToFraction,
  formatShareRatioWithPercentage,
  extractFractionAndPercentage,
  updateShareRatioFromPercentage,
  updateShareRatioFromFraction,
  UNIT_LABELS
} from '../../utils/areaConverter';
import {
  getAvailableStates,
  getDistrictsForState,
  getTehsilsForDistrict,
  getVillagesForTehsil,
  normalizeStateName,
  normalizeDistrictName,
  normalizeTehsilName
} from '../../data/administrativeHierarchy';
import {
  transliterateEnglishToVernacular,
  getScriptForStateOrLanguage
} from '../../utils/transliteration';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Plus,
  Trash2,
  BrainCircuit,
  Lock,
  FileCheck,
  Building,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  MapPin,
  ListFilter,
  Edit3,
  Zap,
  RotateCcw,
  Lightbulb,
  Check
} from 'lucide-react';

export const ExtractedFieldsForm: React.FC = () => {
  const {
    activeRecord,
    updateActiveRecord,
    updateRecordField,
    userRole,
    approveByPatwari,
    approveByTehsildar,
    rejectRecord,
    queueActiveLearningCorrection,
    selectedBoundingBoxId,
    setSelectedBoundingBoxId,
    setActiveTab,
    appendAuditBlock,
    t
  } = useLandRecord();

  const [activeUnit, setActiveUnit] = useState<AreaUnit>(activeRecord?.plotAreaUnit || 'HECTARE');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [patwariNotes, setPatwariNotes] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
  const [isManualLocationInput, setIsManualLocationInput] = useState(false);
  const [isRecentlyNormalized, setIsRecentlyNormalized] = useState(false);

  React.useEffect(() => {
    setIsRecentlyNormalized(false);
  }, [activeRecord?.id]);

  if (!activeRecord) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
          <FileCheck className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-xs">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Extracted Record Active
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Select a record to review its extracted revenue attributes, Indic transliteration, and mathematical co-owner shares.
          </p>
        </div>
      </div>
    );
  }

  // Calculate live co-owner share sum
  const totalShareSum = activeRecord.owners.reduce((acc, o) => {
    return acc + (o.shareFraction || parseShareFraction(o.shareRatio));
  }, 0);
  const isShareValid = Math.abs(totalShareSum - 1.0) < 0.005;
  const hasShareMismatch = !isShareValid || (activeRecord.validationIssues && activeRecord.validationIssues.some(i => i.ruleCode === 'BR_REV_001_SHARE_MISMATCH'));

  // Handle unit change and re-conversion
  const handleUnitChange = (newUnit: AreaUnit) => {
    setActiveUnit(newUnit);
    const converted = convertArea(activeRecord.plotAreaHectares, 'HECTARE', newUnit);
    updateActiveRecord({
      plotAreaOriginal: converted,
      plotAreaUnit: newUnit
    });
  };

  // Handle owner field updates with real-time Indic transliteration & dynamic share fraction sync
  const handleOwnerChange = (index: number, field: keyof LandOwner, value: any) => {
    const updatedOwners = [...activeRecord.owners];
    const currentOwner = updatedOwners[index];

    let newVernacular = currentOwner.vernacularName;
    if (field === 'name') {
      const targetScript = getScriptForStateOrLanguage(activeRecord.documentLanguage, activeRecord.state);
      newVernacular = transliterateEnglishToVernacular(value, targetScript);
    }

    let finalValue = value;
    let computedFraction = currentOwner.shareFraction;

    if (field === 'shareRatio' && typeof value === 'string') {
      const res = formatShareRatioWithPercentage(value);
      finalValue = res.formatted;
      computedFraction = res.fraction;
    }

    updatedOwners[index] = {
      ...currentOwner,
      [field]: finalValue,
      ...(field === 'name' ? { vernacularName: newVernacular } : {}),
      ...(field === 'shareRatio' ? { shareFraction: computedFraction } : {})
    };

    updateActiveRecord({ owners: updatedOwners });
  };

  // Dedicated bidirectional handler for editing fraction (updates % automatically)
  const handleOwnerFractionChange = (index: number, fracValue: string) => {
    const updatedOwners = [...activeRecord.owners];
    const currentOwner = updatedOwners[index];
    const res = updateShareRatioFromFraction(fracValue);

    updatedOwners[index] = {
      ...currentOwner,
      shareRatio: res.shareRatio,
      shareFraction: res.fraction
    };

    updateActiveRecord({ owners: updatedOwners });
  };

  // Dedicated bidirectional handler for editing percentage (updates fraction automatically)
  const handleOwnerPercentageChange = (index: number, pctValue: string) => {
    const updatedOwners = [...activeRecord.owners];
    const currentOwner = updatedOwners[index];
    const res = updateShareRatioFromPercentage(pctValue);

    updatedOwners[index] = {
      ...currentOwner,
      shareRatio: res.shareRatio,
      shareFraction: res.fraction
    };

    updateActiveRecord({ owners: updatedOwners });
  };

  // Add new co-owner
  const handleAddOwner = () => {
    const newOwner: LandOwner = {
      id: `OWNER_NEW_${Date.now()}`,
      name: 'New Co-Owner',
      vernacularName: 'नया खातेदार',
      fatherOrSpouseName: 'Father Name',
      relationType: 'S/O',
      shareRatio: '1/4 (25%)',
      shareFraction: 0.25,
      residence: activeRecord.revenueVillage
    };
    updateActiveRecord({ owners: [...activeRecord.owners, newOwner] });
  };

  // Remove owner
  const handleRemoveOwner = (index: number) => {
    const updated = activeRecord.owners.filter((_, idx) => idx !== index);
    updateActiveRecord({ owners: updated });
  };

  // Auto-Fix Share Ratio discrepancy (Proportional Re-balancing to 100.00%)
  const handleAutoFixShares = async () => {
    if (activeRecord.owners.length === 0) return;
    
    const currentTotal = activeRecord.owners.reduce((acc, o) => {
      return acc + (o.shareFraction || parseShareFraction(o.shareRatio));
    }, 0);

    const count = activeRecord.owners.length;
    let accumulatedFraction = 0;

    const fixedOwners = activeRecord.owners.map((owner, idx) => {
      const origFraction = owner.shareFraction || parseShareFraction(owner.shareRatio);
      // If currentTotal is valid and > 0, rebalance proportionally; otherwise divide equally
      let normalized = 0;
      if (currentTotal > 0) {
        if (idx === count - 1) {
          normalized = Math.max(0.01, Math.round((1.0 - accumulatedFraction) * 10000) / 10000);
        } else {
          normalized = Math.round((origFraction / currentTotal) * 10000) / 10000;
        }
      } else {
        normalized = Math.round((1 / count) * 10000) / 10000;
      }
      accumulatedFraction += normalized;

      const pct = (normalized * 100).toFixed(2);
      const fracStr = percentageToFraction(normalized * 100);
      return {
        ...owner,
        shareFraction: normalized,
        shareRatio: `${fracStr} (${pct}%)`
      };
    });

    updateActiveRecord({ owners: fixedOwners });
    setIsRecentlyNormalized(true);

    if (appendAuditBlock) {
      await appendAuditBlock(
        activeRecord.id,
        activeRecord.recordNumber,
        'SHARE_RATIO_NORMALIZED',
        userRole === 'TEHSILDAR' ? 'Anil Varma, PCS' : 'Rajesh Kumar Verma',
        userRole === 'TEHSILDAR' ? 'TEHSILDAR' : 'PATWARI',
        userRole === 'TEHSILDAR' ? 'Sub-Divisional Magistrate / Tehsildar' : 'Revenue Inspector / Patwari (Halka 14)',
        `Auto-normalized co-owner shares from ${(currentTotal * 100).toFixed(1)}% to 100.00% (UP Revenue Code Sec. 31 / DILRMP Rule 14 compliance) on Khasra ${activeRecord.khasraNumber}.`
      );
    }

    setShowSuccessToast('Co-owner shares re-normalized proportionally to 100.00% (UP Revenue Code Sec 31)');
    setTimeout(() => setShowSuccessToast(null), 4000);
  };

  // Simulate Share Discrepancy (for judges to test live)
  const handleSimulateDiscrepancy = () => {
    if (activeRecord.owners.length === 0) return;
    let simulated: LandOwner[] = [];
    if (activeRecord.owners.length === 1) {
      simulated = [
        { ...activeRecord.owners[0], shareRatio: '3/4 (75%)', shareFraction: 0.75 },
        {
          id: `OWNER_SIM_${Date.now()}`,
          name: 'Zameer Akhtar Khan',
          vernacularName: 'ज़मीर अख्तर खां',
          fatherOrSpouseName: 'Late Akhtar Khan',
          relationType: 'S/O',
          shareRatio: '1/2 (50%)',
          shareFraction: 0.5,
          aadhaarHash: 'XXXX-XXXX-9901',
          residence: activeRecord.revenueVillage
        }
      ];
    } else {
      simulated = activeRecord.owners.map((o, idx) => {
        if (idx === 0) return { ...o, shareRatio: '3/4 (75%)', shareFraction: 0.75 };
        if (idx === 1) return { ...o, shareRatio: '1/2 (50%)', shareFraction: 0.5 };
        return o;
      });
    }

    updateActiveRecord({ owners: simulated });
    setIsRecentlyNormalized(false);
    setShowSuccessToast('Simulated 125% co-owner discrepancy (UP Rev. Code Sec. 31 violation)');
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  // Administrative Hierarchy Cascading Computations
  const availableStates = useMemo(() => getAvailableStates(), []);

  const normState = useMemo(() => normalizeStateName(activeRecord.state), [activeRecord.state]);
  const availableDistricts = useMemo(() => getDistrictsForState(normState), [normState]);

  const normDistrict = useMemo(
    () => normalizeDistrictName(normState, activeRecord.district),
    [normState, activeRecord.district]
  );
  const availableTehsils = useMemo(
    () => getTehsilsForDistrict(normState, normDistrict),
    [normState, normDistrict]
  );

  const normTehsil = useMemo(
    () => normalizeTehsilName(normState, normDistrict, activeRecord.tehsil),
    [normState, normDistrict, activeRecord.tehsil]
  );
  const availableVillages = useMemo(
    () => getVillagesForTehsil(normState, normDistrict, normTehsil),
    [normState, normDistrict, normTehsil]
  );

  // Administrative Hierarchy Selection Handlers
  const handleStateSelect = (newState: string) => {
    const districts = getDistrictsForState(newState);
    const newDistrict = districts[0]?.key || '';
    const tehsils = getTehsilsForDistrict(newState, newDistrict);
    const newTehsil = tehsils[0]?.key || '';
    const villages = getVillagesForTehsil(newState, newDistrict, newTehsil);
    const newVillage = villages[0] || '';

    updateActiveRecord({
      state: newState,
      district: newDistrict,
      tehsil: newTehsil,
      revenueVillage: newVillage
    });
  };

  const handleDistrictSelect = (newDistrict: string) => {
    const tehsils = getTehsilsForDistrict(normState, newDistrict);
    const newTehsil = tehsils[0]?.key || '';
    const villages = getVillagesForTehsil(normState, newDistrict, newTehsil);
    const newVillage = villages[0] || '';

    updateActiveRecord({
      district: newDistrict,
      tehsil: newTehsil,
      revenueVillage: newVillage
    });
  };

  const handleTehsilSelect = (newTehsil: string) => {
    const villages = getVillagesForTehsil(normState, normDistrict, newTehsil);
    const newVillage = villages[0] || '';

    updateActiveRecord({
      tehsil: newTehsil,
      revenueVillage: newVillage
    });
  };

  const handleVillageSelect = (newVillage: string) => {
    updateActiveRecord({
      revenueVillage: newVillage
    });
  };

  // Workflow Handlers
  const handlePatwariVerify = async () => {
    await approveByPatwari(patwariNotes);
    setShowSuccessToast('Record verified by Revenue Inspector and escalated to Tehsildar.');
    setTimeout(() => setShowSuccessToast(null), 3500);
  };

  const handleTehsildarApprove = async () => {
    await approveByTehsildar();
    setShowSuccessToast('Record legally approved with NIC Digital Signature and synchronized to Central DILRMP Database!');
    setTimeout(() => setShowSuccessToast(null), 4000);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason) return;
    await rejectRecord(rejectReason);
    setRejectModalOpen(false);
    setRejectReason('');
    setShowSuccessToast('Record marked as disputed/rejected in audit ledger.');
    setTimeout(() => setShowSuccessToast(null), 3500);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-card text-slate-800 dark:text-slate-200">
      {/* Toast Alert */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between z-50 shadow-md"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {showSuccessToast}
            </span>
            <button onClick={() => setShowSuccessToast(null)} className="text-white/80 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Header */}
      <div className="bg-slate-50 dark:bg-slate-950 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm">{activeRecord.documentTitle}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeRecord.status === 'APPROVED_TEHSILDAR' || activeRecord.status === 'SYNCED_LRMS'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : activeRecord.status === 'DISPUTED'
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
              }`}
            >
              {activeRecord.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Record ID: {activeRecord.recordNumber} | Confidence: {activeRecord.overallConfidence}%
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <div className="text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Mean OCR CRR: </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{activeRecord.characterAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Form Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
        {/* Role Banner: Citizen Read-Only Mode */}
        {userRole === 'CITIZEN' && (
          <div className="rounded-2xl border border-sky-500/40 bg-sky-950/30 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-sky-200 shadow-sm">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="font-bold text-sky-100">Public Citizen RoR View Mode (Read-Only)</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Public access view for certified Record of Rights. Modifications require Form 11 objection petition.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('CITIZEN_PORTAL')}
              className="text-[11px] bg-sky-600 hover:bg-sky-500 text-white font-semibold px-3 py-1.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Open Certified RoR Portal</span>
            </button>
          </div>
        )}

        {/* Role Banner: Tehsildar Statutory Review Mode */}
        {(userRole === 'TEHSILDAR' || userRole === 'ADMIN') && (
          <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/30 dark:bg-indigo-950/40 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-200 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-100">Statutory Revenue Judicial Review Mode (Tehsildar / SDM)</span>
                  <span className="text-[9px] font-mono font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-500/50 px-2 py-0.5 rounded-full">
                    NIC-DSC-KEY
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Reviewing on-field verification submitted by Patwari/Lekhpal. Verify co-owner shares below and apply Central NIC Digital Signature (DSC) to legally sanction mutation.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" /> Patwari Inspected
              </span>
            </div>
          </div>
        )}

        {/* P1.2 HEADLINE CALLOUT: STATUTORY SHARE MISMATCH & AUTO-NORMALIZE */}
        {hasShareMismatch && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            aria-live="polite"
            className="rounded-2xl border-2 border-rose-500/60 bg-gradient-to-br from-rose-950/80 via-slate-900/95 to-amber-950/60 p-4.5 shadow-xl text-white space-y-3.5 relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5 animate-pulse">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/30 text-rose-200 border border-rose-500/50 shadow-xs">
                      CRITICAL STATUTORY VIOLATION (UP REVENUE CODE SEC. 31)
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 bg-black/50 px-2 py-0.5 rounded border border-white/10">
                      DILRMP RULE 14
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Co-Owner Khata Area Share Inconsistency:</span>
                    <span className="text-rose-300 font-mono font-extrabold text-base">{(totalShareSum * 100).toFixed(2)}%</span>
                    <span className="text-rose-400 text-xs font-normal">
                      (Exceeds Permissible Unity 100.00% by +{((totalShareSum - 1.0) * 100).toFixed(2)}%)
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Under Section 31 of the UP Revenue Code 2006, partitioned co-owner shares in a joint Khata must equate strictly to 1.0000 (100.00%). A discrepancy of {((totalShareSum - 1.0) * 100).toFixed(2)}% creates an invalid cadastral split, legally corrupting the Record of Rights and freezing automated land registry sync.
                  </p>
                </div>
              </div>

              {/* Single-Click Auto-Normalize Action */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAutoFixShares}
                disabled={userRole === 'CITIZEN'}
                className="shrink-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 border border-emerald-400/40 flex items-center gap-2 transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                title="Automatically normalize co-owner shares proportionally to exactly 100.00% and append SHA-256 block to audit ledger"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
                <span>Auto-Normalize Shares Proportionally (100.00%)</span>
              </motion.button>
            </div>

            {/* Visual Balance Bar */}
            <div className="bg-black/50 rounded-xl p-2.5 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-[11px]">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="text-slate-400 font-medium shrink-0">Share Allocation:</span>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (100 / (totalShareSum * 100)) * 100)}%` }} 
                  />
                  <div 
                    className="bg-rose-500 h-full animate-pulse transition-all duration-500" 
                    style={{ width: `${Math.max(0, 100 - (100 / (totalShareSum * 100)) * 100)}%` }} 
                  />
                </div>
              </div>
              <div className="font-mono font-bold text-rose-300 shrink-0">
                Current: {(totalShareSum * 100).toFixed(2)}% | Target: 100.00%
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Banner when recently normalized or balanced */}
        {!hasShareMismatch && (isRecentlyNormalized || isShareValid) && activeRecord.owners.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-300 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="font-semibold text-emerald-200">Statutory Share Balance Verified (100.00%):</strong> Co-owner allocations strictly satisfy UP Revenue Code Sec. 31 & DILRMP Rule 14.
              </span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              TAMPER AUDIT LOGGED
            </span>
          </motion.div>
        )}

        {/* Validation Issues / Anomaly Alerts Panel (Non-duplicate issues) */}
        {activeRecord.validationIssues && activeRecord.validationIssues.some(i => i.ruleCode !== 'BR_REV_001_SHARE_MISMATCH') && (
          <div className="space-y-2.5">
            {activeRecord.validationIssues.filter(i => i.ruleCode !== 'BR_REV_001_SHARE_MISMATCH').map((issue) => (
              <div
                key={issue.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                  issue.severity === 'CRITICAL'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : issue.severity === 'WARNING'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>{issue.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-black/40 rounded border border-white/10">
                        {issue.ruleCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{issue.message}</p>
                    {issue.suggestedFix && (
                      <div className="text-[10px] text-amber-300/90 mt-1 font-medium flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Suggested Action: {issue.suggestedFix}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section 1: Administrative Hierarchy & Location Dropdowns */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              {t('adminHierarchy')}
            </div>

            {/* Toggle between Cascading Dropdowns and Manual Freeform Edit */}
            <button
              type="button"
              onClick={() => setIsManualLocationInput(!isManualLocationInput)}
              className="text-[10px] bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-medium"
              title="Toggle between dropdown directory and custom text entry"
            >
              {isManualLocationInput ? (
                <>
                  <ListFilter className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                  <span>Use Dropdown Directory</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                  <span>Manual Text Input</span>
                </>
              )}
            </button>
          </div>

          {isManualLocationInput ? (
            /* Freeform Text Inputs */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">{t('stateLabel')}</label>
                <input
                  type="text"
                  value={activeRecord.state}
                  onChange={(e) => updateRecordField('state', e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">{t('districtLabel')}</label>
                <input
                  type="text"
                  value={activeRecord.district}
                  onChange={(e) => updateRecordField('district', e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">{t('tehsilLabel')}</label>
                <input
                  type="text"
                  value={activeRecord.tehsil}
                  onChange={(e) => updateRecordField('tehsil', e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">{t('villageLabel')}</label>
                <input
                  type="text"
                  value={activeRecord.revenueVillage}
                  onChange={(e) => updateRecordField('revenueVillage', e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>
          ) : (
            /* Cascading Interactive Dropdowns */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. State Dropdown */}
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 flex items-center justify-between">
                  <span>{t('stateLabel')}</span>
                  <span className="text-[9px] text-brand-600 dark:text-brand-400 font-mono font-semibold">DILRMP</span>
                </label>
                <select
                  value={normState}
                  onChange={(e) => handleStateSelect(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium cursor-pointer"
                >
                  {availableStates.map((s) => (
                    <option key={s.key} value={s.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. District Dropdown */}
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 flex items-center justify-between">
                  <span>{t('districtLabel')}</span>
                  <span className="text-[9px] text-slate-400 font-mono">({availableDistricts.length} Districts)</span>
                </label>
                <select
                  value={
                    availableDistricts.some(d => d.key === activeRecord.district || d.label.includes(activeRecord.district))
                      ? normDistrict
                      : (activeRecord.district || normDistrict)
                  }
                  onChange={(e) => handleDistrictSelect(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium cursor-pointer"
                >
                  {!availableDistricts.some(d => d.key === normDistrict) && activeRecord.district && (
                    <option value={activeRecord.district} className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-300 font-bold">
                      {activeRecord.district} (Extracted)
                    </option>
                  )}
                  {availableDistricts.map((d) => (
                    <option key={d.key} value={d.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Tehsil / Taluk Dropdown */}
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 flex items-center justify-between">
                  <span>{t('tehsilLabel')}</span>
                  <span className="text-[9px] text-slate-400 font-mono">({availableTehsils.length} Tehsils)</span>
                </label>
                <select
                  value={
                    availableTehsils.some(t => t.key === activeRecord.tehsil || t.label.includes(activeRecord.tehsil))
                      ? normTehsil
                      : (activeRecord.tehsil || normTehsil)
                  }
                  onChange={(e) => handleTehsilSelect(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium cursor-pointer"
                >
                  {!availableTehsils.some(t => t.key === normTehsil) && activeRecord.tehsil && (
                    <option value={activeRecord.tehsil} className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-300 font-bold">
                      {activeRecord.tehsil} (Extracted)
                    </option>
                  )}
                  {availableTehsils.map((t) => (
                    <option key={t.key} value={t.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Revenue Village Dropdown */}
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 flex items-center justify-between">
                  <span>{t('villageLabel')}</span>
                  <span className="text-[9px] text-slate-400 font-mono">({availableVillages.length} Villages)</span>
                </label>
                <select
                  value={activeRecord.revenueVillage}
                  onChange={(e) => handleVillageSelect(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium cursor-pointer"
                >
                  {!availableVillages.includes(activeRecord.revenueVillage) && activeRecord.revenueVillage && (
                    <option value={activeRecord.revenueVillage} className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-300 font-bold">
                      {activeRecord.revenueVillage} (Extracted)
                    </option>
                  )}
                  {availableVillages.map((v) => (
                    <option key={v} value={v} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Land Identifiers & Universal Area Converter */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              {t('landIdentifiers')}
            </div>

            {/* Area Unit Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Unit:</span>
              <select
                value={activeUnit}
                onChange={(e) => handleUnitChange(e.target.value as AreaUnit)}
                className="bg-transparent text-brand-600 dark:text-brand-400 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="HECTARE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Hectares (ha)</option>
                <option value="ACRE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Acres (ac)</option>
                <option value="BIGHA" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Bigha (UP/MP Pucca)</option>
                <option value="GUNTHA" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Guntha (MH/KA)</option>
                <option value="SQ_METER" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Sq. Meters</option>
                <option value="SQ_FEET" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Sq. Feet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">{t('khataNoLabel')}</label>
              <input
                type="text"
                value={activeRecord.khataNumber}
                onChange={(e) => updateRecordField('khataNumber', e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">{t('khasraNoLabel')}</label>
              <input
                type="text"
                value={activeRecord.khasraNumber}
                onChange={(e) => updateRecordField('khasraNumber', e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                {t('plotAreaLabel')} ({UNIT_LABELS[activeUnit as keyof typeof UNIT_LABELS]?.symbol || 'ha'})
              </label>
              <input
                type="number"
                step="0.0001"
                value={activeRecord.plotAreaOriginal}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  const inHectares = convertArea(val, activeUnit, 'HECTARE');
                  updateActiveRecord({
                    plotAreaOriginal: val,
                    plotAreaHectares: inHectares
                  });
                }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-brand-600 dark:text-brand-400 font-mono font-bold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">{t('landClassLabel')}</label>
              <select
                value={activeRecord.landClassification}
                onChange={(e) => updateRecordField('landClassification', e.target.value as LandClassification)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium cursor-pointer"
              >
                <option value="AGRICULTURAL_IRRIGATED">Agricultural (Irrigated)</option>
                <option value="AGRICULTURAL_UNIRRIGATED">Agricultural (Unirrigated)</option>
                <option value="NON_AGRICULTURAL_RESIDENTIAL">Non-Agri (Residential)</option>
                <option value="COMMERCIAL_INDUSTRIAL">Commercial / Industrial</option>
                <option value="GOVERNMENT_GRAM_SABHA">Govt / Gram Sabha</option>
                <option value="FOREST_PROTECTED">Forest (Protected)</option>
                <option value="WATERBODY_WETLAND">Waterbody / Wetland</option>
                <option value="WAKF_RELIGIOUS_TRUST">Wakf / Religious Trust</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Registered Landowners & Live Share Sum Checker */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              {t('landownersTitle')}
            </div>

            {/* Live Share Math Validator Badge & Demo Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
                  isShareValid
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40 animate-pulse'
                }`}
              >
                {isShareValid ? <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-rose-500" />}
                Total Share: {(totalShareSum * 100).toFixed(1)}% {isShareValid ? '(Balanced 100%)' : '(Discrepancy)'}
              </span>

              {!isShareValid && (
                <button
                  type="button"
                  onClick={handleAutoFixShares}
                  disabled={userRole === 'CITIZEN'}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow transition cursor-pointer disabled:opacity-50"
                  title="Auto-distribute shares proportionally to 100%"
                >
                  <Zap className="w-3 h-3 text-amber-300 fill-amber-300" /> Auto-Normalize
                </button>
              )}

              {/* Demo Re-Trigger Button for Hackathon Judges */}
              <button
                type="button"
                onClick={handleSimulateDiscrepancy}
                disabled={userRole === 'CITIZEN'}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                title="Simulate 125% co-owner discrepancy to test validation rule live"
              >
                <RotateCcw className="w-3 h-3 text-amber-500" />
                <span>Simulate 125% Discrepancy</span>
              </button>

              <button
                type="button"
                onClick={handleAddOwner}
                disabled={userRole === 'CITIZEN'}
                className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1 shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3 h-3" /> {t('addCoOwner')}
              </button>
            </div>
          </div>

          {/* Owners Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-3 py-2">Owner Name (English / Vernacular)</th>
                  <th className="px-3 py-2">Father / Spouse Name</th>
                  <th className="px-3 py-2 min-w-[210px]">Share Ratio (Fraction ⇄ %)</th>
                  <th className="px-3 py-2">Aadhaar Hash</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {activeRecord.owners.map((owner, idx) => {
                  const parsedShare = extractFractionAndPercentage(owner.shareRatio);
                  return (
                    <tr key={owner.id || idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                      <td className="px-3 py-2 min-w-[240px]">
                        {/* Primary English Name Input */}
                        <input
                          type="text"
                          value={owner.name}
                          onChange={(e) => handleOwnerChange(idx, 'name', e.target.value)}
                          placeholder="Owner Name in English (e.g. Suryansh Mittal)"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                        {/* Secondary Vernacular Name Input */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-mono shrink-0 flex items-center gap-0.5">
                            <span>Vernacular:</span>
                          </span>
                          <input
                            type="text"
                            value={owner.vernacularName || ''}
                            onChange={(e) => handleOwnerChange(idx, 'vernacularName', e.target.value)}
                            placeholder="क्षेत्रीय भाषा (e.g. सूर्यांश मित्तल)"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 text-[11px] text-brand-700 dark:text-brand-300 font-sans focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2 min-w-[180px]">
                        <input
                          type="text"
                          value={owner.fatherOrSpouseName}
                          onChange={(e) => handleOwnerChange(idx, 'fatherOrSpouseName', e.target.value)}
                          placeholder="Father / Spouse Name"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                      </td>
                      <td className="px-3 py-2 min-w-[210px]">
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg p-1 shadow-inner">
                          {/* Fraction input */}
                          <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/40 transition">
                            <input
                              type="text"
                              value={parsedShare.fractionStr}
                              onChange={(e) => handleOwnerFractionChange(idx, e.target.value)}
                              placeholder="1/4"
                              title="Fractional Share (e.g. 1/4, 1/2, 2/3, 3/4)"
                              className="w-full bg-transparent text-xs text-brand-600 dark:text-brand-400 font-mono font-bold focus:outline-none text-center"
                            />
                          </div>

                          {/* Bidirectional Sync Indicator */}
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold select-none px-0.5" title="Bidirectional live sync between Fraction and Percentage">⇄</span>

                          <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-1 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/40 transition">
                            <input
                              type="number"
                              step="any"
                              min="0"
                              max="100"
                              value={parsedShare.percentageStr}
                              onChange={(e) => handleOwnerPercentageChange(idx, e.target.value)}
                              placeholder="25"
                              title="Percentage Share (e.g. 25, 50, 33.33, 75)"
                              className="w-full bg-transparent text-xs text-brand-600 dark:text-brand-400 font-mono font-bold focus:outline-none text-right pr-0.5"
                            />
                            <span className="text-[10px] text-slate-400 font-bold select-none">%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={owner.aadhaarHash || ''}
                          onChange={(e) => handleOwnerChange(idx, 'aadhaarHash', e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-300 font-mono focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                          placeholder="XXXX-XXXX-1234"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        {activeRecord.owners.length > 1 && (
                          <button
                            onClick={() => handleRemoveOwner(idx)}
                            className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 p-1 transition"
                            title="Remove Owner"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Mutation Records & Encumbrances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mutation */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                {t('mutationTitle')}
              </div>
              {activeRecord.mutations && activeRecord.mutations.length > 0 && (
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    const updatedMutations = activeRecord.mutations.map((m, i) =>
                      i === 0
                        ? {
                            ...m,
                            orderDate: today,
                            mutationNo: `${today.replace(/-/g, '')}00421`
                          }
                        : m
                    );
                    updateActiveRecord({ mutations: updatedMutations });
                    setShowSuccessToast('Mutation order date synced to current date!');
                    setTimeout(() => setShowSuccessToast(null), 3000);
                  }}
                  className="text-[10px] bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-lg border border-amber-500/40 flex items-center gap-1 transition font-medium"
                  title="Sync mutation date to current date"
                >
                  <Calendar className="w-3 h-3" /> Sync Today
                </button>
              )}
            </div>
            {activeRecord.mutations && activeRecord.mutations.length > 0 ? (
              <div className="bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-2 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Order No:</span>
                  <input
                    type="text"
                    value={activeRecord.mutations[0].mutationNo}
                    onChange={(e) => {
                      const updatedMutations = [...activeRecord.mutations];
                      updatedMutations[0] = { ...updatedMutations[0], mutationNo: e.target.value };
                      updateActiveRecord({ mutations: updatedMutations });
                    }}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-[11px] font-mono text-slate-900 dark:text-white font-bold text-right focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Date & Type:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="date"
                      value={activeRecord.mutations[0].orderDate}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        const updatedMutations = [...activeRecord.mutations];
                        updatedMutations[0] = {
                          ...updatedMutations[0],
                          orderDate: newDate,
                          mutationNo: `${newDate.replace(/-/g, '')}00421`
                        };
                        updateActiveRecord({ mutations: updatedMutations });
                      }}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                    <span className="text-slate-400 dark:text-slate-500 text-[10px]">({activeRecord.mutations[0].transferType})</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Authority:</span>
                  <input
                    type="text"
                    value={activeRecord.mutations[0].sanctioningAuthority}
                    onChange={(e) => {
                      const updatedMutations = [...activeRecord.mutations];
                      updatedMutations[0] = { ...updatedMutations[0], sanctioningAuthority: e.target.value };
                      updateActiveRecord({ mutations: updatedMutations });
                    }}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-800 dark:text-slate-300 text-right focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 py-2">No pending or prior mutations recorded.</div>
            )}
          </div>

          {/* Encumbrance */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              {t('encumbranceTitle')}
            </div>
            {activeRecord.encumbrances && activeRecord.encumbrances.length > 0 ? (
              <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-300 dark:border-rose-500/30 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-rose-700 dark:text-rose-300 font-bold">ACTIVE BANK LIEN:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">₹{activeRecord.encumbrances[0].loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-slate-700 dark:text-slate-300">{activeRecord.encumbrances[0].bankOrCreditorName}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Ref: {activeRecord.encumbrances[0].referenceNo}</div>
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-300 dark:border-emerald-500/30 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                ✓ Non-Encumbered (भारमुक्त) - Clear title with zero active bank mortgages.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role-Based Action Footer */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className="text-[11px] bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors font-medium shadow-sm"
            title="Cancel / Exit Verification and return to Executive Command"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            Executive Command
          </button>

          <button
            onClick={() => {
              queueActiveLearningCorrection(
                activeRecord.ocrBoundingBoxes[0]?.extractedValue || '',
                activeRecord.khasraNumber,
                'khasraNumber',
                'Khasra No'
              );
              setShowSuccessToast('Submitted token pair to Active Learning Retraining Queue!');
              setTimeout(() => setShowSuccessToast(null), 3000);
            }}
            className="text-[11px] bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm font-medium"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            {t('sendAiFeedback')}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {userRole !== 'CITIZEN' && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setRejectModalOpen(true)}
              className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700/50 px-3.5 py-2 rounded-xl font-semibold transition-colors shadow-sm cursor-pointer"
            >
              {userRole === 'TEHSILDAR' ? 'Return with Objections' : t('flagDispute')}
            </motion.button>
          )}

          {(userRole === 'PATWARI' || userRole === 'OPERATOR') && (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePatwariVerify}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-card flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Verify and stamp on-field transcription, then submit to Tehsildar for statutory sanction"
              >
                <UserCheck className="w-4 h-4" />
                <span>Verify & Submit to Tehsildar</span>
              </motion.button>

              <div
                className="hidden sm:flex opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 items-center gap-1.5 text-xs select-none"
                title="Digital DSC Signature requires Sub-Divisional Magistrate / Tehsildar statutory login"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>NIC DSC Token (Tehsildar Only)</span>
              </div>
            </>
          )}

          {(userRole === 'TEHSILDAR' || userRole === 'ADMIN') && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleTehsildarApprove}
              className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white font-bold px-5 py-2 rounded-xl shadow-lg shadow-indigo-900/30 border border-amber-400/40 flex items-center gap-2 transition-all cursor-pointer"
              title="Apply NIC Digital Signature Token (DSC) to legally sanction this mutation under UP Revenue Code"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>Digitally Sign & Sanction Mutation (NIC e-Sign DSC Token)</span>
            </motion.button>
          )}

          {userRole === 'CITIZEN' && (
            <button
              onClick={() => setActiveTab('CITIZEN_PORTAL')}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Open Certified Copy Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* Dispute / Reject Reason Modal */}
      <AnimatePresence>
        {rejectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Flag Record for Revenue Officer Dispute
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter grounds of objection (e.g. area mismatch, pending civil litigation stay, duplicate survey allocation, fraudulent patta claim).
              </p>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="State clear legal/survey grounds for rejection..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason}
                  className="px-4 py-2 text-xs rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold disabled:opacity-50 transition-colors shadow-sm"
                >
                  Confirm Objection
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
