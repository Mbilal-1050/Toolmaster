'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Scissors,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Home,
  Sliders,
  AlertTriangle,
  SplitSquareVertical,
  Columns,
  Image as ImageIcon,
  Copy,
  Check,
  Loader2,
  Cpu,
  RefreshCw,
  ExternalLink,
  FlaskConical,
} from 'lucide-react';
import { ToolItem } from '../types';
import { TOOLS_DATA } from '../data/toolsData';
import { FileDropzone } from '../components/FileDropzone';
import { AdSlot } from '../components/AdSlot';
import {
  processBackgroundRemoval,
  isCrossOriginIsolated,
  type InstantCutoutOptions,
  type AICutoutOptions,
} from '../utils/backgroundRemovalEngine';

interface BackgroundRemoverPageProps {
  tool: ToolItem;
  onNavigateHome: () => void;
  onNavigateTool: (slug: string) => void;
}

type EngineMode = 'ai' | 'fallback';
type ModelQuality = 'small' | 'medium' | 'large';
type PreviewBg = 'transparent' | 'white' | 'dark' | 'color';

export const BackgroundRemoverPage: React.FC<BackgroundRemoverPageProps> = ({
  tool,
  onNavigateHome,
  onNavigateTool,
}) => {
  // Input image state
  const [files, setFiles] = useState<File[]>([]);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  // Engine selection: Default to AI Neural Model as required
  const [engineMode, setEngineMode] = useState<EngineMode>('ai');
  const [usedEngine, setUsedEngine] = useState<'ai' | 'fallback' | null>(null);

  // Instant / Manual settings
  const [tolerance, setTolerance] = useState<number>(32);
  const [featherRadius, setFeatherRadius] = useState<number>(2);
  const [targetColor, setTargetColor] = useState<'auto' | 'white' | 'dark' | 'green'>('auto');
  const [contiguousOnly, setContiguousOnly] = useState<boolean>(true);

  // AI settings
  const [modelQuality, setModelQuality] = useState<ModelQuality>('small');
  const [outputQuality, setOutputQuality] = useState<number>(0.95);

  // Processing & progress
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState<string>('Initializing...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Preview & comparison view
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [previewBg, setPreviewBg] = useState<PreviewBg>('transparent');
  const [customBgColor, setCustomBgColor] = useState('#3b82f6');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isIsolated, setIsIsolated] = useState<boolean>(false);

  // Log crossOriginIsolated on page load
  useEffect(() => {
    const isolated = isCrossOriginIsolated();
    setIsIsolated(isolated);
    console.log('[BackgroundRemoverPage] crossOriginIsolated:', isolated);
  }, []);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
      if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
    };
  }, [originalImageUrl, resultImageUrl]);

  // When files change, load preview
  useEffect(() => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
      setResultBlob(null);
      setResultImageUrl(null);
      setErrorMsg(null);

      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = url;
    } else {
      setOriginalImageUrl(null);
      setResultBlob(null);
      setResultImageUrl(null);
      setImageDimensions(null);
    }
  }, [files]);

  const handleFilesSelected = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const file = newFiles[0];

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(png|jpe?g|webp)$/i)) {
      setErrorMsg('Unsupported format. Please upload a PNG, JPG, or WEBP image file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds 25MB. Please choose an image under 25MB for optimal browser performance.');
      return;
    }

    setErrorMsg(null);
    setFiles([file]);
  };

  const handleRemoveFile = () => {
    setFiles([]);
    setOriginalImageUrl(null);
    setResultBlob(null);
    setResultImageUrl(null);
    setProgress(0);
    setErrorMsg(null);
  };

  const formatBytes = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper to load test case: Red shoe on red background
  const handleLoadRedOnRedSample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Red background (Scarlet / Crimson: #dc2626)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, 640, 460);

    // Subtle background shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(320, 355, 220, 24, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(153, 27, 27, 0.45)';
    ctx.fill();
    ctx.restore();

    // 2. Red shoe body in matching deep scarlet (#b91c1c & #ef4444)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(160, 320);
    ctx.lineTo(470, 320); // sole base
    ctx.quadraticCurveTo(510, 315, 520, 280); // toe front curve
    ctx.quadraticCurveTo(500, 240, 450, 230); // toe top
    ctx.lineTo(350, 220); // bridge
    ctx.lineTo(310, 140); // collar / tongue
    ctx.quadraticCurveTo(280, 130, 260, 150); // ankle opening
    ctx.lineTo(220, 200); // heel collar
    ctx.quadraticCurveTo(180, 230, 160, 290); // back heel
    ctx.closePath();
    ctx.fillStyle = '#b91c1c'; // Red sneaker body
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#991b1b';
    ctx.stroke();

    // White rubber sneaker outsole
    ctx.beginPath();
    ctx.moveTo(155, 320);
    ctx.lineTo(510, 320);
    ctx.quadraticCurveTo(525, 335, 505, 350);
    ctx.lineTo(160, 350);
    ctx.quadraticCurveTo(145, 335, 155, 320);
    ctx.closePath();
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Red swoosh / athletic stripe overlay
    ctx.beginPath();
    ctx.moveTo(250, 240);
    ctx.quadraticCurveTo(370, 250, 430, 215);
    ctx.quadraticCurveTo(370, 285, 280, 275);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // White laces
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    const laces = [230, 210, 190, 170];
    laces.forEach((y, i) => {
      ctx.beginPath();
      ctx.moveTo(310 - i * 11, y);
      ctx.lineTo(338 - i * 9, y + 6);
      ctx.stroke();
    });

    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'test-red-shoe-on-red-bg.png', { type: 'image/png' });
        setFiles([file]);
        setEngineMode('ai');
        setErrorMsg(null);
      }
    }, 'image/png');
  };

  const handleExecuteRemoval = async (targetEngine?: EngineMode) => {
    if (files.length === 0) {
      setErrorMsg('Please upload an image first.');
      return;
    }

    const currentEngine = targetEngine || engineMode;

    try {
      setProcessing(true);
      setErrorMsg(null);
      setProgress(5);
      setProgressStage(
        currentEngine === 'fallback'
          ? 'Scanning color boundaries for graphic cutout...'
          : 'Initializing AI Neural Vision Model (ISNet)...'
      );

      const file = files[0];

      const instantOpts: InstantCutoutOptions = {
        tolerance,
        featherRadius,
        targetColor,
        contiguousOnly,
      };

      const aiOpts: AICutoutOptions = {
        modelQuality,
        outputQuality,
        timeoutMs: 45000,
        onProgress: (pct, stage) => {
          setProgress(pct);
          setProgressStage(stage);
        },
      };

      // Run background removal
      const result = await processBackgroundRemoval(file, currentEngine, instantOpts, aiOpts);

      setProgress(100);
      setProgressStage('Finished!');
      setResultBlob(result.blob);
      setUsedEngine(result.usedEngine);

      const outputUrl = URL.createObjectURL(result.blob);
      setResultImageUrl(outputUrl);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error('Background removal error:', err);
      const userMsg =
        err?.message ||
        'Advanced AI mode unavailable in this browser — please try Chrome/Edge for best results.';
      setErrorMsg(userMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || files.length === 0) return;
    const baseName = files[0].name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_transparent_bg.png`;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyImage = async () => {
    if (!resultBlob) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': resultBlob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        setErrorMsg('Direct clipboard copy is not supported in this browser. Please use Download.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Could not copy image to clipboard. Please download the PNG file.');
    }
  };

  const getPreviewBgStyle = () => {
    switch (previewBg) {
      case 'white':
        return { backgroundColor: '#ffffff' };
      case 'dark':
        return { backgroundColor: '#0f172a' };
      case 'color':
        return { backgroundColor: customBgColor };
      case 'transparent':
      default:
        return {};
    }
  };

  const isCheckerboard = previewBg === 'transparent';

  return (
    <div className="min-h-screen pb-24">
      {/* 1. SEO & Breadcrumb Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-rose-600 flex items-center gap-1 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              Background Remover
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {tool.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {tool.shortDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Private
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <Zap className="w-3.5 h-3.5" /> ISNet Neural Vision
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                WASM Isolation: {isIsolated ? 'Enabled' : 'Standard'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Ad Slot */}
        <AdSlot id="ad-slot-top-bg-remover" slotType="top-banner" />

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl mt-6">
          {!resultImageUrl ? (
            /* STAGE 1: UPLOAD & CONFIGURATION */
            <div className="space-y-6">
              {files.length === 0 ? (
                <div className="space-y-4">
                  <FileDropzone
                    acceptedFiles=".png,.jpg,.jpeg,.webp"
                    allowMultiple={false}
                    files={files}
                    onFilesSelected={handleFilesSelected}
                    onFileRemove={handleRemoveFile}
                    title="Upload Photo (PNG, JPG, WEBP)"
                    subtitle="Drag & drop or click to isolate subjects and erase background"
                  />

                  {/* Sample Test Case Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/50 gap-3">
                    <div className="flex items-center gap-2 text-xs text-rose-950 dark:text-rose-200">
                      <FlaskConical className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        <strong>Test Difficult Edge Case:</strong> Test neural segmentation with a subject matching its background hue.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleLoadRedOnRedSample}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                    >
                      Load Red Shoe on Red Background Sample
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Uploaded File Header */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {files[0].name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatBytes(files[0].size)} {imageDimensions && `• ${imageDimensions.width}×${imageDimensions.height}px`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleLoadRedOnRedSample}
                        className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition"
                      >
                        Red-on-Red Sample
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={processing}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Original Image Preview */}
                  {originalImageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 max-h-[380px] flex items-center justify-center p-4">
                      <img
                        src={originalImageUrl}
                        alt="Original upload preview"
                        className="max-h-[340px] max-w-full object-contain rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {/* Engine Selection & Options */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-rose-600" />
                          Processing Engine
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Neural model is selected for precision subjects (e.g. hair, matching hues).
                        </p>
                      </div>

                      <div className="inline-flex p-1 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setEngineMode('ai')}
                          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                            engineMode === 'ai'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          AI Neural Model ⭐
                        </button>
                        <button
                          type="button"
                          onClick={() => setEngineMode('fallback')}
                          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                            engineMode === 'fallback'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Graphic Color Mode
                        </button>
                      </div>
                    </div>

                    {engineMode === 'ai' ? (
                      <div className="space-y-4 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Model Quality */}
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                              Neural Architecture:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => setModelQuality('small')}
                                className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                                  modelQuality === 'small'
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                Fast (40MB) ⭐
                              </button>
                              <button
                                type="button"
                                onClick={() => setModelQuality('medium')}
                                className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                                  modelQuality === 'medium'
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                Balanced
                              </button>
                              <button
                                type="button"
                                onClick={() => setModelQuality('large')}
                                className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                                  modelQuality === 'large'
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                Ultra Detail
                              </button>
                            </div>
                          </div>

                          {/* Compression Quality */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Output Quality:
                              </label>
                              <span className="text-xs font-mono font-bold text-rose-600">
                                {Math.round(outputQuality * 100)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.6"
                              max="1.0"
                              step="0.05"
                              value={outputQuality}
                              onChange={(e) => setOutputQuality(parseFloat(e.target.value))}
                              className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                              <span>Standard</span>
                              <span>High (95%)</span>
                              <span>Maximum</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          🧠 <strong>AI Neural Segmentation:</strong> Uses ISNet neural weights running in WebAssembly to recognize complex subjects, hair, and identical foreground/background hues without accidental cutouts.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-1">
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-800 dark:text-amber-300 text-xs">
                          ⚠️ <strong>Manual Graphic Cutout Notice:</strong> This mode uses color-distance flood-fill. Only use this for icons, logos, or solid color screens. If your subject shares color with the background (e.g. red shoe on red background), switch to <strong>AI Neural Model</strong> above.
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Color Tolerance:
                              </label>
                              <span className="text-xs font-mono font-bold text-rose-600">
                                {tolerance}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="70"
                              step="2"
                              value={tolerance}
                              onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
                              className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Feather Softness:
                              </label>
                              <span className="text-xs font-mono font-bold text-rose-600">
                                {featherRadius}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="1"
                              value={featherRadius}
                              onChange={(e) => setFeatherRadius(parseInt(e.target.value, 10))}
                              className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Target Backdrop:
                          </span>
                          <button
                            type="button"
                            onClick={() => setTargetColor('auto')}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                              targetColor === 'auto'
                                ? 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-600 dark:text-rose-400'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            Auto Border Detect
                          </button>
                          <button
                            type="button"
                            onClick={() => setTargetColor('white')}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                              targetColor === 'white'
                                ? 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-600 dark:text-rose-400'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            Studio White
                          </button>
                          <button
                            type="button"
                            onClick={() => setTargetColor('dark')}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                              targetColor === 'dark'
                                ? 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-600 dark:text-rose-400'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            Dark
                          </button>
                          <button
                            type="button"
                            onClick={() => setTargetColor('green')}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                              targetColor === 'green'
                                ? 'bg-rose-50 dark:bg-rose-950 border-rose-500 text-rose-600 dark:text-rose-400'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            Green Screen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-2xl flex items-start gap-3 text-xs sm:text-sm">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <p className="font-bold">Neural Model Notice</p>
                        <p className="text-xs text-rose-600 dark:text-rose-400">{errorMsg}</p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <a
                            href={window.location.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Open in New Window
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setEngineMode('fallback');
                              handleExecuteRemoval('fallback');
                            }}
                            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-rose-300 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-bold hover:bg-rose-50 transition cursor-pointer"
                          >
                            Try Graphic Color Cutout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processing Progress Bar */}
                  {processing && (
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                          {progressStage}
                        </span>
                        <span className="font-mono text-rose-600">{progress}%</span>
                      </div>

                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-rose-600 to-rose-500 transition-all duration-300 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action CTA Button */}
                  <button
                    type="button"
                    onClick={() => handleExecuteRemoval()}
                    disabled={processing}
                    className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Scissors className="w-5 h-5" />
                    {processing ? 'Processing Cutout...' : 'Remove Background Now'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* STAGE 2: RESULT & INTERACTIVE COMPARISON */
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              {/* Top Success Banner */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Background Removed Successfully!
                </h2>

                {/* Visible Debug Badge */}
                <div className="pt-1 flex items-center justify-center">
                  <div
                    id="debug-engine-badge"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border shadow-xs"
                    style={
                      usedEngine === 'ai'
                        ? { backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }
                        : { backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: usedEngine === 'ai' ? '#10b981' : '#f59e0b' }}
                    />
                    Engine: {usedEngine === 'ai' ? 'AI Neural Model (ISNet)' : 'Fallback'}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Cutout generated with 32-bit transparent alpha.
                </p>
              </div>

              {/* View Mode Controls & Background Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 mr-1.5">
                    Compare:
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewMode('slider')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                      viewMode === 'slider'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <SplitSquareVertical className="w-3.5 h-3.5" />
                    Split Slider
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('side-by-side')}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                      viewMode === 'side-by-side'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    Side by Side
                  </button>
                </div>

                {/* Background test colors */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 mr-1">
                    Preview Backdrop:
                  </span>
                  <button
                    type="button"
                    title="Transparent Checkerboard"
                    onClick={() => setPreviewBg('transparent')}
                    className={`w-6 h-6 rounded-md border-2 transition ${
                      previewBg === 'transparent' ? 'border-rose-600 scale-110' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '8px 8px',
                      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
                    }}
                  />
                  <button
                    type="button"
                    title="White Backdrop"
                    onClick={() => setPreviewBg('white')}
                    className={`w-6 h-6 rounded-md bg-white border-2 transition ${
                      previewBg === 'white' ? 'border-rose-600 scale-110' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                  <button
                    type="button"
                    title="Dark Backdrop"
                    onClick={() => setPreviewBg('dark')}
                    className={`w-6 h-6 rounded-md bg-slate-900 border-2 transition ${
                      previewBg === 'dark' ? 'border-rose-600 scale-110' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                  <input
                    type="color"
                    title="Custom color backdrop"
                    value={customBgColor}
                    onChange={(e) => {
                      setCustomBgColor(e.target.value);
                      setPreviewBg('color');
                    }}
                    className="w-6 h-6 rounded-md border-0 cursor-pointer p-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Main Interactive Comparison Display */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 select-none">
                {viewMode === 'slider' && originalImageUrl && resultImageUrl ? (
                  <div className="relative w-full h-[400px] sm:h-[480px] overflow-hidden flex items-center justify-center">
                    {/* Background checkerboard layer */}
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        ...getPreviewBgStyle(),
                        ...(isCheckerboard
                          ? {
                              backgroundImage:
                                'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                              backgroundSize: '16px 16px',
                              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                              backgroundColor: '#f8fafc',
                            }
                          : {}),
                      }}
                    />

                    {/* Result image (Cutout) */}
                    <img
                      src={resultImageUrl}
                      alt="Cutout result"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none p-4"
                    />

                    {/* Original image on top (Clipped by slider position) */}
                    <div
                      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                      style={{
                        clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                      }}
                    >
                      <div className="absolute inset-0 w-full h-full bg-slate-100 dark:bg-slate-900" />
                      <img
                        src={originalImageUrl}
                        alt="Original before cutout"
                        className="absolute inset-0 w-full h-full object-contain p-4"
                      />
                    </div>

                    {/* Split line divider */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl text-rose-600 flex items-center justify-center border-2 border-rose-500 font-bold text-xs pointer-events-none">
                        ↔
                      </div>
                    </div>

                    {/* Range input overlay */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />

                    {/* Floating Labels */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg pointer-events-none z-10">
                      Original Before
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-rose-600/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg pointer-events-none z-10">
                      Transparent After
                    </div>
                  </div>
                ) : (
                  /* Side-by-side mode */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>Original Photo</span>
                        <span>{formatBytes(files[0]?.size)}</span>
                      </div>
                      <div className="h-[280px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-800">
                        {originalImageUrl && (
                          <img
                            src={originalImageUrl}
                            alt="Original"
                            className="max-h-full max-w-full object-contain rounded-md"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span className="text-emerald-400">Background Removed</span>
                        <span className="text-emerald-400">{formatBytes(resultBlob?.size)}</span>
                      </div>
                      <div
                        className="h-[280px] rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-800 relative"
                        style={{
                          ...getPreviewBgStyle(),
                          ...(isCheckerboard
                            ? {
                                backgroundImage:
                                  'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                                backgroundSize: '16px 16px',
                                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                                backgroundColor: '#f8fafc',
                              }
                            : {}),
                        }}
                      >
                        {resultImageUrl && (
                          <img
                            src={resultImageUrl}
                            alt="Removed background"
                            className="max-h-full max-w-full object-contain rounded-md"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Box (Size Comparison) */}
              <div className="max-w-md mx-auto p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-around font-mono">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                    Original
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {formatBytes(files[0]?.size)}
                  </span>
                </div>
                <div className="text-slate-400">➔</div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                    Transparent PNG
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatBytes(resultBlob?.size)}
                  </span>
                </div>
                {imageDimensions && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                      Resolution
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {imageDimensions.width}×{imageDimensions.height}
                    </span>
                  </div>
                )}
              </div>

              {/* Primary Actions: Download & Copy */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" /> Download Transparent PNG
                </button>

                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Cutout Image'}
                </button>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="w-full sm:w-auto px-6 py-4 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Process Another Image
                </button>
              </div>
            </div>
          )}

          {/* In-content Ad Slot */}
          <AdSlot id="ad-slot-in-content" slotType="in-content" />
        </div>

        {/* 3. STEP BY STEP GUIDE SECTION */}
        <section className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600" />
            How to Remove Background in 3 Simple Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tool.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-sm mb-3">
                  0{idx + 1}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FAQ ACCORDION SECTION */}
        <section className="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {tool.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition"
                >
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {faq.q}
                  </span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {activeFaq === idx && (
                  <div className="p-5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 5. POPULAR RELATED TOOLS */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              More Image & Document Tools
            </h2>
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              View All 34+ Tools <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS_DATA.filter((t) => t.category === 'edit' && t.slug !== 'background-remover')
              .slice(0, 3)
              .map((relatedTool) => (
                <div
                  key={relatedTool.id}
                  onClick={() => onNavigateTool(relatedTool.slug)}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-rose-500/50 hover:shadow-md transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-rose-600 transition">
                    {relatedTool.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {relatedTool.shortDesc}
                  </p>
                </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
};
