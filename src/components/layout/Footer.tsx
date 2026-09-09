import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 px-4 py-2 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <span>© 2024-2026 Smart India Hackathon (SIH) - AI Land Record Modernization Prototype</span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span>DILRMP Modernization Framework (Department of Land Resources)</span>
      </div>
      <div className="flex items-center space-x-4 text-[10px]">
        <span className="text-indigo-600 dark:text-indigo-400 font-mono">Bhoomi Indic OCR Pipeline</span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-amber-600 dark:text-amber-400 font-mono">OCR Processor Active</span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-mono">Cadastral GIS Vector Engine</span>
      </div>
    </footer>
  );
};
