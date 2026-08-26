import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Shield, Zap, Lock, HardDrive } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const prefersReduced = useReducedMotion();

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
    <section aria-label="Trust Signals" className="w-full py-8 border-y border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: prefersReduced ? 0 : idx * 0.1, ease: 'easeOut' }}
                whileHover={prefersReduced ? {} : { y: -2 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="p-3 bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 rounded-xl shrink-0 group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {badge.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

