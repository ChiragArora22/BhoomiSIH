import React from 'react';
import { LandRecordProvider, useLandRecord } from './context/LandRecordContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { PreprocessingStudio } from './components/digitization/PreprocessingStudio';
import { SplitVerificationEditor } from './components/digitization/SplitVerificationEditor';
import { CadastralMapViewer } from './components/gis/CadastralMapViewer';
import { ActiveLearningDashboard } from './components/learning/ActiveLearningDashboard';
import { ApiExplorer } from './components/integration/ApiExplorer';
import { AuditTrailLedger } from './components/audit/AuditTrailLedger';
import { CitizenPortalView } from './components/citizen/CitizenPortalView';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { GuidedDemoOverlay } from './components/common/GuidedDemoOverlay';
import { ResponsiveNoticeBanner } from './components/common/ResponsiveNoticeBanner';

import { AnimatePresence, motion } from 'framer-motion';

const MainContent: React.FC = () => {
  const { activeTab } = useLandRecord();

  return (
    <main className="flex-1 overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="h-full w-full"
        >
          {activeTab === 'DASHBOARD' && <ExecutiveDashboard />}
          {activeTab === 'DIGITIZE_STUDIO' && <PreprocessingStudio />}
          {activeTab === 'SPLIT_VERIFY' && <SplitVerificationEditor />}
          {activeTab === 'CADASTRAL_GIS' && <CadastralMapViewer />}
          {activeTab === 'ACTIVE_LEARNING' && <ActiveLearningDashboard />}
          {activeTab === 'LRMS_API_HUB' && <ApiExplorer />}
          {activeTab === 'AUDIT_LEDGER' && <AuditTrailLedger />}
          {activeTab === 'CITIZEN_PORTAL' && <CitizenPortalView />}
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
