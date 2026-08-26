import React from 'react';

export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-full">
            GDPR & Privacy Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Cookie Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Last Updated: February 2026
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your computer or mobile device when you visit websites. They are widely used to make websites work efficiently, save user preferences, and provide reporting information to site owners.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">How We Use Cookies</h2>
            <p>ToolMaster uses cookies for the following categories of functionality:</p>
            <ul className="list-disc list-inside mt-2 space-y-1.5 pl-2">
              <li><strong>Essential & Functional Cookies:</strong> To remember your interface theme (Dark/Light mode) and store your cookie preference consent choice.</li>
              <li><strong>Advertising Cookies (Google AdSense):</strong> Third-party advertising partners use cookies to serve personalized or contextual advertisements relevant to users.</li>
              <li><strong>Analytics Cookies:</strong> To measure anonymous site performance, browser compatibility metrics, and user journey flows.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Managing Your Cookie Preferences</h2>
            <p>
              You can control and manage cookie settings in your web browser. You can clear existing cookies and configure your browser to reject new cookies. For detailed instructions on managing cookies, consult your browser's documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
