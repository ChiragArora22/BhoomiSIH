export type AreaUnit = 'HECTARE' | 'ACRE' | 'BIGHA' | 'BISWA' | 'GUNTHA' | 'SQ_METER' | 'SQ_FEET';

// Conversion factors relative to 1 HECTARE (10,000 sq meters)
export const AREA_CONVERSIONS_TO_HECTARE: Record<AreaUnit, number> = {
  HECTARE: 1,
  ACRE: 0.404686,
  BIGHA: 0.2529, // Standard UP/MP Pucca Bigha (~2529.28 sq meters)
  BISWA: 0.012646, // 1/20 of Pucca Bigha
  GUNTHA: 0.010117, // Maharashtra / Karnataka / Gujarat (101.17 sq meters)
  SQ_METER: 0.0001,
  SQ_FEET: 0.0000092903
};

export const UNIT_LABELS: Record<AreaUnit, { en: string; hi: string; symbol: string }> = {
  HECTARE: { en: 'Hectare', hi: 'हेक्टेयर', symbol: 'ha' },
  ACRE: { en: 'Acre', hi: 'एकड़', symbol: 'ac' },
  BIGHA: { en: 'Bigha (Pucca)', hi: 'बीघा (पक्का)', symbol: 'bigha' },
  BISWA: { en: 'Biswa', hi: 'बिस्वा', symbol: 'biswa' },
  GUNTHA: { en: 'Guntha', hi: 'गुंठा', symbol: 'guntha' },
  SQ_METER: { en: 'Square Meter', hi: 'वर्ग मीटर', symbol: 'sq m' },
  SQ_FEET: { en: 'Square Feet', hi: 'वर्ग फुट', symbol: 'sq ft' }
};

/**
 * Converts area from one unit to another
 */
export function convertArea(amount: number, fromUnit: AreaUnit, toUnit: AreaUnit): number {
  if (!amount || isNaN(amount)) return 0;
  const inHectares = amount * AREA_CONVERSIONS_TO_HECTARE[fromUnit];
  const converted = inHectares / AREA_CONVERSIONS_TO_HECTARE[toUnit];
  return Number(converted.toFixed(4));
}

/**
 * Parses fractional share strings like "1/2", "1/4", "33.33%", "0.5" into numeric fraction
 */
