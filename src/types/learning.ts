export interface CorrectedToken {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  originalOcrText: string;
  correctedText: string;
  language: string;
  script: string;
  confidenceBefore: number;
  correctedBy: string;
  correctedAt: string;
  status: 'QUEUED_FOR_RETRAINING' | 'INCLUDED_IN_EPOCH' | 'DEPLOYED';
  documentType: string;
}

export interface ModelMetrics {
  modelVersion: string;
  overallAccuracyPercent: number;
  printedAccuracyPercent: number;
  handwrittenAccuracyPercent: number;
  characterErrorRatePercent: number;
  wordErrorRatePercent: number;
  totalTokensTrained: number;
  feedbackBatchesProcessed: number;
  accuracyTrend: { epoch: number; accuracy: number; date: string }[];
  confusionMatrixSample: { expected: string; predicted: string; count: number }[];
}
