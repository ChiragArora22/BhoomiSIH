import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import { LandRecord } from '../../types/landRecord';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } }
};
import {
  Users,
  Search,
  FileCheck2,
  Download,
  Printer,
  ShieldCheck,
  Building,
  CheckCircle2,
  Layers,
  Sparkles,
  QrCode,
  Lock
} from 'lucide-react';

export const CitizenPortalView: React.FC = () => {
  const { records, setActiveRecordId, setActiveTab, t } = useLandRecord();

  const [searchDistrict, setSearchDistrict] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRecordForView, setSelectedRecordForView] = useState<LandRecord | null>(records[0]);
  const [downloadModal, setDownloadModal] = useState(false);

  const filtered = records.filter(r => {
    const matchesDistrict = searchDistrict === 'ALL' || r.district.toLowerCase().includes(searchDistrict.toLowerCase());
    const matchesKeyword = !searchKeyword ||
      r.khasraNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      r.khataNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      r.revenueVillage.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      r.owners.some(o => o.name.toLowerCase().includes(searchKeyword.toLowerCase()) || (o.vernacularName && o.vernacularName.includes(searchKeyword)));
    return matchesDistrict && matchesKeyword;
  });

  // Automatically keep selectedRecord in sync with filtered search results
  React.useEffect(() => {
    if (filtered.length > 0) {
      if (!selectedRecordForView || !filtered.some(r => r.id === selectedRecordForView.id)) {
        setSelectedRecordForView(filtered[0]);
      }
    } else {
      setSelectedRecordForView(null);
    }
  }, [searchKeyword, searchDistrict, filtered.length]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-85px)] bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Citizen Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 border border-slate-700/60 rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-200 border border-brand-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            Digital India Public Land Records Portal (नागरिक भू-अभिलेख सेवा)
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {t('citizenTitle')}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {t('citizenSubtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950/60 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{t('legalValid')}</span>
        </div>
      </div>

      {/* Citizen Search Controls */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Select Territory / District</label>
            <select
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="ALL">All Districts / All States</option>
              <option value="Lucknow">Lucknow, Uttar Pradesh</option>
              <option value="Pune">Pune (Mulshi), Maharashtra</option>
              <option value="Chengalpattu">Chengalpattu, Tamil Nadu</option>
              <option value="Ranga Reddy">Ranga Reddy, Telangana</option>
              <option value="Rampur">Rampur, Uttar Pradesh</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Search by Khasra No, Khata No, Village, or Owner Name
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="e.g. 342/1, Ramesh Chandra, Paud, 184/2A..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid & Certificate Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Matching Land Records List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Search Results ({filtered.length})</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Click to inspect RoR</span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3 max-h-[500px] overflow-y-auto pr-1"
          >
            {filtered.length === 0 ? (
              <div className="p-8 text-center space-y-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    No Land Records Found
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                    No records matched "{searchKeyword}" in {searchDistrict === 'ALL' ? 'any territory' : searchDistrict}. Try searching for "342/1", "Ramesh Chandra", or "Paud".
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSearchKeyword(''); setSearchDistrict('ALL'); }}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              filtered.map((r) => (
                <motion.div
                  key={r.id}
                  variants={cardVariants}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedRecordForView(r)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    selectedRecordForView?.id === r.id
                      ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-slate-900 dark:text-white shadow-card'
                      : 'bg-slate-50/80 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{r.recordNumber.split('-').slice(0, 2).join('-')}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">{r.documentYear}</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{r.documentTitle}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Village: {r.revenueVillage.split(' ')[0]} | Khasra: {r.khasraNumber} | Area: {r.plotAreaOriginal} {r.plotAreaUnit}
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 font-medium">
                    Owner: {r.owners[0]?.vernacularName || r.owners[0]?.name}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Right 7 Cols: Official Certified Copy Preview */}
        <AnimatePresence mode="wait">
          {selectedRecordForView ? (
            <motion.div
              key={selectedRecordForView.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      Government Certified Record of Rights (RoR)
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      NIC DILRMP Verification ID: {selectedRecordForView.id}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handlePrint}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" /> {t('printRor')}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setDownloadModal(true)}
                      className="bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-card transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> {t('downloadPdf')}
                    </motion.button>
                  </div>
                </div>

                {/* Printable Certificate Sheet Visual */}
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs font-sans">
                  {/* Emblem & Watermark Header */}
                  <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-3 space-y-1">
                    <div className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest font-mono">
                      GOVERNMENT OF INDIA • REVENUE DEPARTMENT
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {selectedRecordForView.documentTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      State: {selectedRecordForView.state} | District: {selectedRecordForView.district} | Tehsil: {selectedRecordForView.tehsil}
                    </div>
                  </div>

                  {/* Key Record Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[9px]">KHATA NO.</span>
                      <span className="text-slate-900 dark:text-white font-bold">{selectedRecordForView.khataNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[9px]">KHASRA / GAT NO.</span>
                      <span className="text-brand-600 dark:text-brand-400 font-bold">{selectedRecordForView.khasraNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[9px]">TOTAL AREA</span>
                      <span className="text-slate-900 dark:text-white font-bold">{selectedRecordForView.plotAreaOriginal} {selectedRecordForView.plotAreaUnit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[9px]">CLASSIFICATION</span>
                      <span className="text-teal-600 dark:text-teal-300 font-bold truncate block">{selectedRecordForView.landClassification.split('_')[0]}</span>
                    </div>
                  </div>

                  {/* Registered Landowners Table */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Registered Landowners (खातेदार):</div>
                    <div className="space-y-1">
                      {selectedRecordForView.owners.map((owner, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-[11px]">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{idx + 1}. {owner.vernacularName || owner.name}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] ml-2">({owner.relationType} {owner.fatherOrSpouseName})</span>
                          </div>
                          <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">{owner.shareRatio}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Encumbrance Certificate Status */}
                  <div className="p-2.5 rounded bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-[11px] flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Encumbrance & Bank Mortgage Status:</span>
                    {selectedRecordForView.encumbrances && selectedRecordForView.encumbrances.length > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">Active Bank Lien (₹{selectedRecordForView.encumbrances[0].loanAmount.toLocaleString('en-IN')})</span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Non-Encumbered (Clear Title)</span>
                    )}
                  </div>

                  {/* Digital Signature & QR Stamp Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Digitally Signed by Sub-Divisional Magistrate (SDM)</span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">SHA256-AUTHENTICATED-OK</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setActiveRecordId(selectedRecordForView.id);
                    setActiveTab('SPLIT_VERIFY');
                  }}
                  className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-semibold transition-colors cursor-pointer"
                >
                  Inspect in Officer Verification Studio →
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 shadow-card flex flex-col items-center justify-center text-center space-y-4 min-h-[460px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <FileCheck2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No Record Selected for RoR Inspection
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select a land parcel from the search results on the left, or adjust your search filters to display its officially certified Record of Rights (खतौनी) copy.
                </p>
              </div>
              {filtered.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedRecordForView(filtered[0])}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                >
                  Select First Result ({filtered[0].khasraNumber})
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Download Confirmation Modal */}
      <AnimatePresence>
        {downloadModal && (
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
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs text-slate-700 dark:text-slate-200"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                Download Digitally Certified RoR Extract
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Your certified Record of Rights copy for Khasra <span className="font-bold text-slate-900 dark:text-white">{selectedRecordForView?.khasraNumber}</span> is ready for download with high-resolution digital revenue seal and verification QR code.
              </p>
              <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-brand-600 dark:text-brand-400">
                FILENAME: {selectedRecordForView?.recordNumber}_Certified_RoR.pdf
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDownloadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors"
                >
                  Close
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setDownloadModal(false);
                    window.print();
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-card"
                >
                  <Download className="w-3.5 h-3.5" /> Save / Download Copy
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
