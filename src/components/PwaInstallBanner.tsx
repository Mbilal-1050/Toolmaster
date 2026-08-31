import React from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { IosInstallModal } from './IosInstallModal';

interface PwaInstallBannerProps {
  className?: string;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  className = '',
}) => {
  const {
    canShowBanner,
    isIos,
    showIosModal,
    setShowIosModal,
    dismissBanner,
    triggerInstall,
  } = usePwaInstall();

  if (!canShowBanner) {
    return null;
  }

  return (
    <>
      <div
        id="pwa-install-banner"
        className={`w-full bg-rose-50/90 dark:bg-rose-950/40 border-b border-rose-200/80 dark:border-rose-900/60 backdrop-blur-xs transition-all duration-300 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 text-left">
          {/* Left info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span className="text-base sm:text-lg shrink-0 leading-none" role="img" aria-label="Smartphone">
              📲
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Install ToolMaster
              </span>
              <span className="hidden xs:inline text-slate-400 dark:text-slate-600 font-normal">
                —
              </span>
              <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 truncate hidden xs:inline">
                Quick access & 100% offline PDF tools
              </span>
            </div>
          </div>

          {/* Right actions: Install Button + Dismiss Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={triggerInstall}
              className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-lg sm:rounded-xl shadow-xs hover:shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>

            <button
              type="button"
              onClick={dismissBanner}
              className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-rose-100/70 dark:hover:bg-rose-900/50 transition cursor-pointer"
              title="Dismiss banner"
              aria-label="Dismiss install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <IosInstallModal
        isOpen={showIosModal}
        onClose={() => setShowIosModal(false)}
        isIos={isIos}
      />
    </>
  );
};
