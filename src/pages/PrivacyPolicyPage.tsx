import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-full">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last Updated: February 2026 • Compliant with GDPR, CCPA & Google AdSense Standards
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {/* Highlight Callout */}
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base mb-1">
                Zero Document Upload Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
                ToolMaster is architected as a 100% client-side application. When you use any tool (Merge, Split, Convert, Sign, Compress, etc.), your files are processed entirely inside your local device's browser memory. Your documents are never uploaded, stored, or viewed by our servers or any third parties.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Information We Do Not Collect
            </h2>
            <p>
              We do not collect, view, inspect, or retain your uploaded files, images, PDFs, Word documents, or signatures. All binary file operations are executed strictly within the client-side JavaScript engine on your device. Once you close or reload your browser tab, all temporary memory objects are purged by your browser's garbage collector.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Cookies & Web Beacons
            </h2>
            <p>
              We use cookies to store your UI preferences (such as dark mode and cookie banner dismissal) and to analyze aggregated, anonymized site traffic. You may disable cookies through your browser settings, though some functional interface settings may reset.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Google AdSense & Third-Party Advertising
            </h2>
            <p>
              We display advertisements provided by Google AdSense and its certified advertising partners to keep our services free for everyone worldwide.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.
              </li>
              <li>
                Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noreferrer"
                  className="text-rose-600 underline"
                >
                  Google Ads Settings
                </a>.
              </li>
            </ul>
          </div>

          <AdSlot id="ad-slot-privacy" slotType="in-content" />

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. Analytics & Aggregate Metrics
            </h2>
            <p>
              We may utilize privacy-friendly analytics tools (e.g. Google Analytics 4) to monitor general site metrics such as page views, device types, and browser versions. These metrics do not contain personally identifiable information or document contents.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              5. GDPR & CCPA Compliance
            </h2>
            <p>
              Under the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you retain rights regarding your personal data. Because we do not store, sell, or collect user files or personal databases, your confidential documents remain entirely in your custody at all times.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              6. Contact for Privacy Inquiries
            </h2>
            <p>
              If you have questions or feedback regarding this Privacy Policy, you may contact our privacy compliance team at{' '}
              <a href="mailto:privacy@toolmaster.app" className="text-rose-600 font-semibold underline">
                privacy@toolmaster.app
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
