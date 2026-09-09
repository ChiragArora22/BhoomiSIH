export interface StateProgress {
  stateCode: string;
  stateName: string;
  vernacularName: string;
  totalVillages: number;
  digitizedVillages: number;
  totalParcelsCount: number;
  digitizedParcelsCount: number;
  accuracyRatePercent: number;
  progressPercent: number;
  activeDisputesCount: number;
}

export const STATE_DIGITIZATION_PROGRESS: StateProgress[] = [
  {
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    vernacularName: 'उत्तर प्रदेश',
    totalVillages: 106774,
    digitizedVillages: 101435,
    totalParcelsCount: 78500000,
    digitizedParcelsCount: 74575000,
    accuracyRatePercent: 96.4,
    progressPercent: 95.0,
    activeDisputesCount: 1420
  },
  {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    vernacularName: 'महाराष्ट्र',
    totalVillages: 43665,
    digitizedVillages: 42136,
    totalParcelsCount: 38200000,
    digitizedParcelsCount: 36863000,
    accuracyRatePercent: 97.8,
    progressPercent: 96.5,
    activeDisputesCount: 890
  },
  {
    stateCode: 'MP',
    stateName: 'Madhya Pradesh',
    vernacularName: 'मध्य प्रदेश',
    totalVillages: 55000,
    digitizedVillages: 51700,
    totalParcelsCount: 34000000,
    digitizedParcelsCount: 31960000,
    accuracyRatePercent: 95.2,
    progressPercent: 94.0,
    activeDisputesCount: 1105
  },
  {
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    vernacularName: 'தமிழ்நாடு',
    totalVillages: 17200,
    digitizedVillages: 16856,
    totalParcelsCount: 29500000,
    digitizedParcelsCount: 28910000,
    accuracyRatePercent: 98.6,
    progressPercent: 98.0,
    activeDisputesCount: 420
  },
  {
    stateCode: 'TG',
    stateName: 'Telangana',
    vernacularName: 'తెలంగాణ',
    totalVillages: 10900,
    digitizedVillages: 10791,
    totalParcelsCount: 18200000,
    digitizedParcelsCount: 18018000,
    accuracyRatePercent: 99.0,
    progressPercent: 99.0,
    activeDisputesCount: 310
  },
  {
    stateCode: 'KA',
    stateName: 'Karnataka',
    vernacularName: 'ಕರ್ನಾಟಕ',
    totalVillages: 29340,
    digitizedVillages: 28459,
    totalParcelsCount: 26000000,
    digitizedParcelsCount: 25220000,
    accuracyRatePercent: 97.1,
    progressPercent: 97.0,
    activeDisputesCount: 650
  },
  {
    stateCode: 'GJ',
    stateName: 'Gujarat',
    vernacularName: 'ગુજરાત',
    totalVillages: 18584,
    digitizedVillages: 17840,
    totalParcelsCount: 21500000,
    digitizedParcelsCount: 20640000,
    accuracyRatePercent: 96.9,
    progressPercent: 96.0,
    activeDisputesCount: 512
  },
  {
    stateCode: 'BR',
    stateName: 'Bihar',
    vernacularName: 'बिहार',
    totalVillages: 45103,
    digitizedVillages: 36984,
    totalParcelsCount: 42000000,
    digitizedParcelsCount: 34440000,
    accuracyRatePercent: 88.5,
    progressPercent: 82.0,
    activeDisputesCount: 3410
  }
];

export const OCR_PERFORMANCE_METRICS = {
  totalProcessedThisMonth: 124890,
  averageOcrConfidence: 96.4,
  autoValidationPassRate: 88.7,
  pendingHumanReviewCases: 14,
  avgProcessingTimeSec: 2.8,
  activeLearningRetrainedModels: 18,
  cryptographicBlocksVerified: 48912,
  languageDistribution: [
    { language: 'Hindi (हिंदी)', share: 38, count: 47458 },
    { language: 'Marathi (मराठी)', share: 22, count: 27475 },
    { language: 'Telugu (తెలుగు)', share: 14, count: 17484 },
    { language: 'Tamil (தமிழ்)', share: 12, count: 14986 },
    { language: 'Bengali / Gujarati', share: 9, count: 11240 },
    { language: 'English / Urdu Legacy', share: 5, count: 6247 }
  ]
};
