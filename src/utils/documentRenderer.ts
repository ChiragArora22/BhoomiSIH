import { LandRecord } from '../types/landRecord';

/**
 * Dynamically renders an authentic, high-fidelity government land record document onto an HTML5 Canvas.
 * Supports Hindi Khatauni, Marathi 7/12, Tamil Patta, Telugu Pahani, and Urdu/Hindi Jamabandi.
 */
export function renderSyntheticLandRecordToCanvas(canvas: HTMLCanvasElement, record: LandRecord) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1000;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  // 1. Aged Paper Background Texture
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  if (record.id.includes('DISPUTED')) {
    // Older, aged yellowed parchment for historical legacy record
    bgGrad.addColorStop(0, '#fbf5e6');
    bgGrad.addColorStop(0.5, '#f4ebd0');
    bgGrad.addColorStop(1, '#ebe0be');
  } else {
    // Standard crisp off-white revenue paper
    bgGrad.addColorStop(0, '#fefefe');
    bgGrad.addColorStop(0.5, '#fafaf7');
    bgGrad.addColorStop(1, '#f5f5f0');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Add subtle paper grain/noise
  ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  // 2. Outer Border (Double frame standard for revenue records)
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, width - 60, height - 60);
  ctx.lineWidth = 1;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // 3. Government Emblem / Ashoka Lion / State Seal Simulation
  ctx.save();
  ctx.strokeStyle = '#1e3a8a';
  ctx.fillStyle = 'rgba(30, 58, 138, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(width / 2, 90, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Seal inner rings
  ctx.beginPath();
  ctx.arc(width / 2, 90, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 12px serif';
  ctx.textAlign = 'center';
  ctx.fillText('सत्यमेव जयते', width / 2, 95);
  ctx.restore();

  // 4. Header Titles
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';

  if (record.documentLanguage === 'hi') {
    ctx.font = 'bold 24px "Noto Sans Devanagari", Inter, sans-serif';
    ctx.fillText('उत्तर प्रदेश शासन - राजस्व विभाग', width / 2, 155);
    ctx.font = 'bold 18px "Noto Sans Devanagari", Inter, sans-serif';
    ctx.fillText('अधिकार अभिलेख (खतौनी) - प्रपत्र संख्या ४५', width / 2, 185);
  } else if (record.documentLanguage === 'mr') {
    ctx.font = 'bold 24px "Noto Sans Devanagari", Inter, sans-serif';
    ctx.fillText('महाराष्ट्र शासन - महसूल व वन विभाग', width / 2, 155);
    ctx.font = 'bold 18px "Noto Sans Devanagari", Inter, sans-serif';
    ctx.fillText('गाव नमुना सात (अधिकार अभिलेख पत्रक) व गाव नमुना बारा', width / 2, 185);
  } else if (record.documentLanguage === 'ta') {
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('தமிழ்நாடு அரசு - வருவாய்த்துறை', width / 2, 155);
    ctx.font = 'bold 17px Inter, sans-serif';
    ctx.fillText('நில உரிமை ஆவணம் (பட்டா / சிட்டா நகல்)', width / 2, 185);
  } else if (record.documentLanguage === 'te') {
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('తెలంగాణ ప్రభుత్వం - భూపరిపాలన శాఖ', width / 2, 155);
    ctx.font = 'bold 17px Inter, sans-serif';
    ctx.fillText('హక్కుల రికార్డు (పహానీ / అడంగల్ - ROR 1B)', width / 2, 185);
  } else {
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('GOVERNMENT OF INDIA - LAND REVENUE DEPARTMENT', width / 2, 155);
    ctx.font = 'bold 17px Inter, sans-serif';
    ctx.fillText('RECORD OF RIGHTS (RoR) / JAMABANDI EXTRACT', width / 2, 185);
  }

  // 5. Metadata Banner Bar
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(50, 205, width - 100, 50);
  ctx.strokeStyle = '#94a3b8';
  ctx.strokeRect(50, 205, width - 100, 50);

  ctx.fillStyle = '#1e293b';
  ctx.font = '500 13px Inter, "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'left';

  const col1X = 65;
  const col2X = 300;
  const col3X = 540;
  const col4X = 760;

  ctx.fillText(`जनपद / District: ${record.district.split(' ')[0]}`, col1X, 226);
  ctx.fillText(`तहसील / Tehsil: ${record.tehsil.split(' ')[0]}`, col2X, 226);
  ctx.fillText(`ग्राम / Village: ${record.revenueVillage.split(' ')[0]}`, col3X, 226);
  ctx.fillText(`वर्ष / Year: ${record.documentYear}`, col4X, 226);

  ctx.fillText(`अभिलेख क्र. / Record No: ${record.recordNumber}`, col1X, 246);
  ctx.fillText(`खाता सं. / Khata No: ${record.khataNumber}`, col2X, 246);
  ctx.fillText(`खसरा सं. / Khasra No: ${record.khasraNumber}`, col3X, 246);
  ctx.fillText(`क्षेत्रफल / Area: ${record.plotAreaOriginal} ${record.plotAreaUnit}`, col4X, 246);

  // 6. Main Revenue Ledger Table
  const tableY = 275;
  const tableH = 580;
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, tableY, width - 100, tableH);

  // Table Headers
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(50, tableY, width - 100, 45);
  ctx.strokeRect(50, tableY, width - 100, 45);

  const tCols = [50, 140, 260, 420, 680, 810, 950];

  for (let i = 1; i < tCols.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(tCols[i], tableY);
    ctx.lineTo(tCols[i], tableY + tableH);
    ctx.stroke();
  }

  // Header Labels
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px "Noto Sans Devanagari", Inter, sans-serif';
  ctx.textAlign = 'center';

  ctx.fillText('कॉलम १', (tCols[0] + tCols[1]) / 2, tableY + 18);
  ctx.fillText('खाता संख्या', (tCols[0] + tCols[1]) / 2, tableY + 34);

  ctx.fillText('कॉलम २', (tCols[1] + tCols[2]) / 2, tableY + 18);
  ctx.fillText('खसरा संख्या', (tCols[1] + tCols[2]) / 2, tableY + 34);

  ctx.fillText('कॉलम ३', (tCols[2] + tCols[3]) / 2, tableY + 18);
  ctx.fillText('क्षेत्रफल (हे.)', (tCols[2] + tCols[3]) / 2, tableY + 34);

  ctx.fillText('कॉलम ४', (tCols[3] + tCols[4]) / 2, tableY + 18);
  ctx.fillText('खातेदार का नाम व पिता/पति (हिस्सा)', (tCols[3] + tCols[4]) / 2, tableY + 34);

  ctx.fillText('कॉलम ५', (tCols[4] + tCols[5]) / 2, tableY + 18);
  ctx.fillText('लगान / मालगुजारी', (tCols[4] + tCols[5]) / 2, tableY + 34);

  ctx.fillText('कॉलम ६', (tCols[5] + tCols[6]) / 2, tableY + 18);
  ctx.fillText('आदेश / कैफियत (रिमार्क)', (tCols[5] + tCols[6]) / 2, tableY + 34);

  // Row Data
  const rowY = tableY + 75;
  ctx.font = '13px "Noto Sans Devanagari", Inter, sans-serif';
  ctx.textAlign = 'center';

  ctx.fillText(record.khataNumber, (tCols[0] + tCols[1]) / 2, rowY);
  ctx.fillText(record.khasraNumber, (tCols[1] + tCols[2]) / 2, rowY);
  ctx.fillText(`${record.plotAreaOriginal} ha`, (tCols[2] + tCols[3]) / 2, rowY);
  ctx.fillText(`₹ ${(record.landRevenueTaxPaise ? (record.landRevenueTaxPaise / 100).toFixed(2) : '42.50')}`, (tCols[4] + tCols[5]) / 2, rowY);

  // Owners list in Column 4
  ctx.textAlign = 'left';
  let ownerCurY = rowY - 10;
  record.owners.forEach((owner, idx) => {
    ctx.font = 'bold 13px "Noto Sans Devanagari", Inter, sans-serif';
    ctx.fillText(`${idx + 1}. ${owner.vernacularName || owner.name}`, tCols[3] + 12, ownerCurY);
    ctx.font = '11px "Noto Sans Devanagari", Inter, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`${owner.relationType} ${owner.fatherOrSpouseName} | हिस्सा: ${owner.shareRatio}`, tCols[3] + 28, ownerCurY + 16);
    ctx.fillText(`पहचान: ${owner.aadhaarHash || 'XXXX-XXXX-8921'}`, tCols[3] + 28, ownerCurY + 30);
    ctx.fillStyle = '#0f172a';
    ownerCurY += 50;
  });

  // Remarks / Mutation in Column 6
  ctx.textAlign = 'left';
  ctx.font = '11px "Noto Sans Devanagari", Inter, sans-serif';
  if (record.mutations && record.mutations.length > 0) {
    const mut = record.mutations[0];
    ctx.fillText(`नामांतरण सं: ${mut.mutationNo}`, tCols[5] + 8, rowY);
    ctx.fillText(`दिनांक: ${mut.orderDate}`, tCols[5] + 8, rowY + 16);
    ctx.fillText(`आदेश: ${mut.transferType}`, tCols[5] + 8, rowY + 32);
    ctx.fillText(`${mut.sanctioningAuthority}`, tCols[5] + 8, rowY + 48);
  } else {
    ctx.fillText('कोई अभियोग नहीं।', tCols[5] + 8, rowY);
  }

  // 7. Encumbrance / Bank Loan Notice Bar
  const encY = tableY + tableH + 20;
  ctx.strokeStyle = '#cbd5e1';
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(50, encY, width - 100, 110);
  ctx.strokeRect(50, encY, width - 100, 110);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 13px "Noto Sans Devanagari", Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('अन्य अधिकार व बैंक बंधक प्रविष्टि (Other Rights & Encumbrances):', 65, encY + 25);

  ctx.font = '12px "Noto Sans Devanagari", Inter, sans-serif';
  if (record.encumbrances && record.encumbrances.length > 0) {
    const enc = record.encumbrances[0];
    ctx.fillStyle = '#b91c1c';
    ctx.fillText(`[सक्रिय बंधक] ${enc.bankOrCreditorName} द्वारा किसान क्रेडिट ऋण रु. ${enc.loanAmount.toLocaleString('en-IN')}/- (दिनांक ${enc.mortgageDate})`, 65, encY + 52);
    ctx.fillText(`संदर्भ सं: ${enc.referenceNo} - भूमि बंधक स्थिति में है।`, 65, encY + 74);
  } else {
    ctx.fillStyle = '#15803d';
    ctx.fillText('यह भूमि किसी भी बैंक अथवा वित्तीय संस्था के पास बंधक नहीं है (भारमुक्त / Non-Encumbered).', 65, encY + 52);
  }

  // 8. Official Seals, Signatures & Watermark
  const footerY = height - 200;

  // Round Purple Revenue Stamp
  ctx.save();
  ctx.translate(140, footerY + 50);
  ctx.rotate(-0.08);
  ctx.strokeStyle = 'rgba(126, 34, 206, 0.75)';
  ctx.fillStyle = 'rgba(126, 34, 206, 0.06)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(126, 34, 206, 0.85)';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TEHSIL REVENUE OFFICE', 0, -22);
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('OFFICIAL SEAL', 0, 4);
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('GOVT OF UP / MH / TN', 0, 24);
  ctx.restore();

  // Tehsildar & Patwari Signatures
  ctx.fillStyle = '#1e293b';
  ctx.textAlign = 'center';

  ctx.font = 'italic 16px "Brush Script MT", cursive, sans-serif';
  ctx.fillText('R.K. Srivastava', 500, footerY + 40);
  ctx.strokeStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(430, footerY + 48);
  ctx.lineTo(570, footerY + 48);
  ctx.stroke();
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText('हस्ताक्षर राजस्व निरीक्षक / लेखपाल', 500, footerY + 65);

  ctx.font = 'italic 17px "Brush Script MT", cursive, sans-serif';
  ctx.fillText('Anil Varma (IAS/PCS)', 820, footerY + 40);
  ctx.beginPath();
  ctx.moveTo(740, footerY + 48);
  ctx.lineTo(900, footerY + 48);
  ctx.stroke();
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText('डिजिटल प्रतिहस्ताक्षर: उपजिलाधिकारी / तहसीलदार', 820, footerY + 65);

  // QR Code placeholder / Digital Verification Bar
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#64748b';
  ctx.fillRect(50, height - 90, width - 100, 40);
  ctx.strokeRect(50, height - 90, width - 100, 40);

  ctx.fillStyle = '#0f172a';
  ctx.font = '11px Inter, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`DILRMP DIGITAL VERIFICATION HASH: SHA256-${record.id}-VALIDATED-OK`, 65, height - 66);
  ctx.textAlign = 'right';
  ctx.fillText('CERTIFIED COPY | NIC / DILRMP COMPLIANT', width - 65, height - 66);
}
