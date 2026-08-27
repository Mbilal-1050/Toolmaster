import React from 'react';
import { Shield, Lock, Cpu, Globe, CheckCircle2, Heart } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { ProductHuntBadge, ProductHuntLaunchCard } from '../components/ProductHuntBadge';

interface AboutPageProps {
  onNavigateHome: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-full">
            Our Mission & Technology
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            About ToolMaster
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Redefining document utilities with 100% in-browser privacy and zero server latency.
          </p>
        </div>

        {/* Main Content Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-300">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-600" />
              The Problem with Traditional PDF Converters
            </h2>
            <p>
              For over two decades, working with PDF files online meant accepting a dangerous privacy compromise: uploading confidential tax forms, legal contracts, business receipts, and medical records to remote cloud servers operated by unknown entities. In addition to serious privacy concerns, remote processing introduces artificial upload queues, file size limits, subscription paywalls, and heavy bandwidth consumption.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-rose-600" />
              The 100% Client-Side Revolution
            </h2>
            <p>
              ToolMaster was engineered from the ground up to solve this fundamental privacy flaw. By harnessing modern web standards—including WebAssembly, HTML5 File and Blob APIs, and client-side JavaScript execution—every single tool on ToolMaster runs locally inside your web browser. 
            </p>
            <p className="mt-3">
              When you merge three PDFs, compress a 50MB scanner file, or electronically sign an NDA, your computer or smartphone CPU performs all mathematical calculations locally in volatile memory. <strong>Not a single byte of your document ever travels over the internet.</strong>
            </p>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> True Zero-Upload Privacy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your private files remain securely in your device sandbox at all times.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Arbitrary File Caps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Process multi-hundred-page files without artificial paywalls.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Performance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Zero network upload delays means files convert in fractions of a second.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free Forever
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supported by non-intrusive standard ads—no subscriptions or accounts needed.
              </p>
            </div>
          </div>

          <AdSlot id="ad-slot-about" slotType="in-content" />

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-rose-600" />
              Open Web Standards & Transparency
            </h2>
            <p>
              We believe privacy should be open and verifiable. Our tools leverage open-source libraries including <code className="text-rose-600 font-mono text-xs">pdf-lib</code>, <code className="text-rose-600 font-mono text-xs">pdfjs-dist</code>, and <code className="text-rose-600 font-mono text-xs">jspdf</code>. You can audit your browser's network inspector at any time while using any tool to confirm that zero document payload requests are made.
            </p>
          </div>

          <div className="py-4">
            <ProductHuntLaunchCard />
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <ProductHuntBadge />
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              Explore All 33+ Free Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
