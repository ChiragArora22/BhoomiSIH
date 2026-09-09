import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import { UserRole, LanguageCode } from '../../types/landRecord';
import { DocumentUploadModal } from '../digitization/DocumentUploadModal';
import { PrototypeNoticeModal } from '../common/PrototypeNoticeModal';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  Globe, 
  UserCheck, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Sparkles,
  UploadCloud,
  RotateCcw,
  Sun,
  Moon,
  Compass
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    uiLanguage, 
    setUiLanguage, 
    t,
    searchQuery, 
    setSearchQuery,
    records,
    setActiveRecordId,
    activeTab,
    setActiveTab,
    resetToFactoryDefaults,
    theme,
    toggleTheme,
    isDemoModeActive,
    demoStep,
    setDemoModeActive
  } = useLandRecord();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPrototypeModalOpen, setIsPrototypeModalOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('bhoomi_sih_prototype_notice_seen');
  });

  const handleClosePrototypeModal = () => {
    setIsPrototypeModalOpen(false);
    try {
      sessionStorage.setItem('bhoomi_sih_prototype_notice_seen', 'true');
    } catch {}
  };

  const totalDisputes = records.filter(r => r.status === 'DISPUTED' || (r.validationIssues && r.validationIssues.length > 0)).length;
  const pendingReviews = records.filter(r => r.status === 'VERIFICATION_PENDING').length;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setUserRole(newRole);
    if (newRole === 'CITIZEN') {
      setActiveTab('CITIZEN_PORTAL');
    } else if (activeTab === 'CITIZEN_PORTAL') {
      setActiveTab('SPLIT_VERIFY');
    }
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUiLanguage(e.target.value as LanguageCode);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = records.find(r => 
      r.recordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.khasraNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.khataNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.revenueVillage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.owners.some(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || (o.vernacularName && o.vernacularName.includes(searchQuery)))
    );

    if (matched) {
      setActiveRecordId(matched.id);
      setActiveTab('SPLIT_VERIFY');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm dark:shadow-xl">
      {/* Top National Emblem & DILRMP Info Banner (Authoritative Government Seal in both modes) */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between text-slate-300">
        <div className="flex items-center space-x-3">
          <span className="flex items-center font-semibold text-emerald-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
            {t('dilrmpBadge')}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">{t('ministryTitle')}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-amber-400 flex items-center gap-1 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            {t('immutableAudit')}
          </span>
          <button
            type="button"
            onClick={() => setIsPrototypeModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 hover:border-amber-300 text-[11px] font-semibold tracking-wide transition cursor-pointer shadow-xs"
            title="Click to view SIH 2026 Working Prototype & Simulated Data details"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Prototype · Simulated Data</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoModeActive(!isDemoModeActive)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide transition cursor-pointer shadow-xs ${
              isDemoModeActive
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm shadow-indigo-600/40 ring-1 ring-indigo-400/40'
                : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25 hover:border-indigo-300'
            }`}
            title="Toggle Presenter Walkthrough Guide for Judges"
            aria-label="Toggle presenter demo flow"
          >
            <Compass className={`w-3.5 h-3.5 ${isDemoModeActive ? 'animate-spin' : 'text-indigo-400'}`} style={{ animationDuration: '6s' }} />
            <span>{isDemoModeActive ? `Demo Active (Step ${demoStep + 1}/6)` : 'Demo Flow'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <motion.div 
          className="flex items-center space-x-3 cursor-pointer select-none" 
          onClick={() => setActiveTab('DASHBOARD')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 border border-indigo-400/30">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans flex items-center">
                BHOOMI<span className="text-indigo-600 dark:text-indigo-400">-SETU</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-devanagari tracking-wide hidden sm:block">
              {t('brandSubtitle')}
            </p>
          </div>
        </motion.div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label="Search land records by Khasra, Khata, or Owner Name"
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <motion.button 
                type="submit" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Submit search query"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] px-2.5 py-0.5 rounded-lg font-medium transition-colors cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {t('findBtn')}
              </motion.button>
            )}
          </div>
        </form>

        {/* Role Switcher, Language, Theme Toggle & Alert Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Stats Pill */}
          <div className="hidden xl:flex items-center space-x-2 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs select-none">
            <button
              type="button"
              onClick={() => {
                const valRec = records.find(r => r.status === 'APPROVED_TEHSILDAR' || r.status === 'SYNCED_LRMS') || records[0];
                if (valRec) setActiveRecordId(valRec.id);
                setActiveTab('SPLIT_VERIFY');
              }}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline transition cursor-pointer font-medium"
              title="Click to view validated record"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{records.filter(r => r.status === 'APPROVED_TEHSILDAR' || r.status === 'SYNCED_LRMS').length} {t('validatedCount')}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              type="button"
              onClick={() => {
                const pendRec = records.find(r => r.status === 'VERIFICATION_PENDING') || records[0];
                if (pendRec) setActiveRecordId(pendRec.id);
                setActiveTab('SPLIT_VERIFY');
              }}
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline transition cursor-pointer font-medium"
              title="Click to view pending verification record"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{pendingReviews} {t('pendingCount')}</span>
            </button>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mr-1.5" />
            <select
              value={uiLanguage}
              onChange={handleLangChange}
              aria-label="Change interface language"
              className="bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">English (EN)</option>
              <option value="hi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">हिन्दी (Hindi)</option>
              <option value="mr" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">मराठी (Marathi)</option>
              <option value="ta" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">தமிழ் (Tamil)</option>
              <option value="te" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Light / Dark Mode Toggle */}
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, rotate: 20 }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle light or dark theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -6, opacity: 0, rotate: -40 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 6, opacity: 0, rotate: 40 }}
                transition={{ duration: 0.18 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Role Switcher (RBAC Showcase) */}
          <div className={`flex items-center rounded-xl px-2.5 py-1 text-xs border transition-colors shadow-xs ${
            userRole === 'TEHSILDAR'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400/60 text-amber-900 dark:text-amber-200'
              : userRole === 'PATWARI'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400/60 text-emerald-900 dark:text-emerald-200'
              : userRole === 'CITIZEN'
              ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400/60 text-sky-900 dark:text-sky-200'
              : 'bg-slate-100 dark:bg-slate-800/90 border-indigo-500/30 dark:border-indigo-500/40'
          }`}>
            <UserCheck className={`w-3.5 h-3.5 mr-1.5 shrink-0 ${
              userRole === 'TEHSILDAR' ? 'text-amber-600 dark:text-amber-400' :
              userRole === 'PATWARI' ? 'text-emerald-600 dark:text-emerald-400' :
              userRole === 'CITIZEN' ? 'text-sky-600 dark:text-sky-400' :
              'text-indigo-600 dark:text-indigo-400'
            }`} />
            <div className="flex flex-col">
              <span className={`text-[9px] font-bold uppercase leading-tight ${
                userRole === 'TEHSILDAR' ? 'text-amber-700 dark:text-amber-400' :
                userRole === 'PATWARI' ? 'text-emerald-700 dark:text-emerald-400' :
                userRole === 'CITIZEN' ? 'text-sky-700 dark:text-sky-400' :
                'text-indigo-600 dark:text-indigo-400'
              }`}>{t('activeRole')}</span>
              <select
                value={userRole}
                onChange={handleRoleChange}
                aria-label="Switch active administrative role"
                className="bg-transparent text-slate-900 dark:text-slate-100 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="OPERATOR" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('roleOperator')}</option>
                <option value="PATWARI" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('rolePatwari')}</option>
                <option value="TEHSILDAR" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('roleTehsildar')}</option>
                <option value="ADMIN" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('roleAdmin')}</option>
                <option value="CITIZEN" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t('roleCitizen')}</option>
              </select>
            </div>
          </div>

          {/* Ingest Document Quick Button (Brand Primary Indigo) */}
          <motion.button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Upload and ingest land record document"
            className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{t('uploadRecordBtn')}</span>
          </motion.button>

          {/* Reset Saved Session / Factory Defaults */}
          <motion.button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all land records and changes on this device back to default sample dataset?')) {
                resetToFactoryDefaults();
              }
            }}
            whileHover={{ scale: 1.06, rotate: -15 }}
            whileTap={{ scale: 0.9, rotate: -90 }}
            aria-label="Reset all local changes and restore default records"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="Reset All Local Changes & Restore Default Records"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>

          {/* Quick Notifications Trigger */}
          <motion.button 
            type="button"
            onClick={() => setActiveTab('SPLIT_VERIFY')}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            aria-label="View discrepancy validation alerts"
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 group cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="Validation Notifications"
          >
            <Bell className="w-4 h-4 transition-transform group-hover:rotate-12 duration-200" />
            {totalDisputes > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {totalDisputes}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Upload Document Modal */}
      <DocumentUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {/* Prototype Notice Modal (First-load & On-Demand) */}
      <PrototypeNoticeModal isOpen={isPrototypeModalOpen} onClose={handleClosePrototypeModal} />
    </header>
  );
};
