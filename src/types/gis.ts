export interface CadastralFeature {
  id: string;
  type: 'Feature';
  properties: {
    khasraNo: string;
    khataNo: string;
    village: string;
    tehsil: string;
    district: string;
    state: string;
    ownerName: string;
    areaHectares: number;
    landUse: string;
    soilType: string;
    irrigationStatus: string;
    marketValueINR: number;
    mutationStatus: 'CLEAR' | 'PENDING_MUTATION' | 'DISPUTED';
    disputeFlag: boolean;
    disputeReason?: string;
    bhuvanId: string;
    lastSurveyYear: number;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // GeoJSON format [lng, lat]
  };
}

export interface CadastralFeatureCollection {
  type: 'FeatureCollection';
  features: CadastralFeature[];
}
