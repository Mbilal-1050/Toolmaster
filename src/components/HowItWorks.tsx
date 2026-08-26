import React from 'react';
import { Upload, SlidersHorizontal, Download, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Upload,
      title: 'Choose or Drop File',
      desc: 'Select your PDF or document from your computer, phone, or drag it into the browser window.',
    },
    {
      step: '02',
      icon: SlidersHorizontal,
      title: 'Configure & Process Locally',
      desc: 'Set your options like page ranges, compression level, rotation, or watermark. The engine executes 100% in your browser.',
    },
    {
      step: '03',
      icon: Download,
      title: 'Instant Download',
      desc: 'Download your finalized high-quality file instantly without waiting in upload or conversion queues.',
    },
  ];

  return (
    <section aria-label="How PDFMaster Works" className="py-16 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 3-Step Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How PDFMaster Works
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
            Zero cloud uploads. Zero software installation. Process documents securely in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white dark:bg-slate-800/80 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-700 font-mono">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
