import React, { Suspense } from 'react';
import { LandRecordProvider, useLandRecord } from './context/LandRecordContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { SplitVerificationEditor } from './components/digitization/SplitVerificationEditor';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { GuidedDemoOverlay } from './components/common/GuidedDemoOverlay';
import { ResponsiveNoticeBanner } from './components/common/ResponsiveNoticeBanner';

import { AnimatePresence, motion } from 'framer-motion';

// Lazy-loaded heavy modules for payload reduction (> 150 kB drop from initial chunk)
const CadastralMapViewer = React.lazy(() => 
  import('./components/gis/CadastralMapViewer').then(m => ({ default: m.CadastralMapViewer }))
);
const AuditTrailLedger = React.lazy(() => 
  import('./components/audit/AuditTrailLedger').then(m => ({ default: m.AuditTrailLedger }))
);
const ActiveLearningDashboard = React.lazy(() => 
  import('./components/learning/ActiveLearningDashboard').then(m => ({ default: m.ActiveLearningDashboard }))
);
const ApiExplorer = React.lazy(() => 
  import('./components/integration/ApiExplorer').then(m => ({ default: m.ApiExplorer }))
);
const CitizenPortalView = React.lazy(() => 
  import('./components/citizen/CitizenPortalView').then(m => ({ default: m.CitizenPortalView }))
);
const PreprocessingStudio = React.lazy(() => 
  import('./components/digitization/PreprocessingStudio').then(m => ({ default: m.PreprocessingStudio }))
);

const TabSkeletonLoader: React.FC = () => (
  <div className="h-full w-full p-6 space-y-6 overflow-y-auto bg-[var(--bg-base)] animate-pulse" role="status" aria-label="Loading module content">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-6 w-56 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-3.5 w-80 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
      <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-7 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-7 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-7 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
    <div className="h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl" />
  </div>
);

const MainContent: React.FC = () => {
  const { activeTab } = useLandRecord();

  return (
    <main id="main" className="flex-1 overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="h-full w-full"
        >
          <Suspense fallback={<TabSkeletonLoader />}>
            {activeTab === 'DASHBOARD' && <ExecutiveDashboard />}
            {activeTab === 'DIGITIZE_STUDIO' && <PreprocessingStudio />}
            {activeTab === 'SPLIT_VERIFY' && <SplitVerificationEditor />}
            {activeTab === 'CADASTRAL_GIS' && <CadastralMapViewer />}
            {activeTab === 'ACTIVE_LEARNING' && <ActiveLearningDashboard />}
            {activeTab === 'LRMS_API_HUB' && <ApiExplorer />}
            {activeTab === 'AUDIT_LEDGER' && <AuditTrailLedger />}
            {activeTab === 'CITIZEN_PORTAL' && <CitizenPortalView />}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <LandRecordProvider>
      <div className="flex flex-col min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased font-sans selection:bg-indigo-600 selection:text-white">
        <Header />
        <ResponsiveNoticeBanner />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <ErrorBoundary fallbackTitle="Workflow View Encountered an Issue">
            <MainContent />
          </ErrorBoundary>
        </div>
        <Footer />
        <GuidedDemoOverlay />
      </div>
    </LandRecordProvider>
  );
};

export default App;
