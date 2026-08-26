import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-full">
            Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last Updated: February 2026
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using PDFMaster, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Description of Service</h2>
            <p>
              PDFMaster provides web-based client-side document utilities (including merging, splitting, converting, editing, compressing, and signing PDF documents). The service operates exclusively within the user's browser environment without requiring remote file storage.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. User Responsibility & Content</h2>
            <p>
              You retain all rights, ownership, and copyright to the documents you process through PDFMaster. You agree not to use the service for unlawful purposes or to violate intellectual property rights.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Disclaimer of Warranties</h2>
            <p>
              The service is provided on an "AS IS" and "AS AVAILABLE" basis. PDFMaster makes no representations or warranties of any kind, express or implied, as to the operation of their services or the information, content, or materials included.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Limitation of Liability</h2>
            <p>
              In no event shall PDFMaster, its developers, or affiliates be liable for any damages arising out of the use or inability to use the materials or tools on this website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
