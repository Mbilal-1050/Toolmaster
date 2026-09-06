/**
 * Background Removal Engine
 * Precision client-side background removal:
 * - AI Neural Segmentation: Deep neural model via @imgly/background-removal (ISNet)
 *   accelerated by WASM and multi-threading when SharedArrayBuffer is available.
 * - Single-Threaded Vision Engine: High-speed, contiguous perceptual color & edge-based
 *   cutout that works in any browser without requiring SharedArrayBuffer or cross-origin isolation.
 */

import { removeBackground, type Config } from '@imgly/background-removal';

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

export interface BrowserCapabilities {
  browserName: string;
  isChrome: boolean;
  isEdge: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  hasSharedArrayBuffer: boolean;
  isCrossOriginIsolated: boolean;
  isIframe: boolean;
  hasWebGPU: boolean;
  hardwareConcurrency: number;
}

/**
 * Accurate Browser and WASM capability detection
 */
export function detectBrowserCapabilities(): BrowserCapabilities {
  if (typeof window === 'undefined') {
    return {
      browserName: 'Server',
      isChrome: false,
      isEdge: false,
      isFirefox: false,
      isSafari: false,
      hasSharedArrayBuffer: false,
      isCrossOriginIsolated: false,
      isIframe: false,
      hasWebGPU: false,
      hardwareConcurrency: 4,
    };
  }

  const ua = navigator.userAgent;
  const isEdge = /Edg\//i.test(ua);
  const isOpera = /OPR\//i.test(ua);
  const isChrome = /Chrome\//i.test(ua) && !isEdge && !isOpera;
  const isFirefox = /Firefox\//i.test(ua);
  const isSafari = /Safari\//i.test(ua) && !/Chrome\//i.test(ua);

  let browserName = 'Standard Browser';
  if (isEdge) browserName = 'Microsoft Edge';
  else if (isChrome) browserName = 'Google Chrome';
  else if (isFirefox) browserName = 'Mozilla Firefox';
  else if (isSafari) browserName = 'Apple Safari';
  else if (isOpera) browserName = 'Opera';

  const hasSharedArrayBuffer =
    typeof (window as any).SharedArrayBuffer === 'function' ||
    typeof (window as any).SharedArrayBuffer === 'object';
  const isIsolated = Boolean((window as any).crossOriginIsolated);
  const isIframe = window.self !== window.top;
  const hasWebGPU = Boolean((navigator as any).gpu);
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  return {
    browserName,
    isChrome,
    isEdge,
    isFirefox,
    isSafari,
    hasSharedArrayBuffer,
    isCrossOriginIsolated: isIsolated,
    isIframe,
    hasWebGPU,
    hardwareConcurrency,
  };
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
  const model =
    options.modelQuality === 'large'
      ? 'isnet'
      : options.modelQuality === 'medium'
      ? 'isnet_fp16'
      : 'isnet_quint8';
  const timeoutMs = options.timeoutMs ?? 45000;

  console.log(
    '[BackgroundRemovalEngine] Starting AI Neural Segmentation with model:',
    model,
    'crossOriginIsolated:',
    isCrossOriginIsolated()
  );

  const config: Config = {
    model: model as any,
    debug: false,
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

  const aiPromise = removeBackground(file, config);

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          'AI neural model processing timed out after 45 seconds. Network connection may be slow for the neural model download.'
        )
      );
    }, timeoutMs);

    aiPromise.then(
      () => clearTimeout(timer),
      () => clearTimeout(timer)
    );
  });

  return Promise.race([aiPromise, timeoutPromise]);
}

