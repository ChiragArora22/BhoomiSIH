import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, X } from 'lucide-react';

export const ResponsiveNoticeBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('bhoomi_desktop_notice_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('bhoomi_desktop_notice_dismissed', 'true');
    } catch {}
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="xl:hidden bg-amber-500/15 dark:bg-amber-950/50 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs flex items-center justify-between gap-3 shadow-xs select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Monitor className="w-3.5 h-3.5" />
          </div>
          <p className="text-[11px] leading-tight">
            <strong className="font-semibold text-amber-800 dark:text-amber-300">Desktop Display Notice: </strong>
            Bhoomi-Setu is optimized for desktop revenue administration consoles (minimum 1280px). For the best experience during judging, please view on a desktop display or landscape tablet.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 rounded-md text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition cursor-pointer shrink-0"
          title="Dismiss notice"
          aria-label="Dismiss desktop display recommendation"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
