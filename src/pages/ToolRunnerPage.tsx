import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Zap,
  ShieldCheck,
  Copy,
  Check,
  Eye,
  Sliders,
  MoveUp,
  MoveDown,
  Trash,
} from 'lucide-react';
import { ToolItem, ProcessedFileResult } from '../types';
import { resolveToolIcon } from '../components/ToolGrid';
import { FileDropzone } from '../components/FileDropzone';
import { SignatureCanvas } from '../components/SignatureCanvas';
import { AdSlot } from '../components/AdSlot';
import { SeoStructuredData } from '../components/SeoStructuredData';
import {
  getPdfThumbnails,
  mergePdfs,
  splitPdf,
  reorderPdf,
  deletePdfPages,
  rotatePdf,
  cropPdf,
  extractImagesFromPdf,
  insertImageIntoPdf,
  imagesToPdf,
  renderPdfToImages,
  wordToPdf,
  pdfToWord,
  excelToPdf,
  pdfToExcel,
  powerPointToPdf,
  htmlToPdf,
  pdfToHtml,
  txtToPdf,
  extractTextFromPdf,
  csvToPdf,
  pdfToPdfA,
  pdfToGrayscale,
  addWatermarkToPdf,
  addPageNumbersToPdf,
  stampPdf,
  editPdfMetadata,
  signPdfDocument,
  flattenPdf,
  repairPdf,
  protectPdf,
  unlockPdf,
  compressPdf,
} from '../utils/pdfEngine';
import JSZip from 'jszip';

interface ToolRunnerPageProps {
  tool: ToolItem;
  onNavigateTool: (slug: string) => void;
  onNavigateHome: () => void;
}

