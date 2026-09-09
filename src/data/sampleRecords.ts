import { LandRecord } from '../types/landRecord';

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getRelativeDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayStr = getTodayDateString();
const currentYear = new Date().getFullYear();
const currentMutationNo = `${todayStr.replace(/-/g, '')}00421`;
const currentISOTime = new Date().toISOString();

export const SAMPLE_LAND_RECORDS: LandRecord[] = [
  {
    id: 'REC_UP_KHATAUNI_001',
    recordNumber: `UP-LKO-${currentYear}-KHT-00142`,
    documentType: 'KHATAUNI',
    documentTitle: 'उत्तर प्रदेश भू-अभिलेख (खतौनी / अधिकार अभिलेख)',
    documentLanguage: 'hi',
    documentYear: `1428-1433 फ़सली (${currentYear})`,
    imageUrl: 'SAMPLE_DOC_UP_KHATAUNI',
    originalFileName: 'UP_Khatauni_Mohanlalganj_142.pdf',
    fileSizeBytes: 2450800,
    uploadedAt: currentISOTime,
    processedAt: currentISOTime,
    status: 'VERIFICATION_PENDING',
    
    state: 'Uttar Pradesh (उत्तर प्रदेश)',
    district: 'Lucknow (लखनऊ)',
    tehsil: 'Mohanlalganj (मोहनलालगंज)',
    revenueVillage: 'Bhaupur (भाऊपुर)',
    gramPanchayat: 'Bhaupur Gram Sabha',
    pargana: 'Mohanlalganj',
    patwariHalkaNo: 'Halka 14',

    khataNumber: '00142',
    khasraNumber: '342/1',
    subDivisionNo: '1',
    plotAreaOriginal: 1.4500,
    plotAreaUnit: 'HECTARE',
    plotAreaHectares: 1.4500,
    landClassification: 'AGRICULTURAL_IRRIGATED',
    landRevenueTaxPaise: 4250,

    ownershipType: 'JOINT_PRIVATE',
    owners: [
      {
        id: 'OWNER_UP_01',
        name: 'Ramesh Chandra Sharma',
        vernacularName: 'रमेश चंद्र शर्मा',
        fatherOrSpouseName: 'Late Ram Swaroop Sharma',
        relationType: 'S/O',
        shareRatio: '1/2 (50%)',
        shareFraction: 0.5,
        aadhaarHash: 'XXXX-XXXX-8921',
        panHash: 'ABCPS****K',
        residence: 'Village Bhaupur, Mohanlalganj'
      },
      {
        id: 'OWNER_UP_02',
        name: 'Suresh Kumar Sharma',
        vernacularName: 'सुरेश कुमार शर्मा',
        fatherOrSpouseName: 'Late Ram Swaroop Sharma',
        relationType: 'S/O',
        shareRatio: '1/2 (50%)',
        shareFraction: 0.5,
        aadhaarHash: 'XXXX-XXXX-4412',
        panHash: 'BSRPS****L',
        residence: 'Village Bhaupur, Mohanlalganj'
      }
    ],

    mutations: [
      {
        mutationNo: currentMutationNo,
        orderDate: todayStr,
        transferType: 'INHERITANCE',
        sanctioningAuthority: 'Tehsildar Mohanlalganj',
        oldOwnerName: 'Ram Swaroop Sharma (Deceased)',
        newOwnerName: 'Ramesh Chandra & Suresh Kumar',
        status: 'SANCTIONED'
      }
    ],

    encumbrances: [
      {
        id: 'ENC_001',
        bankOrCreditorName: 'State Bank of India (Mohanlalganj Branch)',
        loanAmount: 350000,
        mortgageDate: getRelativeDateString(180),
        status: 'ACTIVE_LIEN',
        referenceNo: `KCC-MHL-${currentYear}-9901`
      }
    ],
    isLitigationPending: false,

    guidelineMarketValueINR: 4200000,
    stampDutyPaidINR: 294000,
    registrationBookNo: 'Book 1, Vol 142',
    registrationDate: getRelativeDateString(15),

    overallConfidence: 94.8,
    characterAccuracy: 97.2,
    ocrBoundingBoxes: [
      { id: 'b1', fieldKey: 'state', label: 'State / राज्य', x: 28, y: 8, width: 44, height: 4, page: 1, confidence: 99, extractedValue: 'उत्तर प्रदेश शासन' },
      { id: 'b2', fieldKey: 'district', label: 'District / जनपद', x: 12, y: 15, width: 22, height: 3.5, page: 1, confidence: 96, extractedValue: 'लखनऊ' },
      { id: 'b3', fieldKey: 'tehsil', label: 'Tehsil / तहसील', x: 38, y: 15, width: 25, height: 3.5, page: 1, confidence: 95, extractedValue: 'मोहनलालगंज' },
      { id: 'b4', fieldKey: 'revenueVillage', label: 'Village / ग्राम', x: 68, y: 15, width: 24, height: 3.5, page: 1, confidence: 94, extractedValue: 'भाऊपुर' },
      { id: 'b5', fieldKey: 'khataNumber', label: 'Khata No / खाता संख्या', x: 8, y: 28, width: 14, height: 4.5, page: 1, confidence: 98, extractedValue: '00142' },
      { id: 'b6', fieldKey: 'khasraNumber', label: 'Khasra No / खसरा संख्या', x: 26, y: 28, width: 16, height: 4.5, page: 1, confidence: 97, extractedValue: '342/1' },
      { id: 'b7', fieldKey: 'plotAreaOriginal', label: 'Area / क्षेत्रफल (हेक्टेयर)', x: 45, y: 28, width: 18, height: 4.5, page: 1, confidence: 95, extractedValue: '1.4500' },
      { id: 'b8', fieldKey: 'owner_1', label: 'Owner 1 / खातेदार का नाम', x: 66, y: 27, width: 28, height: 4, page: 1, confidence: 93, extractedValue: 'रमेश चंद्र शर्मा नि. ग्राम भाऊपुर' },
      { id: 'b9', fieldKey: 'owner_2', label: 'Owner 2 / सह-खातेदार', x: 66, y: 32, width: 28, height: 4, page: 1, confidence: 91, extractedValue: 'सुरेश कुमार शर्मा नि. ग्राम भाऊपुर' },
      { id: 'b10', fieldKey: 'mutation', label: 'Mutation / नामांतरण आदेश', x: 10, y: 55, width: 80, height: 8, page: 1, confidence: 89, extractedValue: `आदेशानुसार तहसीलदार वाद सं. ${todayStr.replace(/-/g, '')} वारिसाना दर्ज हुआ` }
    ],
    validationIssues: [],
    preprocessingConfig: {
      deskewAngle: 0.8,
      binarizationThreshold: 145,
      denoisingLevel: 30,
      contrastBoost: 40,
      inkRecovery: true,
      stampSuppression: false,
      superResolution: true
    },
    gisCoordinates: {
      lat: 26.6852,
      lng: 80.9785,
      polygonBounds: [
        [26.6845, 80.9778],
        [26.6860, 80.9778],
        [26.6861, 80.9795],
        [26.6846, 80.9794]
      ]
    },
    bhuvanParcelId: 'UP-BHU-09-342-01'
  },
  {
    id: 'REC_MH_SATBARA_002',
    recordNumber: `MH-PUN-${currentYear}-712-00078`,
    documentType: 'SATBARA_7_12',
    documentTitle: 'महाराष्ट्र शासन - गाव नमुना सात व बारा (7/12 Extract)',
    documentLanguage: 'mr',
    documentYear: `${currentYear}`,
    imageUrl: 'SAMPLE_DOC_MH_SATBARA',
    originalFileName: 'MahaBhumi_7_12_Mulshi_184.pdf',
    fileSizeBytes: 3120000,
    uploadedAt: currentISOTime,
    processedAt: currentISOTime,
    status: 'VERIFIED_PATWARI',

    state: 'Maharashtra (महाराष्ट्र)',
    district: 'Pune (पुणे)',
    tehsil: 'Mulshi (मुळशी / पौड)',
    revenueVillage: 'Paud (पौड)',
    gramPanchayat: 'Paud Gram Panchayat',
    pargana: 'Mulshi Valley',
    patwariHalkaNo: 'Saja No. 04',

    khataNumber: '78',
    khasraNumber: '184/2A',
    subDivisionNo: '2A',
    plotAreaOriginal: 0.8200,
    plotAreaUnit: 'HECTARE',
    plotAreaHectares: 0.8200,
    landClassification: 'AGRICULTURAL_IRRIGATED',
    landRevenueTaxPaise: 1850,

    ownershipType: 'JOINT_PRIVATE',
    owners: [
      {
        id: 'OWNER_MH_01',
        name: 'Ananda Tukaram Patil',
        vernacularName: 'आनंदा तुकाराम पाटील',
        fatherOrSpouseName: 'Tukaram Maruti Patil',
        relationType: 'S/O',
        shareRatio: '2/3 (66.67%)',
        shareFraction: 0.6667,
        aadhaarHash: 'XXXX-XXXX-3390',
        panHash: 'AUAPP****M',
        residence: 'Paud, Mulshi, Pune'
      },
      {
        id: 'OWNER_MH_02',
        name: 'Eknath Tukaram Patil',
        vernacularName: 'एकनाथ तुकाराम पाटील',
        fatherOrSpouseName: 'Tukaram Maruti Patil',
        relationType: 'S/O',
        shareRatio: '1/3 (33.33%)',
        shareFraction: 0.3333,
        aadhaarHash: 'XXXX-XXXX-7721',
        panHash: 'EXEPP****N',
        residence: 'Paud, Mulshi, Pune'
      }
    ],

    mutations: [
      {
        mutationNo: `Ferfar-${todayStr.replace(/-/g, '').slice(2, 6)}02`,
        orderDate: getRelativeDateString(30),
        transferType: 'PARTITION',
        sanctioningAuthority: 'Mandal Adhikari Paud',
        oldOwnerName: 'Tukaram Maruti Patil (Joint)',
        newOwnerName: 'Ananda & Eknath Patil',
        status: 'SANCTIONED'
      }
    ],

    encumbrances: [
      {
        id: 'ENC_MH_01',
        bankOrCreditorName: 'Bank of Maharashtra (Paud Branch)',
        loanAmount: 250000,
        mortgageDate: getRelativeDateString(120),
        status: 'ACTIVE_LIEN',
        referenceNo: `BOM-AGRI-${currentYear}-8871`
      }
    ],
    isLitigationPending: false,

    guidelineMarketValueINR: 8200000,
    stampDutyPaidINR: 492000,
    registrationBookNo: 'Mulshi SRO Reg 4410',
    registrationDate: getRelativeDateString(45),

    overallConfidence: 96.2,
    characterAccuracy: 98.4,
    ocrBoundingBoxes: [
      { id: 'mb1', fieldKey: 'state', label: 'State / राज्य', x: 25, y: 6, width: 50, height: 4, page: 1, confidence: 99, extractedValue: 'महाराष्ट्र शासन - महसूल विभाग' },
      { id: 'mb2', fieldKey: 'district', label: 'District / जिल्हा', x: 10, y: 14, width: 25, height: 3.5, page: 1, confidence: 97, extractedValue: 'पुणे' },
      { id: 'mb3', fieldKey: 'tehsil', label: 'Taluka / तालुका', x: 40, y: 14, width: 25, height: 3.5, page: 1, confidence: 98, extractedValue: 'मुळशी' },
      { id: 'mb4', fieldKey: 'revenueVillage', label: 'Village / गाव', x: 70, y: 14, width: 22, height: 3.5, page: 1, confidence: 96, extractedValue: 'पौड' },
      { id: 'mb5', fieldKey: 'khasraNumber', label: 'Gat No / गट क्रमांक', x: 12, y: 25, width: 20, height: 4.5, page: 1, confidence: 98, extractedValue: '१८४/२अ' },
      { id: 'mb6', fieldKey: 'plotAreaOriginal', label: 'Area / क्षेत्र (हे.आर.)', x: 36, y: 25, width: 24, height: 4.5, page: 1, confidence: 95, extractedValue: '०.८२.०० (८२ गुंठे)' },
      { id: 'mb7', fieldKey: 'owners', label: 'Occupant / खातेदार नावे', x: 64, y: 25, width: 32, height: 7, page: 1, confidence: 94, extractedValue: 'आनंदा तुकाराम पाटील (२/३), एकनाथ तुकाराम पाटील (१/३)' },
      { id: 'mb8', fieldKey: 'encumbrances', label: 'Other Rights / इतर हक्क (बोजा)', x: 10, y: 52, width: 80, height: 8, page: 1, confidence: 92, extractedValue: 'बोजा: बँक ऑफ महाराष्ट्र शाखा पौड रु. २,५०,०००/- पीक कर्ज' }
    ],
    validationIssues: [],
    preprocessingConfig: {
      deskewAngle: 0.0,
      binarizationThreshold: 140,
      denoisingLevel: 25,
      contrastBoost: 35,
      inkRecovery: true,
      stampSuppression: false,
      superResolution: true
    },
    gisCoordinates: {
      lat: 18.5204,
      lng: 73.6120,
      polygonBounds: [
        [18.5195, 73.6110],
        [18.5215, 73.6112],
        [18.5214, 73.6130],
        [18.5193, 73.6128]
      ]
    },
    bhuvanParcelId: 'MH-BHU-27-184-02'
  },
  {
    id: 'REC_TN_PATTA_003',
    recordNumber: `TN-KPM-${currentYear}-PAT-01408`,
    documentType: 'PATTA_CHITTA',
    documentTitle: 'தமிழ்நாடு அரசு வருவாய்த்துறை - பட்டா / சிட்டா சான்று',
    documentLanguage: 'ta',
    documentYear: `1433 பசலி (${currentYear})`,
    imageUrl: 'SAMPLE_DOC_TN_PATTA',
    originalFileName: 'TN_Patta_Chengalpattu_205.pdf',
    fileSizeBytes: 1980000,
    uploadedAt: currentISOTime,
    processedAt: currentISOTime,
    status: 'APPROVED_TEHSILDAR',

    state: 'Tamil Nadu (தமிழ்நாடு)',
    district: 'Chengalpattu (செங்கல்பட்டு)',
    tehsil: 'Thiruporur (திருப்போரூர்)',
    revenueVillage: 'Nemmeli (நெம்மேலி)',
    gramPanchayat: 'Nemmeli Panchayat',
    pargana: 'OMR Coastal Belt',
    patwariHalkaNo: 'VAO Circle 12',

    khataNumber: '1408',
    khasraNumber: '205/3B',
    subDivisionNo: '3B',
    plotAreaOriginal: 0.4047,
    plotAreaUnit: 'HECTARE',
    plotAreaHectares: 0.4047,
    landClassification: 'NON_AGRICULTURAL_RESIDENTIAL',
    landRevenueTaxPaise: 800,

    ownershipType: 'INDIVIDUAL',
    owners: [
      {
        id: 'OWNER_TN_01',
        name: 'S. Murugesan Pillai',
        vernacularName: 'எஸ். முருகேசன் பிள்ளை',
        fatherOrSpouseName: 'Shanmugam Pillai',
        relationType: 'S/O',
        shareRatio: '1/1 (100%)',
        shareFraction: 1.0,
        aadhaarHash: 'XXXX-XXXX-9932',
        panHash: 'CMPPM****R',
        residence: 'East Coast Road, Nemmeli'
      }
    ],

    mutations: [
      {
        mutationNo: `TR-${currentYear}-8812`,
        orderDate: getRelativeDateString(10),
        transferType: 'SALE_PURCHASE',
        sanctioningAuthority: 'Zonal Deputy Tahsildar Thiruporur',
        oldOwnerName: 'V. Rajendran',
        newOwnerName: 'S. Murugesan Pillai',
        status: 'SANCTIONED'
      }
    ],

    encumbrances: [],
    isLitigationPending: false,

    guidelineMarketValueINR: 6500000,
    stampDutyPaidINR: 455000,
    registrationBookNo: 'Doc No 3812/2022 SRO Thiruporur',
    registrationDate: '2022-11-05',

    overallConfidence: 98.1,
    characterAccuracy: 99.1,
    ocrBoundingBoxes: [
      { id: 'tb1', fieldKey: 'state', label: 'Government / அரசு', x: 22, y: 7, width: 56, height: 4, page: 1, confidence: 99, extractedValue: 'தமிழ்நாடு அரசு வருவாய்த்துறை' },
      { id: 'tb2', fieldKey: 'district', label: 'District / மாவட்டம்', x: 12, y: 16, width: 24, height: 3.5, page: 1, confidence: 98, extractedValue: 'செங்கல்பட்டு' },
      { id: 'tb3', fieldKey: 'tehsil', label: 'Taluk / வட்டம்', x: 42, y: 16, width: 24, height: 3.5, page: 1, confidence: 98, extractedValue: 'திருப்போரூர்' },
      { id: 'tb4', fieldKey: 'revenueVillage', label: 'Village / கிராமம்', x: 72, y: 16, width: 22, height: 3.5, page: 1, confidence: 97, extractedValue: 'நெம்மேலி' },
      { id: 'tb5', fieldKey: 'khataNumber', label: 'Patta No / பட்டா எண்', x: 10, y: 26, width: 22, height: 4.5, page: 1, confidence: 99, extractedValue: '1408' },
      { id: 'tb6', fieldKey: 'khasraNumber', label: 'Survey No / புல எண்', x: 38, y: 26, width: 25, height: 4.5, page: 1, confidence: 98, extractedValue: '205/3B' },
      { id: 'tb7', fieldKey: 'plotAreaOriginal', label: 'Area / பரப்பு (ஹெக்)', x: 68, y: 26, width: 24, height: 4.5, page: 1, confidence: 97, extractedValue: '0.40.47 (1 Acre)' },
      { id: 'tb8', fieldKey: 'owners', label: 'Pattadhar / பட்டாதாரர் பெயர்', x: 15, y: 38, width: 70, height: 6, page: 1, confidence: 96, extractedValue: 'எஸ். முருகேசன் பிள்ளை த/பெ சண்முகம் பிள்ளை' }
    ],
    validationIssues: [],
    preprocessingConfig: {
      deskewAngle: 0.0,
      binarizationThreshold: 150,
      denoisingLevel: 20,
      contrastBoost: 30,
      inkRecovery: false,
      stampSuppression: false,
      superResolution: true
    },
    gisCoordinates: {
      lat: 12.6981,
      lng: 80.2014,
      polygonBounds: [
        [12.6975, 80.2005],
        [12.6990, 80.2008],
        [12.6989, 80.2023],
        [12.6973, 80.2020]
      ]
    },
    bhuvanParcelId: 'TN-BHU-33-205-3B'
  },
  {
    id: 'REC_DISPUTED_AREA_MISMATCH_004',
    recordNumber: `UP-RAM-${currentYear}-KHT-00512`,
    documentType: 'JAMABANDI',
    documentTitle: 'ऐतिहासिक जमाबंदी व विक्रयन पत्र (Faded Legacy Urdu/Hindi Record)',
    documentLanguage: 'hi',
    documentYear: '1388 फ़सली (Legacy Archive)',
    imageUrl: 'SAMPLE_DOC_LEGACY_JAMABANDI',
    originalFileName: 'Legacy_Jamabandi_Rampur_512.pdf',
    fileSizeBytes: 4210000,
    uploadedAt: currentISOTime,
    processedAt: currentISOTime,
    status: 'DISPUTED',

    state: 'Uttar Pradesh (उत्तर प्रदेश)',
    district: 'Rampur (रामपुर)',
    tehsil: 'Bilaspur (बिलासपुर)',
    revenueVillage: 'Kalyanpur (कल्याणपुर)',
    gramPanchayat: 'Kalyanpur',
    pargana: 'Bilaspur',
    patwariHalkaNo: 'Halka 09',

    khataNumber: '00512',
    khasraNumber: '118/3',
    subDivisionNo: '3',
    plotAreaOriginal: 2.5000,
    plotAreaUnit: 'HECTARE',
    plotAreaHectares: 2.5000,
    landClassification: 'AGRICULTURAL_UNIRRIGATED',
    landRevenueTaxPaise: 6800,

    ownershipType: 'JOINT_PRIVATE',
    owners: [
      {
        id: 'OWNER_DISP_01',
        name: 'Mohammed Aslam Khan',
        vernacularName: 'मोहम्मद असलम खां',
        fatherOrSpouseName: 'Late Akhtar Khan',
        relationType: 'S/O',
        shareRatio: '3/4 (75%)',
        shareFraction: 0.75,
        aadhaarHash: 'XXXX-XXXX-1102',
        residence: 'Bilaspur, Rampur'
      },
      {
        id: 'OWNER_DISP_02',
        name: 'Zameer Akhtar Khan',
        vernacularName: 'ज़मीर अख्तर खां',
        fatherOrSpouseName: 'Late Akhtar Khan',
        relationType: 'S/O',
        shareRatio: '1/2 (50%)', // Deliberate mismatch: 75% + 50% = 125% to trigger AI Rule Validation!
        shareFraction: 0.5,
        aadhaarHash: 'XXXX-XXXX-9901',
        residence: 'Bilaspur, Rampur'
      }
    ],

    mutations: [
      {
        mutationNo: 'MUT-1985-221',
        orderDate: '1985-06-12',
        transferType: 'PARTITION',
        sanctioningAuthority: 'Naib Tehsildar Bilaspur',
        oldOwnerName: 'Akhtar Khan',
        newOwnerName: 'Aslam Khan & Zameer Khan',
        status: 'OBJECTED'
      }
    ],

    encumbrances: [],
    isLitigationPending: true,
    litigationCaseNo: 'SDM/BLS/CIVIL/2023/184',

    guidelineMarketValueINR: 5000000,
    stampDutyPaidINR: 150000, // Deliberate deficit for demo

    overallConfidence: 68.4, // Low confidence to trigger Human-in-the-Loop review
    characterAccuracy: 74.0,
    ocrBoundingBoxes: [
      { id: 'db1', fieldKey: 'state', label: 'State / प्रदेश', x: 30, y: 6, width: 40, height: 4, page: 1, confidence: 85, extractedValue: 'उत्तर प्रदेश भू-अभिलेख' },
      { id: 'db2', fieldKey: 'district', label: 'District / जिला', x: 10, y: 15, width: 24, height: 3.5, page: 1, confidence: 78, extractedValue: 'रामपुर' },
      { id: 'db3', fieldKey: 'tehsil', label: 'Tehsil / तहसील', x: 40, y: 15, width: 24, height: 3.5, page: 1, confidence: 65, extractedValue: 'बिलासपुर' },
      { id: 'db4', fieldKey: 'revenueVillage', label: 'Village / मौजा', x: 70, y: 15, width: 22, height: 3.5, page: 1, confidence: 62, extractedValue: 'कल्याणपुर' },
      { id: 'db5', fieldKey: 'khasraNumber', label: 'Khasra No / खसरा नंबर', x: 15, y: 28, width: 20, height: 4.5, page: 1, confidence: 58, extractedValue: '११८/३' },
      { id: 'db6', fieldKey: 'plotAreaOriginal', label: 'Area / रकबा (हे.)', x: 40, y: 28, width: 20, height: 4.5, page: 1, confidence: 64, extractedValue: '२.५०००' },
      { id: 'db7', fieldKey: 'owners', label: 'Landowners / काश्तकार', x: 65, y: 28, width: 30, height: 8, page: 1, confidence: 59, extractedValue: 'मोहम्मद असलम खां (३/४) व ज़मीर अख्तर खां (१/२)' }
    ],
    validationIssues: [
      {
        id: 'VAL_ISSUE_001',
        severity: 'CRITICAL',
        field: 'owners',
        ruleCode: 'BR_REV_001_SHARE_MISMATCH',
        title: 'Co-Owner Share Ratio Mismatch',
        message: 'Sum of co-owner shares equals 125.00% (expected 100.00%). Discrepancy of 25.00% detected in Khata plot area allocation.',
        suggestedFix: 'Re-normalize individual owner shares proportionally or check partition deed.',
        autoResolvable: true,
        resolved: false
      },
      {
        id: 'VAL_ISSUE_002',
        severity: 'CRITICAL',
        field: 'isLitigationPending',
        ruleCode: 'BR_REV_012_PENDING_LITIGATION',
        title: 'Pending Title Dispute / Court Injunction',
        message: 'Active civil stay case SDM/BLS/CIVIL/2023/184 registered on Khasra 118/3 in Sub-Divisional Court.',
        suggestedFix: 'Freeze automatic digitization sync until Tehsildar judicial clearance.',
        autoResolvable: false,
        resolved: false
      },
      {
        id: 'VAL_ISSUE_003',
        severity: 'WARNING',
        field: 'stampDutyPaidINR',
        ruleCode: 'BR_REV_010_STAMP_DUTY_DEFICIT',
        title: 'Stamp Duty Deficit Detected',
        message: 'Stamp duty paid (₹1,50,000) is substantially below standard circle rate minimum (₹2,50,000).',
        suggestedFix: 'Review Registration & Stamp Department valuation certificate.',
        autoResolvable: false,
        resolved: false
      }
    ],
    preprocessingConfig: {
      deskewAngle: -2.4,
      binarizationThreshold: 175,
      denoisingLevel: 55,
      contrastBoost: 60,
      inkRecovery: true,
      stampSuppression: true,
      superResolution: true
    },
    gisCoordinates: {
      lat: 28.8833,
      lng: 79.2667,
      polygonBounds: [
        [28.8820, 79.2650],
        [28.8845, 79.2655],
        [28.8843, 79.2680],
        [28.8818, 79.2675]
      ]
    },
    bhuvanParcelId: 'UP-BHU-09-118-03'
  },
  {
    id: 'REC_AP_PAHANI_005',
    recordNumber: `TG-HYD-${currentYear}-PAH-00891`,
    documentType: 'PAHANI_ADANGAL',
    documentTitle: 'తెలంగాణ ప్రభుత్వం - పహానీ / అడంగల్ (ROR-1B Record)',
    documentLanguage: 'te',
    documentYear: `${currentYear} (1434 ఫసలీ)`,
    imageUrl: 'SAMPLE_DOC_TG_PAHANI',
    originalFileName: 'Dharani_Pahani_Shamshabad_89A.pdf',
    fileSizeBytes: 2890000,
    uploadedAt: currentISOTime,
    processedAt: currentISOTime,
    status: 'SYNCED_LRMS',

    state: 'Telangana (తెలంగాణ)',
    district: 'Ranga Reddy (రంగారెడ్డి)',
    tehsil: 'Shamshabad (శంషాబాద్)',
    revenueVillage: 'Mamidipally (మామిడిపల్లి)',
    gramPanchayat: 'Mamidipally',
    pargana: 'Rajendranagar Division',
    patwariHalkaNo: 'Sector 02',

    khataNumber: '512',
    khasraNumber: '89/A',
    subDivisionNo: 'A',
    plotAreaOriginal: 2.1000,
    plotAreaUnit: 'HECTARE',
    plotAreaHectares: 2.1000,
    landClassification: 'AGRICULTURAL_IRRIGATED',
    landRevenueTaxPaise: 5200,

    ownershipType: 'INDIVIDUAL',
    owners: [
      {
        id: 'OWNER_TG_01',
        name: 'Venkateswara Rao',
        vernacularName: 'వెంకటేశ్వర రావు',
        fatherOrSpouseName: 'Satyanarayana',
        relationType: 'S/O',
        shareRatio: '1/1 (100%)',
        shareFraction: 1.0,
        aadhaarHash: 'XXXX-XXXX-5541',
        panHash: 'AYRPR****Q',
        residence: 'Shamshabad, Ranga Reddy'
      }
    ],

    mutations: [
      {
        mutationNo: `DHARANI-MUT-${currentYear}-998`,
        orderDate: getRelativeDateString(60),
        transferType: 'SALE_PURCHASE',
        sanctioningAuthority: 'Tahsildar Shamshabad',
        oldOwnerName: 'K. Ramaiah',
        newOwnerName: 'Venkateswara Rao',
        status: 'SANCTIONED'
      }
    ],

    encumbrances: [],
    isLitigationPending: false,

    guidelineMarketValueINR: 12500000,
    stampDutyPaidINR: 875000,
    registrationBookNo: 'Shamshabad SRO Vol 112',
    registrationDate: getRelativeDateString(60),

    overallConfidence: 97.4,
    characterAccuracy: 98.9,
    ocrBoundingBoxes: [
      { id: 'ab1', fieldKey: 'state', label: 'Government / ప్రభుత్వం', x: 25, y: 7, width: 50, height: 4, page: 1, confidence: 99, extractedValue: 'తెలంగాణ ప్రభుత్వం - భూపరిపాలన శాఖ' },
      { id: 'ab2', fieldKey: 'district', label: 'District / జిల్లా', x: 12, y: 15, width: 24, height: 3.5, page: 1, confidence: 98, extractedValue: 'రంగారెడ్డి' },
      { id: 'ab3', fieldKey: 'tehsil', label: 'Mandal / మండలం', x: 42, y: 15, width: 24, height: 3.5, page: 1, confidence: 97, extractedValue: 'శంషాబాద్' },
      { id: 'ab4', fieldKey: 'revenueVillage', label: 'Village / గ్రామం', x: 72, y: 15, width: 22, height: 3.5, page: 1, confidence: 98, extractedValue: 'మామిడిపల్లి' },
      { id: 'ab5', fieldKey: 'khataNumber', label: 'Khata No / ఖాతా నం.', x: 10, y: 26, width: 20, height: 4.5, page: 1, confidence: 99, extractedValue: '512' },
      { id: 'ab6', fieldKey: 'khasraNumber', label: 'Sy. No / సర్వే నం.', x: 35, y: 26, width: 25, height: 4.5, page: 1, confidence: 98, extractedValue: '89/A' },
      { id: 'ab7', fieldKey: 'plotAreaOriginal', label: 'Area / విస్తీర్ణం (హె.)', x: 65, y: 26, width: 28, height: 4.5, page: 1, confidence: 96, extractedValue: '2.1000 (5.18 ఎకరాలు)' },
      { id: 'ab8', fieldKey: 'owners', label: 'Pattadar / పట్టాదారుని పేరు', x: 15, y: 38, width: 70, height: 6, page: 1, confidence: 97, extractedValue: 'వెంకటేశ్వర రావు త/తం సత్యనారాయణ' }
    ],
    validationIssues: [],
    preprocessingConfig: {
      deskewAngle: 0.0,
      binarizationThreshold: 142,
      denoisingLevel: 20,
      contrastBoost: 30,
      inkRecovery: false,
      stampSuppression: false,
      superResolution: true
    },
    gisCoordinates: {
      lat: 17.2403,
      lng: 78.4294,
      polygonBounds: [
        [17.2395, 78.4285],
        [17.2415, 78.4287],
        [17.2413, 78.4305],
        [17.2393, 78.4302]
      ]
    },
    bhuvanParcelId: 'TG-BHU-36-89-0A'
  }
];
