import { CadastralFeatureCollection } from '../types/gis';

export const CADASTRAL_SAMPLE_GEOJSON: CadastralFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      id: 'PARCEL_342_1',
      type: 'Feature',
      properties: {
        khasraNo: '342/1',
        khataNo: '00142',
        village: 'Bhaupur (भाऊपुर)',
        tehsil: 'Mohanlalganj',
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        ownerName: 'Ramesh Chandra & Suresh Kumar Sharma',
        areaHectares: 1.4500,
        landUse: 'Agricultural - Double Cropped',
        soilType: 'Alluvial Loam (Domat)',
        irrigationStatus: 'Tube-well Irrigated',
        marketValueINR: 4200000,
        mutationStatus: 'CLEAR',
        disputeFlag: false,
        bhuvanId: 'UP-BHU-09-342-01',
        lastSurveyYear: 2023
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.9778, 26.6845],
            [80.9778, 26.6860],
            [80.9795, 26.6861],
            [80.9794, 26.6846],
            [80.9778, 26.6845]
          ]
        ]
      }
    },
    {
      id: 'PARCEL_342_2',
      type: 'Feature',
      properties: {
        khasraNo: '342/2',
        khataNo: '00143',
        village: 'Bhaupur (भाऊपुर)',
        tehsil: 'Mohanlalganj',
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        ownerName: 'Gram Sabha Common Pasture (चारागाह)',
        areaHectares: 0.9200,
        landUse: 'Community Grazing / Pasture',
        soilType: 'Sandy Loam',
        irrigationStatus: 'Rainfed',
        marketValueINR: 1800000,
        mutationStatus: 'CLEAR',
        disputeFlag: false,
        bhuvanId: 'UP-BHU-09-342-02',
        lastSurveyYear: 2023
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.9795, 26.6846],
            [80.9795, 26.6861],
            [80.9815, 26.6862],
            [80.9813, 26.6847],
            [80.9795, 26.6846]
          ]
        ]
      }
    },
    {
      id: 'PARCEL_118_3',
      type: 'Feature',
      properties: {
        khasraNo: '118/3',
        khataNo: '00512',
        village: 'Kalyanpur (कल्याणपुर)',
        tehsil: 'Bilaspur',
        district: 'Rampur',
        state: 'Uttar Pradesh',
        ownerName: 'Mohammed Aslam Khan & Zameer Khan',
        areaHectares: 2.5000,
        landUse: 'Agricultural - Sugarcane',
        soilType: 'Tarai Heavy Clay',
        irrigationStatus: 'Canal Irrigated',
        marketValueINR: 5000000,
        mutationStatus: 'DISPUTED',
        disputeFlag: true,
        disputeReason: 'Area allocation discrepancy (125% share sum) & Civil Court stay order',
        bhuvanId: 'UP-BHU-09-118-03',
        lastSurveyYear: 2021
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.9755, 26.6830],
            [80.9758, 26.6852],
            [80.9776, 26.6850],
            [80.9774, 26.6828],
            [80.9755, 26.6830]
          ]
        ]
      }
    },
    {
      id: 'PARCEL_184_2A',
      type: 'Feature',
      properties: {
        khasraNo: '184/2A',
        khataNo: '78',
        village: 'Paud (पौड)',
        tehsil: 'Mulshi',
        district: 'Pune',
        state: 'Maharashtra',
        ownerName: 'Ananda & Eknath Tukaram Patil',
        areaHectares: 0.8200,
        landUse: 'Horticulture (Rice & Mango)',
        soilType: 'Black Cotton / Laterite',
        irrigationStatus: 'Drip / Well',
        marketValueINR: 8200000,
        mutationStatus: 'CLEAR',
        disputeFlag: false,
        bhuvanId: 'MH-BHU-27-184-02',
        lastSurveyYear: 2024
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.9815, 26.6847],
            [80.9816, 26.6865],
            [80.9838, 26.6863],
            [80.9835, 26.6845],
            [80.9815, 26.6847]
          ]
        ]
      }
    }
  ]
};
