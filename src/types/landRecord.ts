export type UserRole = 'OPERATOR' | 'PATWARI' | 'TEHSILDAR' | 'ADMIN' | 'CITIZEN';

export type RecordStatus = 
  | 'INGESTED' 
  | 'PREPROCESSED' 
  | 'EXTRACTED' 
  | 'VERIFICATION_PENDING' 
  | 'VERIFIED_PATWARI' 
  | 'APPROVED_TEHSILDAR' 
  | 'SYNCED_LRMS' 
  | 'DISPUTED' 
  | 'REJECTED';

export type LanguageCode = 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'bn' | 'gu' | 'ur' | 'en';

export type DocumentType = 
  | 'KHATAUNI' 
  | 'KHASRA_ROR' 
  | 'SATBARA_7_12' 
  | 'PATTA_CHITTA' 
  | 'PAHANI_ADANGAL' 
  | 'JAMABANDI' 
  | 'SALE_DEED' 
  | 'MUTATION_REGISTER';

export type AreaUnit = 'HECTARE' | 'ACRE' | 'BIGHA' | 'BISWA' | 'GUNTHA' | 'SQ_METER' | 'SQ_FEET';

export type LandClassification = 
  | 'AGRICULTURAL_IRRIGATED' 
  | 'AGRICULTURAL_UNIRRIGATED' 
  | 'NON_AGRICULTURAL_RESIDENTIAL' 
  | 'COMMERCIAL_INDUSTRIAL' 
  | 'GOVERNMENT_GRAM_SABHA' 
  | 'FOREST_PROTECTED' 
  | 'WATERBODY_WETLAND' 
  | 'WAKF_RELIGIOUS_TRUST';

export interface BoundingBox {
  id: string;
  fieldKey: string;
  label: string;
  x: number; // percentage 0-100 or pixels
  y: number;
  width: number;
  height: number;
  page: number;
  confidence: number; // 0 to 100
  extractedValue: string;
  detectedScript?: string;
  isCorrected?: boolean;
}

export interface LandOwner {
  id: string;
  name: string;
  vernacularName?: string;
  fatherOrSpouseName: string;
  relationType: 'S/O' | 'D/O' | 'W/O' | 'H/O' | 'C/O';
  shareRatio: string; // e.g. "1/2", "1/4", "33.33%"
  shareFraction: number; // 0.5, 0.25, etc.
  aadhaarHash?: string;
  panHash?: string;
  residence: string;
  isMinor?: boolean;
  guardianName?: string;
}

export interface MutationRecord {
  mutationNo: string;
  orderDate: string;
  transferType: 'INHERITANCE' | 'SALE_PURCHASE' | 'GIFT_DEED' | 'PARTITION' | 'COURT_DECREE' | 'GOVT_ACQUISITION';
  sanctioningAuthority: string;
  oldOwnerName: string;
  newOwnerName: string;
  orderDocumentRef?: string;
  status: 'SANCTIONED' | 'PENDING' | 'OBJECTED';
}

export interface Encumbrance {
  id: string;
  bankOrCreditorName: string;
  loanAmount: number;
  mortgageDate: string;
  status: 'ACTIVE_LIEN' | 'DISCHARGED' | 'DISPUTED';
  referenceNo: string;
}

export interface ValidationIssue {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  field: string;
  ruleCode: string;
  title: string;
  message: string;
  suggestedFix?: string;
  autoResolvable: boolean;
  resolved?: boolean;
}

export interface PreprocessingConfig {
  deskewAngle: number; // degrees
  binarizationThreshold: number; // 0-255 or 0-100
  denoisingLevel: number; // 0-100
  contrastBoost: number; // 0-100
  inkRecovery: boolean;
  stampSuppression: boolean;
  superResolution: boolean;
}

export interface LandRecord {
  id: string;
  recordNumber: string; // e.g. "UP-LKO-2024-KHT-8891"
  documentType: DocumentType;
  documentTitle: string;
  documentLanguage: LanguageCode;
  documentYear: string;
  imageUrl: string;
  enhancedImageUrl?: string;
  originalFileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
  processedAt?: string;
  status: RecordStatus;
  
  // Administrative Hierarchy
  state: string;
  district: string;
  tehsil: string;
  revenueVillage: string;
  gramPanchayat?: string;
  pargana?: string;
  patwariHalkaNo?: string;

  // Land Identifiers
  khataNumber: string; // Khewat / Khata
  khasraNumber: string; // Survey / Dag / Gat
  subDivisionNo?: string;
  plotAreaOriginal: number;
  plotAreaUnit: 'HECTARE' | 'ACRE' | 'BIGHA' | 'BISWA' | 'GUNTHA' | 'SQ_METER' | 'SQ_FEET';
  plotAreaHectares: number; // Normalized to Hectares for universal math
  landClassification: LandClassification;
  landRevenueTaxPaise?: number;

  // Ownership & Stakeholders
  ownershipType: 'INDIVIDUAL' | 'JOINT_PRIVATE' | 'GOVERNMENT' | 'COMMUNITY' | 'TRUST';
  owners: LandOwner[];
  
  // Mutation & Encumbrances
  mutations: MutationRecord[];
  encumbrances: Encumbrance[];
  isLitigationPending: boolean;
  litigationCaseNo?: string;

  // Valuation & Registration
  guidelineMarketValueINR?: number;
  stampDutyPaidINR?: number;
  registrationBookNo?: string;
  registrationDate?: string;

  // AI OCR & Confidence Metrics
  overallConfidence: number; // 0 - 100
  characterAccuracy: number; // CRR %
  ocrBoundingBoxes: BoundingBox[];
  validationIssues: ValidationIssue[];
  preprocessingConfig: PreprocessingConfig;
  
  // Verification details
  verifiedByPatwari?: {
    patwariName: string;
    patwariId: string;
    verifiedAt: string;
    notes?: string;
  };
  approvedByTehsildar?: {
    tehsildarName: string;
    tehsildarId: string;
    approvedAt: string;
    digitalSignatureHash: string;
  };

  // GIS Linking
  gisCoordinates?: {
    lat: number;
    lng: number;
    polygonBounds?: [number, number][];
  };
  bhuvanParcelId?: string;
}
