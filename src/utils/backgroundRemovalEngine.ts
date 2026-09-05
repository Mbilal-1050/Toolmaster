/**
 * Background Removal Engine
 * Precision client-side background removal:
 * - AI Neural Segmentation: Deep neural model via @imgly/background-removal (ISNet)
 *   running client-side with multi-threaded WASM / SharedArrayBuffer acceleration.
 * - Manual Color/Graphic Cutout: Available as an explicit user choice for simple graphics,
 *   logos, or solid green/white screens.
 */

import * as imgly from '@imgly/background-removal';
import type { Config } from '@imgly/background-removal';

const imglyRemoveBackground = imgly.removeBackground || (imgly as any).default;

export interface InstantCutoutOptions {
  tolerance?: number; // 0 to 100 (default: 32)
  featherRadius?: number; // 0 to 8 (default: 2)
  targetColor?: 'auto' | 'white' | 'dark' | 'green' | string;
  customRgb?: [number, number, number];
  contiguousOnly?: boolean;
}

export interface AICutoutOptions {
  modelQuality?: 'small' | 'medium' | 'large'; // isnet_quint8 (42MB), isnet_fp16 (84MB), isnet (168MB)
  outputQuality?: number; // 0.1 to 1.0
  onProgress?: (percentage: number, stage: string) => void;
  timeoutMs?: number; // default: 45000 (45s)
}

export interface ProcessResult {
  blob: Blob;
  usedEngine: 'ai' | 'fallback';
  message?: string;
}

/**
 * Check whether the current browser context is cross-origin isolated (SharedArrayBuffer enabled)
 */
export function isCrossOriginIsolated(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).crossOriginIsolated);
}

/**
 * Load an image file into an HTMLImageElement safely
 */
export function loadImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image into memory'));
    };
    img.src = url;
  });
}

/**
 * AI Neural Segmentation via @imgly/background-removal
 * Accurately extracts complex foreground subjects even when foreground and background
 * share identical or similar colors (e.g. red shoe on red background).
 */
export async function removeBackgroundAI(
  file: File,
  options: AICutoutOptions = {}
): Promise<Blob> {
  const model = options.modelQuality === 'large' ? 'isnet' : options.modelQuality === 'medium' ? 'isnet_fp16' : 'isnet_quint8';
  const timeoutMs = options.timeoutMs ?? 45000;

  console.log('[BackgroundRemovalEngine] Starting AI Neural Segmentation with model:', model, 'crossOriginIsolated:', isCrossOriginIsolated());

  const config: Config = {
    model: model as any,
    debug: true,
    output: {
      format: 'image/png',
      quality: options.outputQuality ?? 0.95,
    },
    progress: (key: string, current: number, total: number) => {
      if (total > 0 && options.onProgress) {
        const pct = Math.min(98, Math.max(5, Math.round((current / total) * 100)));
        let stage = 'Erasing background mask...';
        if (key.includes('fetch') || key.includes('model') || key.includes('wasm')) {
          stage = `Downloading AI Vision Model: ${pct}%...`;
        } else if (key.includes('compute') || key.includes('inference')) {
          stage = `Neural subject isolation: ${pct}%...`;
        } else {
          stage = `Processing ${key} (${pct}%)...`;
        }
        options.onProgress(pct, stage);
      } else if (options.onProgress) {
        options.onProgress(50, 'Neural model segmentation in progress...');
      }
    },
  };

  const aiPromise = imglyRemoveBackground(file, config);

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('AI neural model processing timed out after 45 seconds. Network connection may be slow for the neural model download.'));
    }, timeoutMs);

    aiPromise.then(
      () => clearTimeout(timer),
      () => clearTimeout(timer)
    );
  });

  return Promise.race([aiPromise, timeoutPromise]);
}

/**
 * Manual Color/Floodfill Cutout for simple graphics or studio backdrops.
 * NOT used as a silent fallback for photos because floodfill erases subjects
 * with matching hues.
 */
