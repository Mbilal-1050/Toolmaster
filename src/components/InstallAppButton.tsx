import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { IosInstallModal } from './IosInstallModal';

interface InstallAppButtonProps {
  variant?: 'header' | 'mobile-drawer' | 'banner' | 'footer';
  className?: string;
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const {
    canShowButton,
    isIos,
    showIosModal,
    setShowIosModal,
    triggerInstall,
  } = usePwaInstall();

  if (!canShowButton) {
    return null;
  }

  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-xs hover:shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer ${className}`}
          title="Install ToolMaster as a standalone App"
        >
          <Download className="w-3.5 h-3.5 animate-bounce-subtle" />
          <span>Install App</span>
        </button>

        <IosInstallModal
          isOpen={showIosModal}
          onClose={() => setShowIosModal(false)}
          isIos={isIos}
        />
      </>
    );
  }

  if (variant === 'mobile-drawer') {
    return (
      <>
        <button
          type="button"
          onClick={triggerInstall}
          className={`w-full flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-900/50 active:scale-98 transition ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4" />
            <span>Install ToolMaster App</span>
          </div>
          <span className="px-2 py-0.5 text-[10px] uppercase font-black bg-rose-600 text-white rounded-md">
            Free
          </span>
        </button>

        <IosInstallModal
          isOpen={showIosModal}
          onClose={() => setShowIosModal(false)}
          isIos={isIos}
        />
      </>
    );
  }

  // Banner variant
  return (
    <>
      <div
        className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3.5 ${className}`}
      >
        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Install ToolMaster on your Device
            </h4>
            <p className="text-[11px] sm:text-xs text-rose-100 mt-0.5">
              Access 33+ PDF tools directly from your home screen or desktop anytime.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={triggerInstall}
          className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl shadow-md transition active:scale-95 shrink-0"
        >
          Install Now
        </button>
      </div>

      <IosInstallModal
        isOpen={showIosModal}
        onClose={() => setShowIosModal(false)}
        isIos={isIos}
      />
    </>
  );
};
