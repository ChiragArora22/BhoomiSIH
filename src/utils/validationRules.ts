import { LandRecord, ValidationIssue } from '../types/landRecord';
import { parseShareFraction } from './areaConverter';

/**
 * Automated Revenue Business Rule Validation Engine
 * Evaluates land records for compliance, discrepancies, duplicate detection, and fraud risk.
 */
export function validateLandRecord(record: LandRecord, allExistingRecords: LandRecord[] = []): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // 1. Area Share Summation Check
  if (record.owners && record.owners.length > 0) {
    const totalShareSum = record.owners.reduce((acc, owner) => {
      return acc + (owner.shareFraction || parseShareFraction(owner.shareRatio));
    }, 0);

    const shareTolerance = 0.005; // 0.5% tolerance
    if (Math.abs(totalShareSum - 1.0) > shareTolerance) {
      const percentage = (totalShareSum * 100).toFixed(2);
      issues.push({
        id: `ISSUE_AREA_SHARE_${Date.now()}_1`,
        severity: 'CRITICAL',
        field: 'owners',
        ruleCode: 'BR_REV_001_SHARE_MISMATCH',
        title: 'Co-Owner Share Ratio Mismatch',
        message: `Sum of co-owner shares equals ${percentage}% (expected 100.00%). Discrepancy of ${((totalShareSum - 1.0) * 100).toFixed(2)}% detected in Khata plot area allocation.`,
        suggestedFix: 'Re-normalize individual owner shares proportionally or check mutation partition deed.',
        autoResolvable: true,
        resolved: false
      });
    }
  } else {
    issues.push({
      id: `ISSUE_NO_OWNER_${Date.now()}`,
      severity: 'CRITICAL',
      field: 'owners',
      ruleCode: 'BR_REV_002_NO_OWNER',
      title: 'Missing Landowner Records',
      message: 'No registered landowner or cultivator found in Column 2 (Khatedar Details).',
      suggestedFix: 'Manually transcribe owner names from original scanned column.',
      autoResolvable: false,
      resolved: false
    });
  }

  // 2. Khasra / Survey Number Format Check
  if (!record.khasraNumber || record.khasraNumber.trim() === '') {
    issues.push({
      id: `ISSUE_KHASRA_EMPTY_${Date.now()}`,
      severity: 'CRITICAL',
      field: 'khasraNumber',
      ruleCode: 'BR_REV_003_EMPTY_KHASRA',
      title: 'Missing Khasra / Dag / Survey Number',
      message: 'Khasra identifier is empty or unreadable due to ink fading.',
      suggestedFix: 'Review high-resolution zoomed view of header section.',
      autoResolvable: false,
      resolved: false
    });
  } else {
    // Standard Khasra format: e.g. 124, 124/1, 124/2ka, 88-A
    const khasraPattern = /^[\d\w\/\-\.\s\u0900-\u097F]+$/;
    if (!khasraPattern.test(record.khasraNumber)) {
      issues.push({
        id: `ISSUE_KHASRA_FORMAT_${Date.now()}`,
        severity: 'WARNING',
        field: 'khasraNumber',
        ruleCode: 'BR_REV_004_INVALID_KHASRA_CHARS',
        title: 'Unusual Characters in Khasra Number',
        message: `Khasra number "${record.khasraNumber}" contains non-standard revenue symbols.`,
        suggestedFix: 'Sanitize special characters or confirm regional suffix.',
        autoResolvable: true,
        resolved: false
      });
    }
  }

  // 3. Duplicate Khasra Detection in Same Revenue Village
  const duplicates = allExistingRecords.filter(r => 
    r.id !== record.id &&
    r.khasraNumber.trim().toLowerCase() === record.khasraNumber.trim().toLowerCase() &&
    r.revenueVillage.trim().toLowerCase() === record.revenueVillage.trim().toLowerCase() &&
    r.district.trim().toLowerCase() === record.district.trim().toLowerCase()
  );

  if (duplicates.length > 0) {
    issues.push({
      id: `ISSUE_DUPLICATE_KHASRA_${Date.now()}`,
      severity: 'CRITICAL',
      field: 'khasraNumber',
      ruleCode: 'BR_REV_005_DUPLICATE_PARCEL',
      title: 'Potential Duplicate Parcel / Dual Allotment',
      message: `Khasra ${record.khasraNumber} in village "${record.revenueVillage}" is already registered under Record ${duplicates[0].recordNumber} (Owner: ${duplicates[0].owners[0]?.name || 'Unknown'}).`,
      suggestedFix: 'Flag for Sub-Divisional Magistrate (SDM) title dispute adjudication.',
      autoResolvable: false,
      resolved: false
    });
  }

  // 4. Protected / Government Land Encroachment Check
  const protectedTypes = ['GOVERNMENT_GRAM_SABHA', 'FOREST_PROTECTED', 'WATERBODY_WETLAND', 'WAKF_RELIGIOUS_TRUST'];
  if (protectedTypes.includes(record.landClassification)) {
    const isIndividualOwner = record.ownershipType === 'INDIVIDUAL' || record.ownershipType === 'JOINT_PRIVATE';
    if (isIndividualOwner) {
      issues.push({
        id: `ISSUE_PROTECTED_ENCROACHMENT_${Date.now()}`,
        severity: 'CRITICAL',
        field: 'landClassification',
        ruleCode: 'BR_REV_006_PROTECTED_ENCROACHMENT',
        title: 'Encroachment Alert on Protected / Government Land',
        message: `Land classified as "${record.landClassification.replace(/_/g, ' ')}" cannot have individual private tenure ownership. High fraud risk detected.`,
        suggestedFix: 'Verify Gazette notification and reclassify as State / Gram Sabha property if private claim is illegal.',
        autoResolvable: false,
        resolved: false
      });
    }
  }

  // 5. Plot Area Bounds Verification
  if (!record.plotAreaHectares || record.plotAreaHectares <= 0) {
    issues.push({
      id: `ISSUE_AREA_ZERO_${Date.now()}`,
      severity: 'CRITICAL',
      field: 'plotAreaOriginal',
      ruleCode: 'BR_REV_007_ZERO_AREA',
      title: 'Invalid or Zero Plot Area',
      message: 'Plot area is registered as 0.0000 or could not be recognized from the area column.',
      suggestedFix: 'Extract numerical area value from column 3 of the record.',
      autoResolvable: false,
      resolved: false
    });
  } else if (record.plotAreaHectares > 50) {
    issues.push({
      id: `ISSUE_AREA_CEILING_${Date.now()}`,
      severity: 'WARNING',
      field: 'plotAreaOriginal',
      ruleCode: 'BR_REV_008_LAND_CEILING',
      title: 'Agricultural Land Ceiling Threshold Exceeded',
      message: `Total plot area is ${record.plotAreaHectares.toFixed(4)} Hectares (> 50 Ha). Check Agricultural Land Ceiling Act compliance.`,
      suggestedFix: 'Confirm if special institutional or plantation exemption applies.',
      autoResolvable: false,
      resolved: false
    });
  }

  // 6. Aadhaar / Identity Checksum Format Validation
  record.owners.forEach((owner, idx) => {
    if (owner.aadhaarHash) {
      const cleanAadhaar = owner.aadhaarHash.replace(/\D/g, '');
      if (cleanAadhaar.length > 0 && cleanAadhaar.length !== 12 && cleanAadhaar.length !== 4) {
        issues.push({
          id: `ISSUE_AADHAAR_LEN_${idx}_${Date.now()}`,
          severity: 'WARNING',
          field: `owners[${idx}].aadhaarHash`,
          ruleCode: 'BR_REV_009_AADHAAR_FORMAT',
          title: `Malformed Identity Hash for ${owner.name}`,
          message: `Aadhaar token "${owner.aadhaarHash}" does not match UIDAI 12-digit or 4-digit masked standard.`,
          suggestedFix: 'Mask to standard format: XXXX-XXXX-' + (cleanAadhaar.slice(-4) || '0000'),
          autoResolvable: true,
          resolved: false
        });
      }
    }
  });

  // 7. Stamp Duty & Guideline Market Valuation Check
  if (record.guidelineMarketValueINR && record.stampDutyPaidINR) {
    const expectedStampDuty = record.guidelineMarketValueINR * 0.05; // Standard 5-7%
    if (record.stampDutyPaidINR < expectedStampDuty * 0.7) {
      issues.push({
        id: `ISSUE_STAMP_DEFICIT_${Date.now()}`,
        severity: 'WARNING',
        field: 'stampDutyPaidINR',
        ruleCode: 'BR_REV_010_STAMP_DUTY_DEFICIT',
        title: 'Stamp Duty Deficit Detected',
        message: `Stamp duty paid (₹${record.stampDutyPaidINR.toLocaleString('en-IN')}) is substantially below standard circle rate minimum (₹${Math.round(expectedStampDuty).toLocaleString('en-IN')}).`,
        suggestedFix: 'Review Registration & Stamp Department valuation certificate.',
        autoResolvable: false,
        resolved: false
      });
    }
  }

  // 8. Low OCR Confidence Warning
  const lowConfidenceBoxes = record.ocrBoundingBoxes.filter(box => box.confidence < 70);
  if (lowConfidenceBoxes.length > 0) {
    issues.push({
      id: `ISSUE_LOW_CONFIDENCE_${Date.now()}`,
      severity: 'INFO',
      field: 'ocrBoundingBoxes',
      ruleCode: 'BR_REV_011_LOW_OCR_CONFIDENCE',
      title: `${lowConfidenceBoxes.length} Fields Require Manual Confirmation`,
      message: `AI confidence is below 70% for fields: ${lowConfidenceBoxes.map(b => b.label).join(', ')}.`,
      suggestedFix: 'Verify highlighted amber/red bounding boxes in split-screen editor.',
      autoResolvable: false,
      resolved: false
    });
  }

  return issues;
}