export function parseShareFraction(shareRatio: string): number {
  if (!shareRatio) return 0;
  const trimmed = shareRatio.trim();
  
  if (trimmed.includes('/')) {
    const fractionMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (fractionMatch) {
      const num = parseFloat(fractionMatch[1]);
      const den = parseFloat(fractionMatch[2]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }
  
  if (trimmed.includes('%')) {
    const val = parseFloat(trimmed.replace('%', ''));
    if (!isNaN(val)) return val / 100;
  }
  
  const parsed = parseFloat(trimmed);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Converts a percentage value (e.g. 25, 33.33, 50, 75, 12.5) into a reduced fraction string (e.g. "1/4", "1/3", "1/2", "3/4", "1/8")
 */
export function percentageToFraction(percentageVal: number | string): string {
  const pct = typeof percentageVal === 'string' ? parseFloat(percentageVal) : percentageVal;
  if (isNaN(pct) || pct <= 0) return '0/1';
  if (pct >= 100) return '1/1';

  // 1. Check known common revenue land share lookup table
  const rounded2 = Math.round(pct * 100) / 100;
  const commonMap: Record<number, string> = {
    100: '1/1',
    50: '1/2',
    33.33: '1/3',
    33.34: '1/3',
    66.66: '2/3',
    66.67: '2/3',
    25: '1/4',
    75: '3/4',
    20: '1/5',
    40: '2/5',
    60: '3/5',
    80: '4/5',
    16.66: '1/6',
    16.67: '1/6',
    83.33: '5/6',
    83.34: '5/6',
    14.28: '1/7',
    14.29: '1/7',
    28.57: '2/7',
    42.86: '3/7',
    57.14: '4/7',
    71.43: '5/7',
    85.71: '6/7',
    12.5: '1/8',
    37.5: '3/8',
    62.5: '5/8',
    87.5: '7/8',
    11.11: '1/9',
    10: '1/10',
    30: '3/10',
    70: '7/10',
    90: '9/10',
    8.33: '1/12',
    6.25: '1/16'
  };

  if (commonMap[rounded2]) {
    return commonMap[rounded2];
  }

  // 2. Rational approximation (Farey sequence / Continued fraction)
  const decimal = pct / 100;
  let bestNum = 1;
  let bestDen = 1;
  let bestErr = Math.abs(decimal - bestNum / bestDen);

  for (let den = 1; den <= 120; den++) {
    const num = Math.round(decimal * den);
    const err = Math.abs(decimal - num / den);
    if (err < bestErr) {
      bestNum = num;
      bestDen = den;
      bestErr = err;
      if (err < 1e-5) break;
    }
  }

  return `${bestNum}/${bestDen}`;
}

/**
 * Extracts distinct fraction and percentage strings and numerical values from any shareRatio representation.
 */
export function extractFractionAndPercentage(shareRatio: string): {
  fractionStr: string;
  percentageStr: string;
  fraction: number;
  percentage: number;
} {
  if (!shareRatio) {
    return { fractionStr: '', percentageStr: '', fraction: 0, percentage: 0 };
  }
  const trimmed = shareRatio.trim();

  // Pattern: "1/4 (25%)" or "1/4" or "2/3 (66.67%)"
  const fractionWithPctMatch = trimmed.match(/^(\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?)(?:\s*\(([\d.]+)%?\))?/);
  if (fractionWithPctMatch) {
    const fracStr = fractionWithPctMatch[1].replace(/\s+/g, '');
    const numVal = parseShareFraction(fracStr);
    let pctVal = numVal * 100;
    if (fractionWithPctMatch[2]) {
      const explicitPct = parseFloat(fractionWithPctMatch[2]);
      if (!isNaN(explicitPct)) pctVal = explicitPct;
    }
    const pctStr = Number.isInteger(pctVal) ? pctVal.toString() : pctVal.toFixed(2);
    return {
      fractionStr: fracStr,
      percentageStr: pctStr,
      fraction: numVal,
      percentage: pctVal
    };
  }

  // Pattern: "25%" or "25% (25%)"
  const pctOnlyMatch = trimmed.match(/^([\d.]+)%/);
  if (pctOnlyMatch) {
    const pctVal = parseFloat(pctOnlyMatch[1]) || 0;
    const fracStr = percentageToFraction(pctVal);
    const pctStr = Number.isInteger(pctVal) ? pctVal.toString() : pctVal.toFixed(2);
    return {
      fractionStr: fracStr,
      percentageStr: pctStr,
      fraction: pctVal / 100,
      percentage: pctVal
    };
  }

  // Pattern: Decimal "0.25"
  const decVal = parseFloat(trimmed);
  if (!isNaN(decVal) && decVal > 0 && decVal <= 1) {
    const pctVal = decVal * 100;
    const fracStr = percentageToFraction(pctVal);
    const pctStr = Number.isInteger(pctVal) ? pctVal.toString() : pctVal.toFixed(2);
    return {
      fractionStr: fracStr,
      percentageStr: pctStr,
      fraction: decVal,
      percentage: pctVal
    };
  }

  const numVal = parseShareFraction(trimmed);
  const pctVal = numVal * 100;
  const pctStr = Number.isInteger(pctVal) ? pctVal.toString() : pctVal.toFixed(2);
  return {
    fractionStr: trimmed,
    percentageStr: pctStr,
    fraction: numVal,
    percentage: pctVal
  };
}

/**
 * Updates a share ratio when the percentage is edited by calculating the corresponding reduced fraction.
 */
export function updateShareRatioFromPercentage(pctVal: number | string): {
  shareRatio: string;
  fraction: number;
  fractionStr: string;
  percentageStr: string;
} {
  const pctNum = typeof pctVal === 'string' ? parseFloat(pctVal) : pctVal;
  if (isNaN(pctNum) || pctNum < 0) {
    return { shareRatio: '0/1 (0%)', fraction: 0, fractionStr: '0/1', percentageStr: '0' };
  }
  const fractionStr = percentageToFraction(pctNum);
  const pctStr = Number.isInteger(pctNum) ? pctNum.toString() : pctNum.toFixed(2);
  const shareRatio = `${fractionStr} (${pctStr}%)`;
  const fraction = pctNum / 100;
  return { shareRatio, fraction, fractionStr, percentageStr: pctStr };
}

/**
 * Updates a share ratio when the fraction is edited by calculating the corresponding percentage.
 */
export function updateShareRatioFromFraction(fracStr: string): {
  shareRatio: string;
  fraction: number;
  fractionStr: string;
  percentageStr: string;
} {
  const cleanFrac = fracStr.replace(/\s*\(.*?\)/, '').trim();
  const fraction = parseShareFraction(cleanFrac);
  const pct = fraction * 100;
  const pctStr = Number.isInteger(pct) ? pct.toString() : pct.toFixed(2);
  const shareRatio = `${cleanFrac} (${pctStr}%)`;
  return { shareRatio, fraction, fractionStr: cleanFrac, percentageStr: pctStr };
}

/**
 * Automatically recalculates and updates the (XX%) percentage representation
 * whenever a fraction like "1/4", "1/4 (50%)", "2/3" or decimal is entered.
 */
export function formatShareRatioWithPercentage(shareRatio: string): { formatted: string; fraction: number } {
  if (!shareRatio) return { formatted: '', fraction: 0 };
  const trimmed = shareRatio.trim();

  // 1. Check for fraction pattern "num / den"
  const fractionMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)(?:\s*\(.*?\))?/);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    if (!isNaN(num) && !isNaN(den) && den > 0) {
      const frac = num / den;
      const pct = frac * 100;
      const pctStr = Number.isInteger(pct) ? pct.toString() : pct.toFixed(2);
      return {
        formatted: `${fractionMatch[1]}/${fractionMatch[2]} (${pctStr}%)`,
        fraction: frac
      };
    }
  }

  // 2. Percentage pattern "XX%"
  const pctMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*%(?:\s*\(.*?\))?/);
  if (pctMatch) {
    const val = parseFloat(pctMatch[1]);
    if (!isNaN(val)) {
      const fracStr = percentageToFraction(val);
      return {
        formatted: `${fracStr} (${val}%)`,
        fraction: val / 100
      };
    }
  }

  // 3. Decimal pattern "0.25"
  const dec = parseFloat(trimmed);
  if (!isNaN(dec) && dec > 0 && dec <= 1 && !trimmed.includes('/')) {
    const pct = dec * 100;
    const pctStr = Number.isInteger(pct) ? pct.toString() : pct.toFixed(2);
    const fracStr = percentageToFraction(pct);
    return {
      formatted: `${fracStr} (${pctStr}%)`,
      fraction: dec
    };
  }

  const frac = parseShareFraction(shareRatio);
  return { formatted: shareRatio, fraction: frac };
}

/**
 * Formats Hectare area into clean localized string
 */
export function formatArea(hectares: number, primaryUnit: AreaUnit = 'HECTARE'): string {
  const primaryVal = convertArea(hectares, 'HECTARE', primaryUnit);
  const unitInfo = UNIT_LABELS[primaryUnit];
  return `${primaryVal.toLocaleString('en-IN', { maximumFractionDigits: 4 })} ${unitInfo.symbol} (${hectares.toFixed(4)} ha)`;
}
