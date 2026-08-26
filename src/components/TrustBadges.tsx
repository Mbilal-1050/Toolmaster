import React from 'react';
import { Shield, Zap, Lock, HardDrive, CheckCircle2 } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      title: '100% In-Browser Privacy',
      desc: 'Your files never leave your device. Zero server uploads.',
    },
    {
      icon: Zap,
      title: 'Instant Client-Side Speed',
      desc: 'No upload queues or bandwidth latency bottlenecks.',
    },
    {
      icon: HardDrive,
      title: 'No Arbitrary File Limits',
      desc: 'Process files as large as your device memory allows.',
    },
    {
      icon: Lock,
      title: 'Zero Registration',
      desc: '100% free forever without subscriptions or credit cards.',
    },
  ];

  return (
    <section aria-label="Trust Signals" className="w-full py-8 border-y border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 transition-all hover:shadow-sm"
              >
                <div className="p-3 bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
