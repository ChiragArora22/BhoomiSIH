import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLandRecord } from '../../context/LandRecordContext';
import { DocumentType, LanguageCode, LandRecord, LandClassification } from '../../types/landRecord';
import {
  UploadCloud,
  FileText,
  FileCheck,
  Sparkles,
  X,
  CheckCircle2,
  Layers,
  Globe,
  Sliders,
  AlertCircle,
  File,
  FolderOpen,
  RefreshCw,
  Eye,
  Check,
  ArrowLeft
} from 'lucide-react';

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

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose }) => {
  const { addNewRecord, setActiveRecordId, setActiveTab } = useLandRecord();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [modalMode, setModalMode] = useState<'UPLOAD_PDF' | 'PRESET_SAMPLES'>('UPLOAD_PDF');
  const [docType, setDocType] = useState<DocumentType>('KHATAUNI');
  const [docLanguage, setDocLanguage] = useState<LanguageCode>('hi');
  const [fileName, setFileName] = useState<string>('Scanned_Land_Record_2024.pdf');
  const [fileSize, setFileSize] = useState<number>(2450000);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedDataUrl, setUploadedDataUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isParsingFile, setIsParsingFile] = useState<boolean>(false);

  const [state, setState] = useState<string>('Uttar Pradesh');
  const [district, setDistrict] = useState<string>('Lucknow');
  const [tehsil, setTehsil] = useState<string>('Mohanlalganj');
  const [village, setVillage] = useState<string>('Bhaupur (भाऊपुर)');
  const [khasraNo, setKhasraNo] = useState<string>('412/1');
  const [khataNo, setKhataNo] = useState<string>('00219');
  const [ownerName, setOwnerName] = useState<string>('Vikram Singh Yadav');
  const [ownerVernacular, setOwnerVernacular] = useState<string>('विक्रम सिंह यादव');
  const [fatherName, setFatherName] = useState<string>('Harishchandra Yadav');
  const [plotArea, setPlotArea] = useState<number>(1.2500);
  const [landClass, setLandClass] = useState<LandClassification>('AGRICULTURAL_IRRIGATED');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDemoPreset, setSelectedDemoPreset] = useState<string>('CUSTOM');

  if (!isOpen || !isMounted) return null;

  // Process selected or dropped file (PDF / Image)
  const processUploadedFile = (file: File) => {
    setIsParsingFile(true);
    setUploadedFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    setSelectedDemoPreset('UPLOADED_FILE');

    // Read file as Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);

    // Smart heuristic metadata detection from filename
    const nameLower = file.name.toLowerCase();
    if (nameLower.includes('712') || nameLower.includes('satbara') || nameLower.includes('maha') || nameLower.includes('pune')) {
      setDocType('SATBARA_7_12');
      setDocLanguage('mr');
      setState('Maharashtra');
      setDistrict('Pune');
      setTehsil('Mulshi');
      setVillage('Paud (पौड)');
    } else if (nameLower.includes('patta') || nameLower.includes('chitta') || nameLower.includes('tamil') || nameLower.includes('chengalpattu')) {
      setDocType('PATTA_CHITTA');
      setDocLanguage('ta');
      setState('Tamil Nadu');
      setDistrict('Chengalpattu');
      setTehsil('Thiruporur');
      setVillage('Nemmeli (நெம்மேலி)');
    } else if (nameLower.includes('pahani') || nameLower.includes('adangal') || nameLower.includes('telangana')) {
      setDocType('PAHANI_ADANGAL');
      setDocLanguage('te');
      setState('Telangana');
      setDistrict('Hyderabad');
      setTehsil('Secunderabad');
      setVillage('Malkajgiri');
    } else if (nameLower.includes('jamabandi') || nameLower.includes('rampur') || nameLower.includes('legacy')) {
      setDocType('JAMABANDI');
      setDocLanguage('hi');
      setState('Uttar Pradesh');
      setDistrict('Rampur');
      setTehsil('Bilaspur');
    } else if (nameLower.includes('deed') || nameLower.includes('registry')) {
      setDocType('SALE_DEED');
    }

    setTimeout(() => {
      setIsParsingFile(false);
    }, 450);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearUploadedFile = () => {
    setUploadedFile(null);
    setUploadedDataUrl(null);
    setFileName('Scanned_Land_Record_2024.pdf');
    setFileSize(2450000);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Preset Sample selection
  const handlePresetSelect = (presetKey: string) => {
    setSelectedDemoPreset(presetKey);
    if (presetKey === 'UP_KHATAUNI') {
      setDocType('KHATAUNI');
      setDocLanguage('hi');
      setState('Uttar Pradesh');
      setDistrict('Varanasi');
      setTehsil('Pindra');
      setVillage('Phulpur (फूलपुर)');
      setKhasraNo('289/2');
      setKhataNo('00188');
      setOwnerName('Radheshyam Maurya');
      setOwnerVernacular('राधेश्याम मौर्य');
      setFatherName('Kashi Nath Maurya');
      setPlotArea(0.9500);
      setFileName('Varanasi_Khatauni_289.pdf');
    } else if (presetKey === 'MH_SATBARA') {
      setDocType('SATBARA_7_12');
      setDocLanguage('mr');
      setState('Maharashtra');
      setDistrict('Nashik');
      setTehsil('Niphad');
      setVillage('Pimpalgaon Baswant (पिंपळगाव बसवंत)');
      setKhasraNo('145/3');
      setKhataNo('92');
      setOwnerName('Santosh Bhaurao Gaikwad');
      setOwnerVernacular('संतोष भाऊराव गायकवाड');
      setFatherName('Bhaurao Gaikwad');
      setPlotArea(1.1200);
      setFileName('MahaBhumi_712_Dindori.pdf');
    } else if (presetKey === 'TN_PATTA') {
      setDocType('PATTA_CHITTA');
      setDocLanguage('ta');
      setState('Tamil Nadu');
      setDistrict('Madurai');
      setTehsil('Melur');
      setVillage('Kottampatti (கொட்டாம்பட்டி)');
      setKhasraNo('312/1A');
      setKhataNo('1890');
      setOwnerName('K. Ramasamy');
      setOwnerVernacular('கே. ராமசாமி');
      setFatherName('Karuppiah Thevar');
      setPlotArea(0.4047);
      setFileName('TN_Patta_Melur_312.pdf');
    } else if (presetKey === 'DISPUTED_DEMO') {
      setDocType('JAMABANDI');
      setDocLanguage('hi');
      setState('Uttar Pradesh');
      setDistrict('Rampur');
      setTehsil('Bilaspur');
      setVillage('Rampur Khas (रामपुर खास)');
      setKhasraNo('88/4');
      setKhataNo('00341');
      setOwnerName('Irfan Habib & Javed Habib');
      setOwnerVernacular('इरफ़ान हबीब व जावेद हबीब');
      setFatherName('Late Habibullah');
      setPlotArea(3.4000);
      setFileName('Faded_Legacy_Jamabandi_1982.pdf');
    }
  };

  const handleStartDigitization = async () => {
    setIsUploading(true);

    const now = new Date();
    const currentYear = now.getFullYear();
    const todayISO = now.toISOString().split('T')[0];
    const newRecordId = `REC_${Date.now()}`;

    const newRecord: LandRecord = {
      id: newRecordId,
      recordNumber: `${state.slice(0, 2).toUpperCase()}-${district.slice(0, 3).toUpperCase()}-${currentYear}-${docType.slice(0, 3)}-${khataNo}`,
      documentType: docType,
      documentTitle: `${state} भू-अभिलेख (${docType.replace(/_/g, ' ')})`,
      documentLanguage: docLanguage,
      documentYear: `1431 फ़सली (${currentYear})`,
      imageUrl: uploadedDataUrl || 'SAMPLE_DOC_UPLOADED',
      originalFileName: fileName,
      fileSizeBytes: fileSize,
      uploadedAt: now.toISOString(),
      processedAt: now.toISOString(),
      status: 'VERIFICATION_PENDING',

      state,
      district,
      tehsil,
      revenueVillage: village,
      gramPanchayat: `${village} Gram Panchayat`,

      khataNumber: khataNo,
      khasraNumber: khasraNo,
      subDivisionNo: '1',
      plotAreaOriginal: plotArea,
      plotAreaUnit: 'HECTARE',
      plotAreaHectares: plotArea,
      landClassification: landClass,
      landRevenueTaxPaise: 3800,

      ownershipType: 'INDIVIDUAL',
      owners: [
        {
          id: `OWNER_${Date.now()}_1`,
          name: ownerName,
          vernacularName: ownerVernacular || transliterateEnglishToVernacular(ownerName, getScriptForStateOrLanguage(docLanguage, state)),
          fatherOrSpouseName: fatherName,
          relationType: 'S/O',
          shareRatio: '1/1 (100%)',
          shareFraction: 1.0,
          aadhaarHash: 'XXXX-XXXX-7721',
          panHash: 'AYRPK****M',
          residence: `Village ${village}, ${district}`
        }
      ],
      mutations: [
        {
          mutationNo: `${todayISO.replace(/-/g, '')}00421`,
          orderDate: todayISO,
          transferType: 'INHERITANCE',
          sanctioningAuthority: `Tehsildar ${tehsil || district}`,
          oldOwnerName: `${fatherName} (Deceased)`,
          newOwnerName: ownerName,
          status: 'SANCTIONED'
        }
      ],
      encumbrances: [],
      isLitigationPending: selectedDemoPreset === 'DISPUTED_DEMO',
      litigationCaseNo: selectedDemoPreset === 'DISPUTED_DEMO' ? 'SDM/CIVIL/2023/409' : undefined,

      guidelineMarketValueINR: plotArea * 3000000,
      stampDutyPaidINR: plotArea * 180000,

      overallConfidence: selectedDemoPreset === 'DISPUTED_DEMO' ? 68.5 : 96.2,
      characterAccuracy: selectedDemoPreset === 'DISPUTED_DEMO' ? 74.5 : 98.1,
      ocrBoundingBoxes: [
        { id: 'ub1', fieldKey: 'state', label: 'State', x: 25, y: 8, width: 50, height: 4, page: 1, confidence: 99, extractedValue: state },
        { id: 'ub2', fieldKey: 'district', label: 'District', x: 12, y: 16, width: 24, height: 3.5, page: 1, confidence: 97, extractedValue: district },
        { id: 'ub3', fieldKey: 'revenueVillage', label: 'Village', x: 70, y: 16, width: 24, height: 3.5, page: 1, confidence: 96, extractedValue: village },
        { id: 'ub4', fieldKey: 'khataNumber', label: 'Khata No', x: 10, y: 28, width: 18, height: 4.5, page: 1, confidence: 98, extractedValue: khataNo },
        { id: 'ub5', fieldKey: 'khasraNumber', label: 'Khasra No', x: 30, y: 28, width: 18, height: 4.5, page: 1, confidence: 97, extractedValue: khasraNo },
        { id: 'ub6', fieldKey: 'plotAreaOriginal', label: 'Area', x: 50, y: 28, width: 18, height: 4.5, page: 1, confidence: 95, extractedValue: `${plotArea}` },
        { id: 'ub7', fieldKey: 'owners', label: 'Owner Name', x: 70, y: 28, width: 26, height: 6, page: 1, confidence: 94, extractedValue: ownerVernacular || ownerName }
      ],
      validationIssues: [],
      preprocessingConfig: {
        deskewAngle: 0.5,
        binarizationThreshold: 145,
        denoisingLevel: 25,
        contrastBoost: 35,
        inkRecovery: true,
        stampSuppression: false,
        superResolution: true
      },
      gisCoordinates: {
        lat: 26.8467,
        lng: 80.9462,
        polygonBounds: [
          [26.8455, 80.9450],
          [26.8475, 80.9452],
          [26.8473, 80.9472],
          [26.8453, 80.9470]
        ]
      },
      bhuvanParcelId: `IN-BHU-${state.slice(0, 2).toUpperCase()}-${khasraNo.replace('/', '-')}`
    };

    setTimeout(async () => {
      await addNewRecord(newRecord);
      setActiveRecordId(newRecord.id);
      setActiveTab('SPLIT_VERIFY');
      setIsUploading(false);
      onClose();
    }, 600);
  };

  const availableStates = getAvailableStates();
  const normState = normalizeStateName(state);
  const availableDistricts = getDistrictsForState(normState);
  const normDist = normalizeDistrictName(normState, district);
  const availableTehsils = getTehsilsForDistrict(normState, normDist);
  const normTeh = normalizeTehsilName(normState, normDist, tehsil);
  const availableVillages = getVillagesForTehsil(normState, normDist, normTeh);

  const handleStateChange = (newState: string) => {
    setState(newState);
    const dists = getDistrictsForState(newState);
    const newDist = dists[0]?.key || '';
    setDistrict(newDist);
    const tehs = getTehsilsForDistrict(newState, newDist);
    const newTeh = tehs[0]?.key || '';
    setTehsil(newTeh);
    const vills = getVillagesForTehsil(newState, newDist, newTeh);
    setVillage(vills[0] || '');
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const tehs = getTehsilsForDistrict(normState, newDist);
    const newTeh = tehs[0]?.key || '';
    setTehsil(newTeh);
    const vills = getVillagesForTehsil(normState, newDist, newTeh);
    setVillage(vills[0] || '');
  };

  const handleTehsilChange = (newTeh: string) => {
    setTehsil(newTeh);
    const vills = getVillagesForTehsil(normState, normDist, newTeh);
    setVillage(vills[0] || '');
  };

  const isPdf = fileName.toLowerCase().endsWith('.pdf');

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex justify-center items-start sm:items-center">
      <div className="my-auto max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] animate-scaleUp text-slate-800 dark:text-slate-200">
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf,.jpg,.jpeg,.png,.tiff"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Modal Header */}
        <div className="bg-slate-50 dark:bg-slate-950 px-5 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Upload & Digitize Land Record PDF</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 font-mono font-bold hidden sm:inline-block">
                  BHOOMI-OCR v2.4
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">DILRMP-compliant layout classification and Indic Vision OCR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-slate-100/70 dark:bg-slate-950/90 px-5 sm:px-6 pt-2.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setModalMode('UPLOAD_PDF')}
            className={`pb-2.5 px-3 border-b-2 font-semibold flex items-center gap-1.5 transition ${
              modalMode === 'UPLOAD_PDF'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Upload Real PDF / Scan File</span>
          </button>

          <button
            type="button"
            onClick={() => setModalMode('PRESET_SAMPLES')}
            className={`pb-2.5 px-3 border-b-2 font-semibold flex items-center gap-1.5 transition ${
              modalMode === 'PRESET_SAMPLES'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>State Revenue Presets</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700 dark:text-slate-200">
          
          {/* TAB 1: PDF DRAG & DROP / FILE UPLOAD */}
          {modalMode === 'UPLOAD_PDF' && (
            <div className="space-y-3">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative group ${
                  isDragging
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 scale-[1.01]'
                    : uploadedFile
                    ? 'border-brand-500/60 bg-brand-50/30 dark:bg-brand-950/10 hover:border-brand-500'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 hover:border-brand-500/80 hover:bg-slate-100/80 dark:hover:bg-slate-950'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2.5">
                  <div className={`p-3.5 rounded-2xl transition-transform group-hover:scale-110 ${
                    uploadedFile
                      ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400'
                      : 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}>
                    {uploadedFile ? (
                      <FileCheck className="w-7 h-7" />
                    ) : (
                      <UploadCloud className="w-7 h-7" />
                    )}
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {uploadedFile ? 'Selected PDF Document Loaded' : 'Click to Browse or Drag & Drop Land Record PDF'}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Supports Multi-page PDF, Scanned TIFF, High-Res JPG/PNG (Up to 50 MB)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-card flex items-center gap-1.5 transition"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      Browse PDF Files
                    </button>
                    {uploadedFile && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearUploadedFile();
                        }}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Uploaded File Status Pill */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2.5 truncate">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    isPdf ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-brand-500/20 text-brand-600 dark:text-brand-400'
                  }`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-mono text-xs text-slate-900 dark:text-white font-bold truncate">{fileName}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {isParsingFile ? 'Extracting OCR tokens...' : 'Ready for OCR parsing'}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">{(fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    {isPdf ? 'PDF / DOCUMENT' : 'IMAGE'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOVERNMENT VERIFIED PRESETS */}
          {modalMode === 'PRESET_SAMPLES' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <span>Select a Pre-Configured State Record:</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Verified Samples</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('UP_KHATAUNI')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedDemoPreset === 'UP_KHATAUNI'
                      ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-[10px] text-brand-600 dark:text-brand-400 uppercase font-mono">Hindi (UP)</div>
                  <div className="text-xs truncate font-medium">Khatauni Record</div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('MH_SATBARA')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedDemoPreset === 'MH_SATBARA'
                      ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-mono">Marathi (MH)</div>
                  <div className="text-xs truncate font-medium">7/12 Satbara Extract</div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('TN_PATTA')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedDemoPreset === 'TN_PATTA'
                      ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-[10px] text-cyan-600 dark:text-cyan-400 uppercase font-mono">Tamil (TN)</div>
                  <div className="text-xs truncate font-medium">Patta-Chitta Deed</div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('DISPUTED_DEMO')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedDemoPreset === 'DISPUTED_DEMO'
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-mono">Dispute Sample</div>
                  <div className="text-xs truncate font-medium">Faded Legacy Deed</div>
                </button>
              </div>
            </div>
          )}

          {/* Document Properties with Cascading Hierarchy Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Document Format</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="KHATAUNI">Khatauni (RoR)</option>
                <option value="SATBARA_7_12">7/12 Satbara Extract</option>
                <option value="PATTA_CHITTA">Patta / Chitta</option>
                <option value="PAHANI_ADANGAL">Pahani / Adangal</option>
                <option value="JAMABANDI">Jamabandi Ledger</option>
                <option value="SALE_DEED">Sale Deed</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Regional Language</label>
              <select
                value={docLanguage}
                onChange={(e) => setDocLanguage(e.target.value as LanguageCode)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Territory / State Dropdown */}
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Territory / State</label>
              <select
                value={normState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                {availableStates.map((s) => (
                  <option key={s.key} value={s.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">District</label>
              <select
                value={availableDistricts.some(d => d.key === district) ? normDist : district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                {!availableDistricts.some(d => d.key === normDist) && district && (
                  <option value={district} className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-300">
                    {district} (Custom)
                  </option>
                )}
                {availableDistricts.map((d) => (
                  <option key={d.key} value={d.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tehsil / Taluk Dropdown */}
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Tehsil / Taluk</label>
              <select
                value={availableTehsils.some(t => t.key === tehsil) ? normTeh : tehsil}
                onChange={(e) => handleTehsilChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                {!availableTehsils.some(t => t.key === normTeh) && tehsil && (
                  <option value={tehsil} className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-300">
                    {tehsil} (Custom)
                  </option>
                )}
                {availableTehsils.map((t) => (
                  <option key={t.key} value={t.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Revenue Village Dropdown */}
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Revenue Village</label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                {!availableVillages.includes(village) && village && (
                  <option value={village} className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-300">
                    {village} (Custom)
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

          {/* Section: Land Identifiers & Ownership Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Khasra / Gat No.</label>
              <input
                type="text"
                value={khasraNo}
                onChange={(e) => setKhasraNo(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-brand-600 dark:text-brand-400 font-mono font-bold focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Khata Number</label>
              <input
                type="text"
                value={khataNo}
                onChange={(e) => setKhataNo(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-mono font-bold focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Owner Name (English)</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => {
                  const val = e.target.value;
                  setOwnerName(val);
                  const script = getScriptForStateOrLanguage(docLanguage, state);
                  setOwnerVernacular(transliterateEnglishToVernacular(val, script));
                }}
                placeholder="e.g. Vikram Singh Yadav"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Vernacular Name (क्षेत्रीय भाषा)</label>
              <input
                type="text"
                value={ownerVernacular}
                onChange={(e) => setOwnerVernacular(e.target.value)}
                placeholder="e.g. विक्रम सिंह यादव"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-teal-700 dark:text-teal-300 font-sans focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Father / Spouse Name</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="e.g. Harishchandra Yadav"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Plot Area (Hectares)</label>
              <input
                type="number"
                step="0.0001"
                value={plotArea}
                onChange={(e) => setPlotArea(parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-brand-600 dark:text-brand-400 font-mono font-bold focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-950 px-5 sm:px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Bhoomi Indic OCR Pipeline Ready</span>
          </span>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsUploading(false);
                onClose();
                setActiveTab('DASHBOARD');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              Cancel & Return to Executive Command
            </button>
            <button
              type="button"
              onClick={handleStartDigitization}
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-card flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Ingesting Document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Digitization</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
