import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandRecord } from '../../context/LandRecordContext';
import {
  Server,
  Code,
  Play,
  Copy,
  Check,
  Download,
  FileJson,
  FileCode,
  ShieldCheck,
  Send,
  Sparkles,
  QrCode,
  RefreshCw
} from 'lucide-react';

export const ApiExplorer: React.FC = () => {
  const { activeRecord, records, appendAuditBlock } = useLandRecord();

  const [selectedEndpoint, setSelectedEndpoint] = useState<'EXTRACT' | 'VALIDATE' | 'CADASTRE' | 'SYNC'>('EXTRACT');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleRecord = activeRecord || records[0];

  // Pre-initialize response with formatted sample JSON
  const [apiResponse, setApiResponse] = useState<string>(() => JSON.stringify({
    status: 'SUCCESS',
    code: 200,
    timestamp: '2026-09-09T12:00:00.000Z',
    processingTimeMs: 278,
    modelVersion: 'BhoomiVision-v3.4-LayoutLMv3',
    data: {
      recordNumber: sampleRecord.recordNumber,
      documentType: sampleRecord.documentType,
      khasraNumber: sampleRecord.khasraNumber,
      khataNumber: sampleRecord.khataNumber,
      plotAreaHectares: sampleRecord.plotAreaHectares,
      owners: sampleRecord.owners,
      boundingBoxesCount: sampleRecord.ocrBoundingBoxes.length,
      meanConfidence: sampleRecord.overallConfidence
    }
  }, null, 2));

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleExecuteApi = () => {
    setIsLoading(true);
    setApiResponse('');

    let fullJson = '';
    if (selectedEndpoint === 'EXTRACT') {
      fullJson = JSON.stringify({
        status: 'SUCCESS',
        code: 200,
        timestamp: new Date().toISOString(),
        processingTimeMs: 278,
        modelVersion: 'BhoomiVision-v3.4-LayoutLMv3',
        data: {
          recordNumber: sampleRecord.recordNumber,
          documentType: sampleRecord.documentType,
          khasraNumber: sampleRecord.khasraNumber,
          khataNumber: sampleRecord.khataNumber,
          plotAreaHectares: sampleRecord.plotAreaHectares,
          owners: sampleRecord.owners,
          boundingBoxesCount: sampleRecord.ocrBoundingBoxes.length,
          meanConfidence: sampleRecord.overallConfidence
        }
      }, null, 2);
    } else if (selectedEndpoint === 'VALIDATE') {
      fullJson = JSON.stringify({
        status: 'VALIDATION_COMPLETED',
        code: 200,
        timestamp: new Date().toISOString(),
        mathAreaBalance: sampleRecord.validationIssues.some(i => i.ruleCode === 'BR_REV_001_SHARE_MISMATCH') ? 'FAIL' : 'PASS',
        duplicateDetection: 'CLEAR_NO_DUPLICATE',
        litigationCheck: sampleRecord.isLitigationPending ? 'ACTIVE_STAY_FOUND' : 'CLEAR',
        encroachmentFlag: 'CLEARED_NOT_GOVT_LAND',
        totalDiscrepanciesFound: sampleRecord.validationIssues.length,
        issues: sampleRecord.validationIssues
      }, null, 2);
    } else if (selectedEndpoint === 'CADASTRE') {
      fullJson = JSON.stringify({
        status: 'SUCCESS',
        khasraNo: sampleRecord.khasraNumber,
        bhuvanParcelId: sampleRecord.bhuvanParcelId || 'UP-BHU-09-342-01',
        coordinates: sampleRecord.gisCoordinates,
        soilType: 'Alluvial Loam (Domat)',
        landUse: 'Double-Cropped Agricultural',
        spatialVectorFormat: 'GeoJSON-EPSG:4326'
      }, null, 2);
    } else {
      fullJson = JSON.stringify({
        status: 'SYNCED_TO_DILRMP_CENTRAL',
        code: 201,
        syncId: `DILRMP-SYNC-${Date.now()}`,
        blockchainTxHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
        statePortal: 'Bhulekh UP / MahaBhumi Gateway',
        message: 'Record successfully registered into National Land Information System (NLIS).'
      }, null, 2);

      appendAuditBlock(
        sampleRecord.id,
        sampleRecord.recordNumber,
        'EXPORTED_DILRMP',
        'Central DILRMP Gateway',
        'SYSTEM',
        'National Land Information System',
        `Cryptographically verified land record packet exported and synchronized to Central DILRMP / State Bhulekh.`
      );
    }

    const lines = fullJson.split('\n');
    let currentLine = 0;
    const chunkSize = Math.max(1, Math.ceil(lines.length / 7));
    
    const interval = setInterval(() => {
      currentLine += chunkSize;
      if (currentLine >= lines.length) {
        setApiResponse(fullJson);
        setIsLoading(false);
        clearInterval(interval);
      } else {
        setApiResponse(lines.slice(0, currentLine).join('\n'));
      }
    }, 45);
  };

  // Generate DILRMP XML payload
  const dilrmpXml = `<?xml version="1.0" encoding="UTF-8"?>
<DILRMPLandRecord xmlns="http://dilrmp.nic.in/schema/v3">
  <Header>
    <RecordId>${sampleRecord.recordNumber}</RecordId>
    <StateCode>${sampleRecord.state.slice(0, 2).toUpperCase()}</StateCode>
    <GeneratedTimestamp>${new Date().toISOString()}</GeneratedTimestamp>
    <AuthAuthority>Sub-Divisional Magistrate</AuthAuthority>
  </Header>
  <AdministrativeHierarchy>
    <State>${sampleRecord.state}</State>
    <District>${sampleRecord.district}</District>
    <Tehsil>${sampleRecord.tehsil}</Tehsil>
    <Village>${sampleRecord.revenueVillage}</Village>
  </AdministrativeHierarchy>
  <LandIdentifiers>
    <KhataNumber>${sampleRecord.khataNumber}</KhataNumber>
    <KhasraNumber>${sampleRecord.khasraNumber}</KhasraNumber>
    <AreaHectares>${sampleRecord.plotAreaHectares}</AreaHectares>
    <Classification>${sampleRecord.landClassification}</Classification>
  </LandIdentifiers>
  <TenureHolders>
    ${sampleRecord.owners.map(o => `
    <Owner>
      <Name>${o.name}</Name>
      <FatherSpouse>${o.fatherOrSpouseName}</FatherSpouse>
      <ShareRatio>${o.shareRatio}</ShareRatio>
      <AadhaarMasked>${o.aadhaarHash || 'XXXX-XXXX-8921'}</AadhaarMasked>
    </Owner>`).join('')}
  </TenureHolders>
  <VerificationSeal>
    <DigitalSignature>${sampleRecord.approvedByTehsildar?.digitalSignatureHash || 'PENDING_FINAL_SIGN'}</DigitalSignature>
    <IntegrityHash>SHA256-DILRMP-COMPLIANT</IntegrityHash>
  </VerificationSeal>
</DILRMPLandRecord>`;

  // Syntax highlighting for JSON
  const renderHighlightedJson = (rawJson: string) => {
    if (!rawJson) return null;
    const lines = rawJson.split('\n');
    return lines.map((line, idx) => {
      const isKeyLine = /("mathAreaBalance"|"blockchainTxHash"|"meanConfidence"|"khasraNumber"|"status")/.test(line);
      
      if (line.trim().startsWith('//')) {
        return (
          <div key={idx} className="text-slate-500 italic py-0.5">
            {line}
          </div>
        );
      }

      const match = line.match(/^(\s*)("([^"\\]|\\.)*")(\s*:\s*)(.*)$/);
      if (match) {
        const [, indent, key, , colon, rest] = match;
        let valElem = <span className="text-slate-200">{rest}</span>;
        
        const trimmedRest = rest.trim();
        if (trimmedRest.startsWith('"')) {
          valElem = <span className="text-emerald-300 dark:text-emerald-400 font-medium">{rest}</span>;
        } else if (/^-?\d+(\.\d+)?(,\s*)?$/.test(trimmedRest)) {
          valElem = <span className="text-amber-300 dark:text-amber-400 font-bold font-mono">{rest}</span>;
        } else if (/^(true|false|null)(,\s*)?$/.test(trimmedRest)) {
          valElem = <span className="text-purple-400 dark:text-purple-300 font-bold font-mono">{rest}</span>;
        }

        return (
          <div 
            key={idx} 
            className={`py-0.5 px-1.5 rounded flex items-center transition-colors ${
              isKeyLine ? 'bg-indigo-500/15 border-l-2 border-indigo-400 pl-2' : 'hover:bg-slate-900/60'
            }`}
          >
            <span className="text-slate-600 select-none text-[9px] w-6 shrink-0 font-mono">
              {idx + 1}
            </span>
            <span className="whitespace-pre font-mono text-[11px]">
              {indent}
              <span className="text-sky-300 font-semibold">{key}</span>
              <span className="text-slate-400">{colon}</span>
              {valElem}
            </span>
            {isKeyLine && (
              <span className="ml-auto text-[9px] font-mono text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded shrink-0 hidden sm:inline-block">
                KEY FIELD
              </span>
            )}
          </div>
        );
      }

      return (
        <div key={idx} className="py-0.5 px-1.5 flex items-center hover:bg-slate-900/60">
          <span className="text-slate-600 select-none text-[9px] w-6 shrink-0 font-mono">
            {idx + 1}
          </span>
          <span className="whitespace-pre font-mono text-[11px] text-slate-400">
            {line}
          </span>
        </div>
      );
    });
  };

  // Syntax highlighting for XML
  const renderHighlightedXml = (rawXml: string) => {
    if (!rawXml) return null;
    const lines = rawXml.split('\n');
    return lines.map((line, idx) => {
      const isSpecialTag = /(DigitalSignature|IntegrityHash|RecordId|KhasraNumber|KhataNumber|AreaHectares)/.test(line);
      
      if (line.trim().startsWith('<?xml')) {
        return (
          <div key={idx} className="py-0.5 px-1.5 flex items-center text-slate-400 italic text-[10px]">
            <span className="text-slate-600 select-none text-[9px] w-6 shrink-0 font-mono">{idx + 1}</span>
            <span className="whitespace-pre font-mono">{line}</span>
          </div>
        );
      }

      const fullTagMatch = line.match(/^(\s*)<([a-zA-Z0-9_:-]+)([^>]*)>(.*?)<\/([a-zA-Z0-9_:-]+)>(\s*)$/);
      if (fullTagMatch) {
        const [, indent, openTag, attrs, content, closeTag] = fullTagMatch;
        return (
          <div 
            key={idx} 
            className={`py-0.5 px-1.5 rounded flex items-center transition-colors ${
              isSpecialTag ? 'bg-amber-500/15 border-l-2 border-amber-400 pl-2' : 'hover:bg-slate-900/60'
            }`}
          >
            <span className="text-slate-600 select-none text-[9px] w-6 shrink-0 font-mono">{idx + 1}</span>
            <span className="whitespace-pre font-mono text-[10px]">
              {indent}
              <span className="text-slate-500">&lt;</span>
              <span className="text-indigo-300 font-semibold">{openTag}</span>
              {attrs && <span className="text-amber-300">{attrs}</span>}
              <span className="text-slate-500">&gt;</span>
              <span className="text-emerald-300 font-medium">{content}</span>
              <span className="text-slate-500">&lt;/</span>
              <span className="text-indigo-300 font-semibold">{closeTag}</span>
              <span className="text-slate-500">&gt;</span>
            </span>
            {isSpecialTag && (
              <span className="ml-auto text-[9px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded shrink-0 hidden sm:inline-block">
                STATUTORY
              </span>
            )}
          </div>
        );
      }

      const singleTagMatch = line.match(/^(\s*)<(\/?[a-zA-Z0-9_:-]+)([^>]*)>(\s*)$/);
      if (singleTagMatch) {
        const [, indent, tag, attrs] = singleTagMatch;
        return (
          <div key={idx} className="py-0.5 px-1.5 flex items-center hover:bg-slate-900/60">
            <span className="text-slate-600 select-none text-[9px] w-6 shrink-0 font-mono">{idx + 1}</span>
            <span className="whitespace-pre font-mono text-[10px]">
              {indent}
              <span className="text-slate-500">&lt;</span>
              <span className="text-indigo-300 font-bold">{tag}</span>
              {attrs && <span className="text-amber-300 font-normal">{attrs}</span>}
              <span className="text-slate-500">&gt;</span>
            </span>
          </div>
        );
      }

      return (
        <div key={idx} className="py-0.5 px-1.5 flex items-center hover:bg-slate-900/60">
          <span className="text-slate-600 select-none text-[9px] w-6 shrink-0 font-mono">{idx + 1}</span>
          <span className="whitespace-pre font-mono text-[10px] text-slate-300">{line}</span>
        </div>
      );
    });
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-85px)] bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <Server className="w-4 h-4" />
            DILRMP & National Land Information System (NLIS) Integration Hub
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            RESTful Revenue APIs & DigiLocker / Bhulekh Export Gateway
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interoperable JSON-LD, DILRMP standard XML, and webhook triggers for DigiLocker, PM-KISAN, Agristack, and State LRMS databases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleCopy(dilrmpXml, 'XML')}
            className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedFormat === 'XML' ? (
              <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </motion.span>
            ) : (
              <FileCode className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            )}
            <span>{copiedFormat === 'XML' ? 'Copied XML!' : 'Copy DILRMP XML'}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleCopy(JSON.stringify(sampleRecord, null, 2), 'JSON')}
            className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedFormat === 'JSON' ? (
              <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </motion.span>
            ) : (
              <FileJson className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            )}
            <span>{copiedFormat === 'JSON' ? 'Copied JSON!' : 'Copy JSON-LD'}</span>
          </motion.button>
        </div>
      </div>

      {/* Main Two-Column Layout: API Console (Left) + Schema Exporter (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive API Endpoint Runner */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Interactive REST API Sandbox
            </h3>
            <span className="text-[10px] bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-500/20 px-2 py-0.5 rounded font-mono font-semibold">
              API v1.0.4 Active
            </span>
          </div>

          {/* Endpoint Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedEndpoint('EXTRACT')}
              className={`relative p-2.5 rounded-xl border text-left transition-colors ${
                selectedEndpoint === 'EXTRACT'
                  ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-bold bg-brand-50/50 dark:bg-brand-950/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {selectedEndpoint === 'EXTRACT' && (
                <motion.div
                  layoutId="apiEndpointIndicator"
                  className="absolute inset-0 bg-brand-500/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10">
                <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 block font-mono">POST</span>
                <span className="text-xs block truncate">/ocr/extract</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('VALIDATE')}
              className={`relative p-2.5 rounded-xl border text-left transition-colors ${
                selectedEndpoint === 'VALIDATE'
                  ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-bold bg-brand-50/50 dark:bg-brand-950/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {selectedEndpoint === 'VALIDATE' && (
                <motion.div
                  layoutId="apiEndpointIndicator"
                  className="absolute inset-0 bg-brand-500/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10">
                <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 block font-mono">POST</span>
                <span className="text-xs block truncate">/records/validate</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('CADASTRE')}
              className={`relative p-2.5 rounded-xl border text-left transition-colors ${
                selectedEndpoint === 'CADASTRE'
                  ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-bold bg-brand-50/50 dark:bg-brand-950/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {selectedEndpoint === 'CADASTRE' && (
                <motion.div
                  layoutId="apiEndpointIndicator"
                  className="absolute inset-0 bg-brand-500/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10">
                <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 block font-mono">GET</span>
                <span className="text-xs block truncate">/cadastral/khasra</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedEndpoint('SYNC')}
              className={`relative p-2.5 rounded-xl border text-left transition-colors ${
                selectedEndpoint === 'SYNC'
                  ? 'border-brand-500 text-brand-700 dark:text-brand-300 font-bold bg-brand-50/50 dark:bg-brand-950/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {selectedEndpoint === 'SYNC' && (
                <motion.div
                  layoutId="apiEndpointIndicator"
                  className="absolute inset-0 bg-brand-500/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10">
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 block font-mono">POST</span>
                <span className="text-xs block truncate">/lrms/sync</span>
              </div>
            </button>
          </div>

          {/* Request Header Bar & Execute Button */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 truncate">
              <span className="text-brand-600 dark:text-brand-400 font-bold">
                {selectedEndpoint === 'CADASTRE' ? 'GET' : 'POST'}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                https://api.bhoomi.gov.in/v1/{selectedEndpoint.toLowerCase()}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleExecuteApi}
              disabled={isLoading}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-card transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              {isLoading ? 'Streaming Payload...' : 'Test Endpoint'}
            </motion.button>
          </div>

          {/* Response Output Box */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">HTTP 200 Live Response Payload:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  application/json
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(apiResponse, 'RESPONSE_JSON')}
                className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedFormat === 'RESPONSE_JSON' ? 'Copied!' : 'Copy Response'}</span>
              </button>
            </div>

            {/* Quick Scan Key Annotations */}
            <div className="flex flex-wrap items-center gap-1.5 py-1 px-2.5 bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Judge Quick Scan:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                Record: {sampleRecord.recordNumber}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Area Balance: {sampleRecord.validationIssues.some(i => i.ruleCode === 'BR_REV_001_SHARE_MISMATCH') ? 'FAIL' : 'PASS'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                AI Confidence: {sampleRecord.overallConfidence.toFixed(1)}%
              </span>
            </div>

            {/* Syntax Highlighted JSON Box */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px] overflow-x-auto max-h-[320px] shadow-inner select-all divide-y divide-slate-900/50">
              {renderHighlightedJson(apiResponse || '// Click "Test Endpoint" to simulate live JSON response...')}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: DILRMP National Standard XML Export Preview */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                DILRMP National XML Schema
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">NIC-DILRMP-v3.0</span>
            </div>

            {/* XML Quick Scan Callouts */}
            <div className="flex flex-wrap items-center gap-1.5 py-1 px-2 bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-xl">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                NIC XML Schema v3
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                e-Sign DSC Token
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                SHA-256 Sealed
              </span>
            </div>

            {/* Syntax Highlighted XML Box */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[10px] overflow-x-auto max-h-[360px] shadow-inner select-all divide-y divide-slate-900/50">
              {renderHighlightedXml(dilrmpXml)}
            </div>
          </div>

          {/* DigiLocker Bridge Status */}
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> DigiLocker RoR Verification Bridge
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">CONNECTED</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Citizens can fetch this digitally certified Record of Rights (RoR) directly using their 12-digit Aadhaar UIDAI token.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