export async function removeBackgroundInstant(
  source: File | Blob | HTMLImageElement,
  options: InstantCutoutOptions = {}
): Promise<Blob> {
  const tolerance = options.tolerance ?? 32;
  const featherRadius = options.featherRadius ?? 2;
  const targetColor = options.targetColor ?? 'auto';
  const contiguousOnly = options.contiguousOnly ?? true;

  const img = source instanceof HTMLImageElement ? source : await loadImageFromFile(source);

  const maxDim = 2500;
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2D canvas context');

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const totalPixels = width * height;

  let bgR = 255;
  let bgG = 255;
  let bgB = 255;

  if (targetColor === 'white') {
    bgR = 255; bgG = 255; bgB = 255;
  } else if (targetColor === 'dark') {
    bgR = 15; bgG = 23; bgB = 42;
  } else if (targetColor === 'green') {
    bgR = 0; bgG = 255; bgB = 0;
  } else if (options.customRgb) {
    [bgR, bgG, bgB] = options.customRgb;
  } else {
    // Auto sample border corners
    const samples: [number, number, number][] = [];
    const cornerPositions = [
      0,
      (width - 1) * 4,
      ((height - 1) * width) * 4,
      ((height - 1) * width + (width - 1)) * 4,
      (Math.floor(width / 2)) * 4,
      (((height - 1) * width) + Math.floor(width / 2)) * 4,
    ];

    for (const pos of cornerPositions) {
      if (pos >= 0 && pos + 2 < data.length) {
        samples.push([data[pos], data[pos + 1], data[pos + 2]]);
      }
    }

    if (samples.length > 0) {
      bgR = Math.round(samples.reduce((acc, s) => acc + s[0], 0) / samples.length);
      bgG = Math.round(samples.reduce((acc, s) => acc + s[1], 0) / samples.length);
      bgB = Math.round(samples.reduce((acc, s) => acc + s[2], 0) / samples.length);
    }
  }

  const maxDist = (tolerance / 100) * 441.67;
  const mask = new Uint8Array(totalPixels);

  function isBgColor(idx: number): boolean {
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];
    const dr = r - bgR;
    const dg = g - bgG;
    const db = b - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db) <= maxDist;
  }

  if (contiguousOnly) {
    const queue: number[] = [];
    const visited = new Uint8Array(totalPixels);

    const pushIfBg = (x: number, y: number) => {
      const idx = y * width + x;
      if (!visited[idx]) {
        visited[idx] = 1;
        if (isBgColor(idx)) {
          mask[idx] = 1;
          queue.push(idx);
        }
      }
    };

    for (let x = 0; x < width; x++) {
      pushIfBg(x, 0);
      pushIfBg(x, height - 1);
    }
    for (let y = 1; y < height - 1; y++) {
      pushIfBg(0, y);
      pushIfBg(width - 1, y);
    }

    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const cx = curr % width;
      const cy = Math.floor(curr / width);

      if (cx > 0) pushIfBg(cx - 1, cy);
      if (cx < width - 1) pushIfBg(cx + 1, cy);
      if (cy > 0) pushIfBg(cx, cy - 1);
      if (cy < height - 1) pushIfBg(cx, cy + 1);
    }
  } else {
    for (let i = 0; i < totalPixels; i++) {
      if (isBgColor(i)) {
        mask[i] = 1;
      }
    }
  }

  for (let i = 0; i < totalPixels; i++) {
    if (mask[i] === 1) {
      data[i * 4 + 3] = 0;
    }
  }

  if (featherRadius > 0) {
    smoothAlphaChannel(data, width, height, featherRadius);
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate transparent PNG from canvas'));
    }, 'image/png');
  });
}

function smoothAlphaChannel(data: Uint8ClampedArray, width: number, height: number, radius: number) {
  const total = width * height;
  const alphaCopy = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    alphaCopy[i] = data[i * 4 + 3];
  }

  const r = Math.min(radius, 4);
  const kernelSize = 2 * r + 1;

  const temp = new Uint8Array(total);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    let sum = 0;
    for (let i = -r; i <= r; i++) {
      const px = Math.min(Math.max(i, 0), width - 1);
      sum += alphaCopy[rowOffset + px];
    }
    for (let x = 0; x < width; x++) {
      temp[rowOffset + x] = Math.round(sum / kernelSize);
      const left = Math.max(x - r, 0);
      const right = Math.min(x + r + 1, width - 1);
      sum += alphaCopy[rowOffset + right] - alphaCopy[rowOffset + left];
    }
  }

  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let i = -r; i <= r; i++) {
      const py = Math.min(Math.max(i, 0), height - 1);
      sum += temp[py * width + x];
    }
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4 + 3;
      if (data[idx] > 0 && data[idx] < 255) {
        data[idx] = Math.round(sum / kernelSize);
      }
      const top = Math.max(y - r, 0);
      const bottom = Math.min(y + r + 1, height - 1);
      sum += temp[bottom * width + x] - temp[top * width + x];
    }
  }
}

/**
 * Unified Process Function:
 * Runs the AI Neural Model with a 45s timeout.
 * DOES NOT silently fall back to flood-fill for photos, preventing accidental destruction
 * of subjects sharing hue with the background.
 */
export async function processBackgroundRemoval(
  file: File,
  engineChoice: 'ai' | 'fallback' = 'ai',
  instantOpts: InstantCutoutOptions = {},
  aiOpts: AICutoutOptions = {}
): Promise<ProcessResult> {
  if (engineChoice === 'fallback') {
    const blob = await removeBackgroundInstant(file, instantOpts);
    return {
      blob,
      usedEngine: 'fallback',
      message: 'Processed using Manual Color / Graphic Cutout.',
    };
  }

  try {
    const blob = await removeBackgroundAI(file, {
      ...aiOpts,
      timeoutMs: aiOpts.timeoutMs ?? 45000,
    });
    return {
      blob,
      usedEngine: 'ai',
      message: 'Processed using Deep Neural Vision Model (ISNet).',
    };
  } catch (err: any) {
    console.error('AI Neural Removal error:', err);
    // Explicitly reject rather than silently producing a degraded flood-fill cutout
    const friendlyMsg =
      'Advanced AI mode unavailable in this browser — please try Chrome/Edge or open in a new tab for best results.';
    throw new Error(friendlyMsg);
  }
}
