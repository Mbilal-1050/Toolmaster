import React from 'react';
import { X, Share, PlusSquare, Smartphone, CheckCircle, Sparkles } from 'lucide-react';

interface IosInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIos?: boolean;
}

export const IosInstallModal: React.FC<IosInstallModalProps> = ({
  isOpen,
  onClose,
  isIos = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-app-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-600/30">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 id="install-app-title" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Install ToolMaster App
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                100% Free
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Use 33+ PDF tools offline with faster launch speeds
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        {isIos ? (
          <div className="space-y-3.5 my-4 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                Tap the <span className="font-semibold text-slate-900 dark:text-white">Share</span> button <Share className="w-3.5 h-3.5 inline text-rose-600 dark:text-rose-400 mx-0.5" /> in your Safari bottom toolbar.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                Scroll down and tap <span className="font-semibold text-slate-900 dark:text-white">"Add to Home Screen"</span> <PlusSquare className="w-3.5 h-3.5 inline text-rose-600 dark:text-rose-400 mx-0.5" />.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                Tap <span className="font-semibold text-slate-900 dark:text-white">"Add"</span> in the top-right corner. The app icon will appear on your Home Screen!
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 my-4 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                Look for the <span className="font-semibold text-slate-900 dark:text-white">Install Icon</span> <Sparkles className="w-3.5 h-3.5 inline text-rose-600 dark:text-rose-400 mx-0.5" /> in your browser address bar (Chrome/Edge) or browser settings menu.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                Click <span className="font-semibold text-slate-900 dark:text-white">"Install ToolMaster"</span> to add the standalone desktop/mobile app.
              </div>
            </div>
          </div>
        )}

        {/* Benefits bullets */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 100% In-Browser
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Offline Ready
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> No Downloads
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition active:scale-98"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
