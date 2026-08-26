import React from 'react';

interface AdSlotProps {
  id: string;
  slotType?: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ id, slotType = 'in-content', className = '' }) => {
  return (
    <div
      id={id}
      className={`my-6 mx-auto w-full max-w-4xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-4 text-center transition-all ${className}`}
    >
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-mono mb-2 uppercase tracking-wider">
        <span>Advertisement</span>
        <span>AdSense Ready Slot ({slotType})</span>
      </div>
      <div className="flex flex-col items-center justify-center py-6 px-4 bg-white/70 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          Reserved Space for Google AdSense Display Unit
        </p>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
          Target slot: <code className="text-rose-600 dark:text-rose-400 font-mono">#{id}</code>
        </p>
      </div>
    </div>
  );
};