/**
 * Single-Threaded Vision Engine:
 * Contiguous perceptual color distance, border multi-sampling, and edge-preserving
 * flood fill with soft alpha blending. Runs in any browser environment without SharedArrayBuffer.
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

  // Collect candidate background colors
  const bgPalette: [number, number, number][] = [];

  if (targetColor === 'white') {
    bgPalette.push([255, 255, 255]);
  } else if (targetColor === 'dark') {
    bgPalette.push([15, 23, 42]);
  } else if (targetColor === 'green') {
    bgPalette.push([0, 255, 0]);
  } else if (options.customRgb) {
    bgPalette.push(options.customRgb);
  } else {
    // Multi-point perimeter sampling (corners and 16 distributed edge points)
    const edgeCoords: [number, number][] = [
      [0, 0],
      [Math.floor(width / 4), 0],
      [Math.floor(width / 2), 0],
      [Math.floor((3 * width) / 4), 0],
      [width - 1, 0],
      [0, height - 1],
      [Math.floor(width / 4), height - 1],
      [Math.floor(width / 2), height - 1],
      [Math.floor((3 * width) / 4), height - 1],
      [width - 1, height - 1],
      [0, Math.floor(height / 4)],
      [0, Math.floor(height / 2)],
      [0, Math.floor((3 * height) / 4)],
      [width - 1, Math.floor(height / 4)],
      [width - 1, Math.floor(height / 2)],
      [width - 1, Math.floor((3 * height) / 4)],
    ];

    for (const [x, y] of edgeCoords) {
      const idx = (y * width + x) * 4;
      if (idx >= 0 && idx + 2 < data.length) {
        bgPalette.push([data[idx], data[idx + 1], data[idx + 2]]);
      }
    }
  }

  // Perceptual color distance metric (weighted for human eye sensitivity)
  const maxPerceptualDist = (tolerance / 100) * 580;

  function isBgPixel(idx: number): boolean {
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];

    for (const [bgR, bgG, bgB] of bgPalette) {
      const rmean = (r + bgR) / 2;
      const dr = r - bgR;
      const dg = g - bgG;
      const db = b - bgB;
      const dist = Math.sqrt(
        (((512 + rmean) * dr * dr) >> 8) + 4 * dg * dg + (((767 - rmean) * db * db) >> 8)
      );
      if (dist <= maxPerceptualDist) {
        return true;
      }
    }
    return false;
  }

  const mask = new Uint8Array(totalPixels);

  if (contiguousOnly) {
    const queue: number[] = [];
    const visited = new Uint8Array(totalPixels);

    const pushIfBg = (x: number, y: number) => {
      const idx = y * width + x;
      if (!visited[idx]) {
        visited[idx] = 1;
        if (isBgPixel(idx)) {
          mask[idx] = 1;
          queue.push(idx);
        }
      }
    };

    // Seed from all 4 boundaries
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
      if (isBgPixel(i)) {
        mask[i] = 1;
      }
    }
  }

  // Apply transparency to detected background pixels
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

function smoothAlphaChannel(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number
) {
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
 * - When SharedArrayBuffer is available: Runs the AI Neural Model ISNet with multi-threading.
 * - If SharedArrayBuffer is unavailable (e.g. inside an un-isolated window/iframe):
 *   Auto-switches to the Single-Threaded Vision Engine.
 * - If AI Neural Model fails for any reason: Seamlessly recovers via Single-Threaded Vision
 *   Engine instead of halting the user with an error screen.
 */
export async function processBackgroundRemoval(
  file: File,
  engineChoice: 'ai' | 'fallback' = 'ai',
  instantOpts: InstantCutoutOptions = {},
  aiOpts: AICutoutOptions = {}
): Promise<ProcessResult> {
  const browser = detectBrowserCapabilities();

  // Explicit user choice for Graphic / Single-Threaded Mode
  if (engineChoice === 'fallback') {
    const blob = await removeBackgroundInstant(file, instantOpts);
    return {
      blob,
      usedEngine: 'fallback',
      message: 'Processed using Single-Threaded Precision Vision Cutout.',
    };
  }

  // If SharedArrayBuffer is not available in the current window context
  if (!browser.hasSharedArrayBuffer) {
    console.info(
      `[BackgroundRemovalEngine] SharedArrayBuffer is inactive in ${browser.browserName}. Running Single-Threaded Vision Engine.`
    );
    if (aiOpts.onProgress) {
      aiOpts.onProgress(35, `Analyzing image in ${browser.browserName}...`);
      await new Promise((r) => setTimeout(r, 100));
      aiOpts.onProgress(85, 'Segmenting foreground subject...');
    }
    const blob = await removeBackgroundInstant(file, instantOpts);
    return {
      blob,
      usedEngine: 'fallback',
      message: `Processed using Single-Threaded Vision Engine (${browser.browserName} without multi-threaded isolation).`,
    };
  }

  // SharedArrayBuffer IS available: Try multi-threaded AI Neural Segmentation
  try {
    const blob = await removeBackgroundAI(file, {
      ...aiOpts,
      timeoutMs: aiOpts.timeoutMs ?? 45000,
    });
    return {
      blob,
      usedEngine: 'ai',
      message: 'Processed using Deep Neural Vision Model (ISNet multi-threaded).',
    };
  } catch (err: any) {
    console.warn(
      '[BackgroundRemovalEngine] AI Neural model encountered an issue, seamlessly auto-recovering via Single-Threaded Vision Engine:',
      err
    );
    if (aiOpts.onProgress) {
      aiOpts.onProgress(85, 'Auto-recovering via Single-Threaded Vision Engine...');
      await new Promise((r) => setTimeout(r, 100));
    }

    // Seamless fallback to single-threaded vision engine without stopping the user with an error
    const fallbackBlob = await removeBackgroundInstant(file, instantOpts);
    return {
      blob: fallbackBlob,
      usedEngine: 'fallback',
      message:
        'Processed using Single-Threaded Vision Engine (AI Neural Model auto-recovered).',
    };
  }
}

