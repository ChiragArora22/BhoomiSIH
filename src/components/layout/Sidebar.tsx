import React from 'react';
import { motion } from 'framer-motion';
import { useLandRecord, ActiveTab } from '../../context/LandRecordContext';
import {
  LayoutDashboard,
  ScanLine,
  SplitSquareVertical,
  MapPin,
  BrainCircuit,
  Server,
  FileCheck2,
  Users,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, records, setActiveRecordId, userRole, t } = useLandRecord();

  const pendingCount = records.filter(r => r.status === 'VERIFICATION_PENDING').length;
  const disputedCount = records.filter(r => r.status === 'DISPUTED' || (r.validationIssues && r.validationIssues.some(i => i.severity === 'CRITICAL'))).length;

  const navItems: {
    id: ActiveTab;
    label: string;
    subLabel: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'DASHBOARD',
      label: t('tabDashboard'),
      subLabel: t('tabDashboardSub'),
      icon: LayoutDashboard
    },
    {
      id: 'DIGITIZE_STUDIO',
      label: t('tabDigitize'),
      subLabel: t('tabDigitizeSub'),
      icon: ScanLine
    },
    {
      id: 'SPLIT_VERIFY',
      label: t('tabVerify'),
      subLabel: t('tabVerifySub'),
      icon: SplitSquareVertical,
      badge: pendingCount,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'CADASTRAL_GIS',
      label: t('tabGis'),
      subLabel: t('tabGisSub'),
      icon: MapPin
    },
    {
      id: 'ACTIVE_LEARNING',
      label: t('tabLearning'),
      subLabel: t('tabLearningSub'),
      icon: BrainCircuit
    },
    {
      id: 'LRMS_API_HUB',
      label: t('tabLrms'),
      subLabel: t('tabLrmsSub'),
      icon: Server
    },
    {
      id: 'AUDIT_LEDGER',
      label: t('tabAudit'),
      subLabel: t('tabAuditSub'),
      icon: FileCheck2
    },
    {
      id: 'CITIZEN_PORTAL',
      label: t('tabCitizen'),
      subLabel: t('tabCitizenSub'),
      icon: Users
    }
  ];

  return (
    <aside className="w-64 bg-white/95 dark:bg-slate-900/90 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-85px)] select-none transition-colors duration-200">
      {/* Navigation Links */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Core Workflows
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileTap={{ scale: 0.98 }}
              aria-label={`${item.label} - ${item.subLabel}`}
              className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-600/15 border border-indigo-200/80 dark:border-indigo-500/30 rounded-xl"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 flex items-center space-x-3">
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs leading-snug">{item.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal leading-tight">{item.subLabel}</div>
                </div>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}

        {disputedCount > 0 ? (
          <div className="pt-2">
            <div 
              onClick={() => {
                const disputedRecord = records.find(r => r.status === 'DISPUTED' || (r.validationIssues && r.validationIssues.some(i => i.severity === 'CRITICAL')));
                if (disputedRecord) setActiveRecordId(disputedRecord.id);
                setActiveTab('SPLIT_VERIFY');
              }}
              className="cursor-pointer mx-1 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-start space-x-2.5 text-xs hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors shadow-sm"
              title="Click to resolve flagged discrepancy in HITL Verification"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[11px]">{t('discrepancyAlertTitle')} ({disputedCount})</span>
                <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 leading-tight block">
                  {t('discrepancyAlertSub')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <div 
              onClick={() => setActiveTab('SPLIT_VERIFY')}
              className="cursor-pointer mx-1 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-start space-x-2.5 text-xs hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors shadow-xs"
              title="All records currently validated"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-[11px]">All Records Validated (0)</span>
                <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 leading-tight block">
                  Mathematical & spatial rules 100% balanced
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Role Indicator & System Footnote */}
      <div className="p-3 border-t border-slate-200/90 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
        <div className="bg-white dark:bg-slate-900/90 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              userRole === 'TEHSILDAR' ? 'bg-amber-500' :
              userRole === 'PATWARI' ? 'bg-emerald-500' :
              userRole === 'CITIZEN' ? 'bg-sky-500' :
              'bg-indigo-500'
            }`}></div>
            <div>
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {userRole === 'TEHSILDAR' ? 'TEHSILDAR / SDM' :
                 userRole === 'PATWARI' ? 'PATWARI / INSPECTOR' :
                 userRole === 'CITIZEN' ? 'CITIZEN PORTAL' :
                 `${userRole} MODE`}
              </div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500">
                {userRole === 'TEHSILDAR' ? 'NIC DSC Signatory' :
                 userRole === 'PATWARI' ? 'Field Verification' :
                 userRole === 'CITIZEN' ? 'Public Search Only' :
                 t('authGovt')}
              </div>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
            userRole === 'TEHSILDAR' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60' :
            userRole === 'PATWARI' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60' :
            userRole === 'CITIZEN' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700/60' :
            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}>
            {userRole === 'TEHSILDAR' ? 'SDM Seal' :
             userRole === 'PATWARI' ? 'Field Insp' :
             userRole === 'CITIZEN' ? 'Public' :
             'Gov-Auth'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
          <span>DILRMP Ver: 3.4.2</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {t('aiOnline')}
          </span>
        </div>
      </div>
    </aside>
  );
};
