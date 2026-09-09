import { PreprocessingConfig } from '../types/landRecord';

/**
 * Applies computer vision filters onto a source Canvas/Image
 */
export function applyDocumentFilters(
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  config: PreprocessingConfig
) {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  targetCanvas.width = width;
  targetCanvas.height = height;

  // Clear and save state
  ctx.clearRect(0, 0, width, height);
  ctx.save();

  // 1. Deskew Transformation
  if (config.deskewAngle !== 0) {
    ctx.translate(width / 2, height / 2);
    ctx.rotate((config.deskewAngle * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);
  }

  // Draw base source image
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.restore();

  // Get image pixel data for pixel-level vision filters
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Contrast & Binarization calculation
  const contrastFactor = (259 * (config.contrastBoost + 255)) / (255 * (259 - config.contrastBoost));
  const threshold = config.binarizationThreshold; // 0 - 255

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Stamp suppression (Red/Purple ink suppression if requested)
    if (config.stampSuppression) {
      const isRedOrPurple = (r > 120 && g < 90 && b < 100) || (r > 100 && b > 120 && g < 80);
      if (isRedOrPurple) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        continue;
      }
    }

    // Convert to Grayscale luminance
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Apply Contrast Enhancement
    if (config.contrastBoost > 0) {
      gray = contrastFactor * (gray - 128) + 128;
      gray = Math.min(255, Math.max(0, gray));
    }

    // Adaptive Ink Recovery (Enhance faded strokes)
    if (config.inkRecovery && gray < 160) {
      gray = gray * 0.7; // Darken faint ink
    }

    // Binarization Threshold (Otsu / Sauvola simulation)
    if (threshold > 0) {
      gray = gray < threshold ? 0 : 255;
    }

    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    // data[i+3] is Alpha (keep intact)
  }

  ctx.putImageData(imgData, 0, 0);
}
