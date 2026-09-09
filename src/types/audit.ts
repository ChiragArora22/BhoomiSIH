export interface AuditBlock {
  blockIndex: number;
  timestamp: string;
  documentId: string;
  recordNumber: string;
  action: 
    | 'DOCUMENT_INGESTED' 
    | 'PREPROCESSING_APPLIED' 
    | 'OCR_EXTRACTION_COMPLETED' 
    | 'ANOMALY_FLAGGED' 
    | 'PATWARI_VERIFICATION_SAVED' 
    | 'TEHSILDAR_DIGITAL_SIGNATURE' 
    | 'GIS_PARCEL_LINKED' 
    | 'MUTATION_EXECUTED' 
    | 'EXPORTED_DILRMP'
    | 'SHARE_RATIO_NORMALIZED'
    | 'RECORD_SANCTIONED_TEHSILDAR';
  actorName: string;
  actorRole: string;
  actorIp: string;
  actorDesignation: string;
  changesSummary: string;
  previousHash: string;
  blockHash: string;
  digitalSignature?: string;
  isTamperVerified: boolean;
}

export interface VerificationStats {
  totalBlocks: number;
  verifiedChain: boolean;
  lastVerifiedAt: string;
  integrityScorePercent: number;
}