export const ToolRunnerPage: React.FC<ToolRunnerPageProps> = ({ tool, onNavigateTool, onNavigateHome }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessedFileResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Tool Specific States
  const [pageThumbnails, setPageThumbnails] = useState<{ pageNumber: number; dataUrl: string; width: number; height: number }[]>([]);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [selectedPagesToDelete, setSelectedPagesToDelete] = useState<Set<number>>(new Set());
  const [splitRange, setSplitRange] = useState('');
  const [rotationDegrees, setRotationDegrees] = useState(90);
  const [compressLevel, setCompressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkRotation, setWatermarkRotation] = useState(45);
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [pageNumberFormat, setPageNumberFormat] = useState<'Page X of Y' | 'X/Y' | 'X'>('Page X of Y');
  const [stampPreset, setStampPreset] = useState<'APPROVED' | 'CONFIDENTIAL' | 'DRAFT' | 'PAID' | 'VOID' | 'CUSTOM'>('APPROVED');
  const [customStampText, setCustomStampText] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaAuthor, setMetaAuthor] = useState('');
  const [metaSubject, setMetaSubject] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [protectPassword, setProtectPassword] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [rawTextInput, setRawTextInput] = useState('');
  const [htmlInput, setHtmlInput] = useState('<h1>Invoice / Report</h1><p>Styled document generated client-side.</p>');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [targetSignPage, setTargetSignPage] = useState(1);
  const [cropMargins, setCropMargins] = useState({ top: 30, bottom: 30, left: 30, right: 30 });
  const [extractedHtmlCode, setExtractedHtmlCode] = useState<string | null>(null);
  const [extractedTextContent, setExtractedTextContent] = useState<string | null>(null);

  const Icon = resolveToolIcon(tool.iconName);

  // Reset states on tool change
  useEffect(() => {
    setFiles([]);
    setResult(null);
    setErrorMsg(null);
    setProgress(0);
    setProcessing(false);
    setPageThumbnails([]);
    setPageOrder([]);
    setSelectedPagesToDelete(new Set());
    setSignatureDataUrl(null);
    setExtractedHtmlCode(null);
    setExtractedTextContent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.slug]);

  // Load PDF thumbnails when first file is uploaded
  useEffect(() => {
    let active = true;
    if (files.length > 0 && files[0].name.toLowerCase().endsWith('.pdf')) {
      getPdfThumbnails(files[0], 24).then((thumbs) => {
        if (active) {
          setPageThumbnails(thumbs);
          setPageOrder(thumbs.map((_, i) => i));
        }
      });
    } else {
      setPageThumbnails([]);
      setPageOrder([]);
    }
    return () => {
      active = false;
    };
  }, [files]);

  const handleFilesSelected = (newFiles: File[]) => {
    setErrorMsg(null);
    if (tool.allowMultiple) {
      setFiles((prev) => [...prev, ...newFiles]);
    } else {
      setFiles([newFiles[0]]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatBytes = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Main execution router for all 33+ tools
  const handleExecuteTool = async () => {
    if (files.length === 0 && !['html-to-pdf', 'txt-to-pdf'].includes(tool.slug)) {
      setErrorMsg('Please upload a file to proceed.');
      return;
    }

    try {
      setProcessing(true);
      setProgress(10);
      setErrorMsg(null);

      const mainFile = files[0];
      const baseName = mainFile ? mainFile.name.replace(/\.[^/.]+$/, '') : 'document';

      const executionTask = (async () => {
        switch (tool.slug) {
        // 1. MERGE PDF
        case 'merge-pdf': {
          if (files.length < 2) {
            throw new Error('Please select at least 2 PDF files to merge.');
          }
          const blob = await mergePdfs(files, setProgress);
          setResult({
            blob,
            fileName: `merged_document_${Date.now().toString().slice(-4)}.pdf`,
            originalSize: files.reduce((acc, f) => acc + f.size, 0),
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 2. SPLIT PDF
        case 'split-pdf': {
          const { blob, filename } = await splitPdf(mainFile, splitRange, setProgress);
          setResult({
            blob,
            fileName: filename,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: blob.type,
          });
          break;
        }

        // 3. REORDER PDF
        case 'reorder-pdf': {
          const blob = await reorderPdf(mainFile, pageOrder, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_reordered.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 4. DELETE PAGES
        case 'delete-pages': {
          const toDelete: number[] = Array.from(selectedPagesToDelete);
          if (toDelete.length === 0) {
            throw new Error('Please select at least one page to delete.');
          }
          const blob = await deletePdfPages(mainFile, toDelete, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_cleaned.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 5. ROTATE PDF
        case 'rotate-pdf': {
          const blob = await rotatePdf(mainFile, rotationDegrees, undefined, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_rotated.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 6. CROP PDF
        case 'crop-pdf': {
          const blob = await cropPdf(mainFile, cropMargins, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_cropped.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 7. EXTRACT IMAGES
        case 'extract-images': {
          const blob = await extractImagesFromPdf(mainFile, 'image/png', setProgress);
          setResult({
            blob,
            fileName: `${baseName}_images.zip`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/zip',
          });
          break;
        }

        // 8. INSERT PDF IMAGE
        case 'insert-pdf-image': {
          const imgFiles = files.filter((f) => !f.name.toLowerCase().endsWith('.pdf'));
          const pdfDocFile = files.find((f) => f.name.toLowerCase().endsWith('.pdf'));
          if (!pdfDocFile || imgFiles.length === 0) {
            throw new Error('Please upload 1 PDF and at least 1 image file (PNG/JPG).');
          }
          const blob = await insertImageIntoPdf(pdfDocFile, imgFiles, 'append', setProgress);
          setResult({
            blob,
            fileName: `${pdfDocFile.name.replace('.pdf', '')}_with_images.pdf`,
            originalSize: pdfDocFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 9. PDF TO JPG
        case 'pdf-to-jpg': {
          const images = await renderPdfToImages(mainFile, 'image/jpeg', 2.0, 0.9, setProgress);
          if (images.length === 1) {
            setResult({
              blob: images[0].blob,
              fileName: `${baseName}_page1.jpg`,
              originalSize: mainFile.size,
              newSize: images[0].blob.size,
              type: 'image/jpeg',
            });
          } else {
            const zip = new JSZip();
            images.forEach((img) => zip.file(`page_${img.pageNumber}.jpg`, img.blob));
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            setResult({
              blob: zipBlob,
              fileName: `${baseName}_jpg_pages.zip`,
              originalSize: mainFile.size,
              newSize: zipBlob.size,
              type: 'application/zip',
            });
          }
          break;
        }

        // 10. PDF TO PNG
        case 'pdf-to-png': {
          const images = await renderPdfToImages(mainFile, 'image/png', 2.0, 1.0, setProgress);
          if (images.length === 1) {
            setResult({
              blob: images[0].blob,
              fileName: `${baseName}_page1.png`,
              originalSize: mainFile.size,
              newSize: images[0].blob.size,
              type: 'image/png',
            });
          } else {
            const zip = new JSZip();
            images.forEach((img) => zip.file(`page_${img.pageNumber}.png`, img.blob));
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            setResult({
              blob: zipBlob,
              fileName: `${baseName}_png_pages.zip`,
              originalSize: mainFile.size,
              newSize: zipBlob.size,
              type: 'application/zip',
            });
          }
          break;
        }

        // 11. JPG TO PDF
        case 'jpg-to-pdf': {
          const blob = await imagesToPdf(files, 'fit', 10, setProgress);
          setResult({
            blob,
            fileName: `images_combined_${Date.now().toString().slice(-4)}.pdf`,
            originalSize: files.reduce((a, b) => a + b.size, 0),
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 12. WORD TO PDF
        case 'word-to-pdf': {
          const blob = await wordToPdf(mainFile, setProgress);
          setResult({
            blob,
            fileName: `${baseName}.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 13. PDF TO WORD
        case 'pdf-to-word': {
          const blob = await pdfToWord(mainFile, setProgress);
          setResult({
            blob,
            fileName: `${baseName}.docx`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          break;
        }

        // 14. EXCEL TO PDF
        case 'excel-to-pdf': {
          const blob = await excelToPdf(mainFile, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_report.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 15. PDF TO EXCEL
        case 'pdf-to-excel': {
          const blob = await pdfToExcel(mainFile, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_data.xlsx`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          break;
        }

        // 16. POWERPOINT TO PDF
        case 'powerpoint-to-pdf': {
          const blob = await powerPointToPdf(mainFile, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_slides.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 17. PDF TO POWERPOINT
        case 'pdf-to-powerpoint': {
          const images = await renderPdfToImages(mainFile, 'image/jpeg', 1.8, 0.9, setProgress);
          const zip = new JSZip();
          images.forEach((img) => zip.file(`slide_${img.pageNumber}.jpg`, img.blob));
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          setResult({
            blob: zipBlob,
            fileName: `${baseName}_presentation_slides.zip`,
            originalSize: mainFile.size,
            newSize: zipBlob.size,
            type: 'application/zip',
          });
          break;
        }

        // 18. HTML TO PDF
        case 'html-to-pdf': {
          const content = mainFile ? await mainFile.text() : htmlInput;
          const blob = await htmlToPdf(content, setProgress);
          setResult({
            blob,
            fileName: `rendered_html_doc.pdf`,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 19. PDF TO HTML
        case 'pdf-to-html': {
          const html = await pdfToHtml(mainFile, setProgress);
          setExtractedHtmlCode(html);
          const blob = new Blob([html], { type: 'text/html' });
          setResult({
            blob,
            fileName: `${baseName}.html`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'text/html',
          });
          break;
        }

        // 20. TXT TO PDF
        case 'txt-to-pdf': {
          const content = mainFile ? await mainFile.text() : rawTextInput;
          if (!content.trim()) throw new Error('Please enter text or upload a .txt file.');
          const blob = await txtToPdf(content, { title: baseName }, setProgress);
          setResult({
            blob,
            fileName: `${baseName || 'text_document'}.pdf`,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 21. PDF TO TEXT
        case 'pdf-to-text': {
          const text = await extractTextFromPdf(mainFile);
          setExtractedTextContent(text);
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          setResult({
            blob,
            fileName: `${baseName}.txt`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'text/plain',
          });
          break;
        }

        // 22. CSV TO PDF
        case 'csv-to-pdf': {
          const text = await mainFile.text();
          const blob = await csvToPdf(text, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_table.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 23. PDF TO PDF/A
        case 'pdf-to-pdfa': {
          const blob = await pdfToPdfA(mainFile, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_PDFA.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 24. PDF TO GRAYSCALE
        case 'pdf-to-grayscale': {
          const blob = await pdfToGrayscale(mainFile, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_grayscale.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 25. ADD WATERMARK
        case 'add-watermark': {
          const blob = await addWatermarkToPdf(
            mainFile,
            {
              text: watermarkText || 'CONFIDENTIAL',
              opacity: watermarkOpacity,
              rotationDegrees: watermarkRotation,
            },
            setProgress
          );
          setResult({
            blob,
            fileName: `${baseName}_watermarked.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 26. ADD PAGE NUMBERS
        case 'add-page-numbers': {
          const blob = await addPageNumbersToPdf(
            mainFile,
            {
              position: pageNumberPos,
              format: pageNumberFormat,
            },
            setProgress
          );
          setResult({
            blob,
            fileName: `${baseName}_numbered.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 27. STAMP PDF
        case 'stamp-pdf': {
          const blob = await stampPdf(mainFile, stampPreset, customStampText, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_stamped.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 28. EDIT METADATA
        case 'edit-metadata': {
          const blob = await editPdfMetadata(
            mainFile,
            {
              title: metaTitle,
              author: metaAuthor,
              subject: metaSubject,
              keywords: metaKeywords,
            },
            setProgress
          );
          setResult({
            blob,
            fileName: `${baseName}_updated.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 29. SIGN PDF
        case 'sign-pdf': {
          if (!signatureDataUrl) {
            throw new Error('Please create or draw your signature first.');
          }
          const blob = await signPdfDocument(
            mainFile,
            signatureDataUrl,
            targetSignPage,
            { x: 100, y: 100, width: 180, height: 75 },
            setProgress
          );
          setResult({
            blob,
            fileName: `${baseName}_signed.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 30. FLATTEN PDF
        case 'flatten-pdf': {
          const blob = await flattenPdf(mainFile, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_flattened.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 31. REPAIR PDF
        case 'repair-pdf': {
          const blob = await repairPdf(mainFile, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_repaired.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 32. PROTECT PDF
        case 'protect-pdf': {
          if (!protectPassword) throw new Error('Please enter a password to protect the document.');
          const blob = await protectPdf(mainFile, protectPassword, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_protected.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 33. UNLOCK PDF
        case 'unlock-pdf': {
          if (!unlockPassword || !unlockPassword.trim()) {
            throw new Error('Please enter the current document password to unlock this PDF.');
          }
          const blob = await unlockPdf(mainFile, unlockPassword, setProgress);
          setResult({
            blob,
            fileName: `${baseName}_unlocked.pdf`,
            originalSize: mainFile.size,
            newSize: blob.size,
            type: 'application/pdf',
          });
          break;
        }

        // 34. COMPRESS PDF
        case 'compress-pdf': {
          const res = await compressPdf(mainFile, compressLevel, setProgress);
          setResult({
            blob: res.blob,
            fileName: `compressed_${baseName}.pdf`,
            originalSize: res.originalSize,
            newSize: res.newSize,
            type: 'application/pdf',
          });
          break;
        }

        default: {
          throw new Error('This tool configuration is currently executing standard optimization.');
        }
      }
      })();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Processing timed out. Please verify your file and try again.'));
        }, 25000);
      });

      await Promise.race([executionTask, timeoutPromise]);

      // Fire celebratory confetti!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while processing the file.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <SeoStructuredData type="tool" tool={tool} />

      {/* Hero Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-full mb-4">
            <Icon className="w-4 h-4" />
            <span className="capitalize">{tool.category} PDF Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {tool.name} Online Free
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {tool.fullDesc}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% In-Browser Safe
            </span>
            <span>•</span>
            <span>No File Size Caps</span>
            <span>•</span>
            <span>No Registration</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Workspace Area */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          {/* Top Ad Slot */}
          <AdSlot id="ad-slot-header" slotType="header" className="my-0 mb-8" />

          {/* 1. UPLOAD STAGE */}
          {!result && (
            <div className="space-y-8">
              {/* Specialized text/html direct editors if no file is uploaded yet */}
              {tool.slug === 'txt-to-pdf' && files.length === 0 && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Type or paste text directly (or upload a .txt file below):
                  </label>
                  <textarea
                    rows={6}
                    value={rawTextInput}
                    onChange={(e) => setRawTextInput(e.target.value)}
                    placeholder="Enter document text here..."
                    className="w-full p-4 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              )}

              {tool.slug === 'html-to-pdf' && files.length === 0 && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Paste raw HTML markup (or upload an .html file below):
                  </label>
                  <textarea
                    rows={6}
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    placeholder="<h1>Hello</h1><p>World</p>"
                    className="w-full p-4 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              )}

              {/* Upload Dropzone */}
              <FileDropzone
                acceptedFiles={tool.acceptedFiles}
                allowMultiple={tool.allowMultiple}
                files={files}
                onFilesSelected={handleFilesSelected}
                onFileRemove={handleRemoveFile}
                title={`Upload ${tool.acceptedFiles.toUpperCase()} Document`}
                subtitle={`Select file to ${tool.name.toLowerCase()} directly in your browser`}
              />

              {/* Specific Options Panels When Files Are Loaded */}
              {files.length > 0 && (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-rose-600" />
                    Configure {tool.name} Parameters
                  </h3>

                  {/* SPLIT OPTIONS */}
                  {tool.slug === 'split-pdf' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                        Page Range (e.g. "1-3, 5, 8-12" or leave blank to split every page):
                      </label>
                      <input
                        type="text"
                        value={splitRange}
                        onChange={(e) => setSplitRange(e.target.value)}
                        placeholder="e.g. 1-2, 4"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl"
                      />
                    </div>
                  )}

                  {/* REORDER THUMBNAILS */}
                  {tool.slug === 'reorder-pdf' && pageThumbnails.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-3">
                        Use the arrow controls to move pages into your preferred order:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        {pageOrder.map((pageIdx, currentPosition) => {
                          const thumb = pageThumbnails[pageIdx];
                          if (!thumb) return null;
                          return (
                            <div
                              key={`${pageIdx}-${currentPosition}`}
                              className="relative p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center"
                            >
                              <img
                                src={thumb.dataUrl}
                                alt={`Page ${pageIdx + 1}`}
                                className="w-full h-24 object-contain rounded-md bg-white border border-slate-200"
                              />
                              <div className="mt-2 flex items-center justify-between w-full text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                <span>Pg {pageIdx + 1}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={currentPosition === 0}
                                    onClick={() => {
                                      const next = [...pageOrder];
                                      const temp = next[currentPosition - 1];
                                      next[currentPosition - 1] = next[currentPosition];
                                      next[currentPosition] = temp;
                                      setPageOrder(next);
                                    }}
                                    className="p-1 rounded-sm hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                                  >
                                    <MoveUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={currentPosition === pageOrder.length - 1}
                                    onClick={() => {
                                      const next = [...pageOrder];
                                      const temp = next[currentPosition + 1];
                                      next[currentPosition + 1] = next[currentPosition];
                                      next[currentPosition] = temp;
                                      setPageOrder(next);
                                    }}
                                    className="p-1 rounded-sm hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                                  >
                                    <MoveDown className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* DELETE PAGES SELECTOR */}
                  {tool.slug === 'delete-pages' && pageThumbnails.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-3">
                        Click on pages you wish to <strong>delete</strong>:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        {pageThumbnails.map((thumb, idx) => {
                          const isSelected = selectedPagesToDelete.has(idx);
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                const next = new Set(selectedPagesToDelete);
                                if (next.has(idx)) next.delete(idx);
                                else next.add(idx);
                                setSelectedPagesToDelete(next);
                              }}
                              className={`relative p-2 rounded-xl cursor-pointer transition border-2 ${
                                isSelected
                                  ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40'
                                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                              }`}
                            >
                              <img
                                src={thumb.dataUrl}
                                alt={`Page ${idx + 1}`}
                                className="w-full h-24 object-contain rounded-md bg-white"
                              />
                              <div className="mt-1.5 flex items-center justify-between text-[11px] font-bold">
                                <span>Page {idx + 1}</span>
                                {isSelected ? (
                                  <span className="text-rose-600 font-bold text-[10px] uppercase">
                                    DELETE
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 text-[10px]">KEEP</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ROTATE PDF OPTIONS */}
                  {tool.slug === 'rotate-pdf' && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Rotation Angle:
                      </span>
                      {[90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          type="button"
                          onClick={() => setRotationDegrees(deg)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                            rotationDegrees === deg
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {deg}° Clockwise
                        </button>
                      ))}
                    </div>
                  )}

                  {/* COMPRESS PDF OPTIONS */}
                  {tool.slug === 'compress-pdf' && (
                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                        Select Compression Strength:
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'low', label: 'Low Compression', sub: 'Highest Quality' },
                          { id: 'medium', label: 'Recommended', sub: 'Balanced Size & Clarity' },
                          { id: 'high', label: 'Extreme', sub: 'Maximum Size Reduction' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setCompressLevel(c.id as any)}
                            className={`p-3 rounded-xl border text-left transition ${
                              compressLevel === c.id
                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <p className="text-xs font-bold">{c.label}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{c.sub}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* WATERMARK OPTIONS */}
                  {tool.slug === 'add-watermark' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Watermark Text:
                        </label>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Opacity ({Math.round(watermarkOpacity * 100)}%):
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                          className="w-full accent-rose-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Rotation ({watermarkRotation}°):
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="90"
                          step="15"
                          value={watermarkRotation}
                          onChange={(e) => setWatermarkRotation(parseInt(e.target.value, 10))}
                          className="w-full accent-rose-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* PAGE NUMBERS OPTIONS */}
                  {tool.slug === 'add-page-numbers' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Position:
                        </label>
                        <select
                          value={pageNumberPos}
                          onChange={(e) => setPageNumberPos(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                        >
                          <option value="bottom-center">Bottom Center</option>
                          <option value="bottom-right">Bottom Right</option>
                          <option value="top-right">Top Right</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Format:
                        </label>
                        <select
                          value={pageNumberFormat}
                          onChange={(e) => setPageNumberFormat(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                        >
                          <option value="Page X of Y">Page X of Y</option>
                          <option value="X/Y">X / Y</option>
                          <option value="X">X</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STAMP OPTIONS */}
                  {tool.slug === 'stamp-pdf' && (
                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                        Choose Stamp Style:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['APPROVED', 'CONFIDENTIAL', 'DRAFT', 'PAID', 'VOID', 'CUSTOM'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setStampPreset(preset as any)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                              stampPreset === preset
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                      {stampPreset === 'CUSTOM' && (
                        <input
                          type="text"
                          value={customStampText}
                          onChange={(e) => setCustomStampText(e.target.value)}
                          placeholder="Type custom stamp text..."
                          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg mt-2"
                        />
                      )}
                    </div>
                  )}

                  {/* EDIT METADATA OPTIONS */}
                  {tool.slug === 'edit-metadata' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="Document Title"
                        className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                      />
                      <input
                        type="text"
                        value={metaAuthor}
                        onChange={(e) => setMetaAuthor(e.target.value)}
                        placeholder="Author Name"
                        className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                      />
                      <input
                        type="text"
                        value={metaSubject}
                        onChange={(e) => setMetaSubject(e.target.value)}
                        placeholder="Subject / Theme"
                        className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                      />
                      <input
                        type="text"
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        placeholder="Keywords (comma separated)"
                        className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                      />
                    </div>
                  )}

                  {/* SIGN PDF CANVAS */}
                  {tool.slug === 'sign-pdf' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          Place Signature on Page:
                        </label>
                        <select
                          value={targetSignPage}
                          onChange={(e) => setTargetSignPage(parseInt(e.target.value, 10))}
                          className="px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
                        >
                          {pageThumbnails.map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Page {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <SignatureCanvas onSignatureConfirmed={(data) => setSignatureDataUrl(data)} />
                      {signatureDataUrl && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          <span>Signature loaded and ready for placement!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PROTECT PASSWORD */}
                  {tool.slug === 'protect-pdf' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Document Protection Password:
                      </label>
                      <input
                        type="password"
                        value={protectPassword}
                        onChange={(e) => setProtectPassword(e.target.value)}
                        placeholder="Enter secure encryption password..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Applies standard PDF encryption with user/owner protection. Any PDF reader (Adobe Acrobat, Chrome, Edge, Apple Preview) will require this password to view the document.
                      </p>
                    </div>
                  )}

                  {/* UNLOCK PASSWORD */}
                  {tool.slug === 'unlock-pdf' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Current Document Password:
                      </label>
                      <input
                        type="password"
                        value={unlockPassword}
                        onChange={(e) => setUnlockPassword(e.target.value)}
                        placeholder="Enter document password to remove lock..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Decrypts the PDF and removes encryption restrictions, producing an unencrypted PDF that opens freely anywhere.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message Display */}
              {errorMsg && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-2xl flex items-center gap-3 text-xs sm:text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Progress Bar during execution */}
              {processing && (
                <div className="space-y-2 py-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-rose-600 animate-spin" /> Processing locally in
                      browser memory...
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Main CTA Button */}
              <button
                type="button"
                onClick={handleExecuteTool}
                disabled={processing || (files.length === 0 && !['html-to-pdf', 'txt-to-pdf'].includes(tool.slug))}
                className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Icon className="w-5 h-5" />
                {processing ? 'Processing...' : `Execute ${tool.name}`}
              </button>
            </div>
          )}

          {/* 2. RESULT & DOWNLOAD STAGE */}
          {result && (
            <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Document Ready for Instant Download!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your file was converted locally in memory. Zero bytes were sent to any server.
                </p>
              </div>

              {/* Stats Box (Size comparison) */}
              <div className="max-w-md mx-auto p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-around font-mono">
                <div>
                  <span className="text-slate-600 dark:text-slate-300 block text-[10px] uppercase font-bold">
                    File Name
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px] inline-block">
                    {result.fileName}
                  </span>
                </div>
                {result.originalSize && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-300 block text-[10px] uppercase font-bold">
                      Original Size
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {formatBytes(result.originalSize)}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-slate-600 dark:text-slate-300 block text-[10px] uppercase font-bold">
                    New Size
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatBytes(result.newSize)}
                  </span>
                </div>
              </div>

              {/* Direct Download Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" /> Download {result.fileName}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setFiles([]);
                    setExtractedHtmlCode(null);
                    setExtractedTextContent(null);
                  }}
                  className="w-full sm:w-auto px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Process Another File
                </button>
              </div>

              {/* Extra extracted text view for PDF to Text or PDF to HTML */}
              {extractedTextContent && (
                <div className="mt-6 text-left border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Extracted Text Content
                    </span>
                    <button
                      onClick={() => handleCopyClipboard(extractedTextContent)}
                      className="text-xs text-rose-600 flex items-center gap-1 font-semibold hover:underline"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedText ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                  <pre className="max-h-60 overflow-y-auto text-[11px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    {extractedTextContent}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* In-content Ad Slot */}
          <AdSlot id="ad-slot-in-content" slotType="in-content" />
        </div>

        {/* 3. STEP BY STEP GUIDE SECTION */}
        <section className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600" />
            How to {tool.name} in 3 Simple Steps
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
        {tool.faqs && tool.faqs.length > 0 && (
          <section className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions about {tool.name}
            </h2>

            <div className="space-y-4">
              {tool.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. RELATED TOOLS SECTION (Internal Linking for SEO) */}
        {tool.relatedToolSlugs && tool.relatedToolSlugs.length > 0 && (
          <section className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
              Related PDF Utilities You Might Need
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {tool.relatedToolSlugs.map((slug) => (
                <a
                  key={slug}
                  href={`/${slug}`}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      onNavigateTool(slug);
                    }
                  }}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 cursor-pointer transition flex items-center justify-between group block"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 capitalize">
                    {slug.replace(/-/g, ' ')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
