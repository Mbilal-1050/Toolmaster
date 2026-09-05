import React from 'react';

interface PeerlistBadgeProps {
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const PeerlistBadge: React.FC<PeerlistBadgeProps> = ({
  theme = 'auto',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-200 ${className}`}>
      <a
        href="https://peerlist.io/landedofficial/project/toolmaster--34-pdf-tools"
        target="_blank"
        rel="noreferrer"
        className="inline-block rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
        title="ToolMaster on Peerlist"
        aria-label="ToolMaster - Featured on Peerlist"
      >
        {/* Light Theme SVG */}
        <svg
          width="240"
          height="54"
          viewBox="0 0 240 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={theme === 'auto' ? 'dark:hidden' : theme === 'dark' ? 'hidden' : 'block'}
        >
          <rect width="240" height="54" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Peerlist Green Square Icon */}
          <rect x="16" y="11" width="32" height="32" rx="8" fill="#00AA45" />
          <path
            d="M27 18H33C35.2 18 36.5 19.3 36.5 21.2C36.5 23.1 35.2 24.4 33 24.4H29.5V31H27V18ZM29.5 22.3H32.6C33.6 22.3 34.2 21.8 34.2 21.2C34.2 20.6 33.6 20.1 32.6 20.1H29.5V22.3Z"
            fill="#FFFFFF"
          />
          {/* Text Labels */}
          <text fill="#64748B" fontFamily="system-ui, -apple-system, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.08em" x="58" y="21">
            FEATURED ON
          </text>
          <text fill="#0F172A" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="800" x="58" y="38">
            Peerlist Projects
          </text>
          {/* Status Badge */}
          <rect x="184" y="15" width="44" height="24" rx="6" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1" />
          <circle cx="194" cy="27" r="3" fill="#00AA45" />
          <text fill="#166534" fontFamily="system-ui, -apple-system, sans-serif" fontSize="10" fontWeight="700" x="201" y="30">
            PRO
          </text>
        </svg>

        {/* Dark Theme SVG */}
        <svg
          width="240"
          height="54"
          viewBox="0 0 240 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={theme === 'auto' ? 'hidden dark:block' : theme === 'light' ? 'hidden' : 'block'}
        >
          <rect width="240" height="54" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          {/* Peerlist Green Square Icon */}
          <rect x="16" y="11" width="32" height="32" rx="8" fill="#00AA45" />
          <path
            d="M27 18H33C35.2 18 36.5 19.3 36.5 21.2C36.5 23.1 35.2 24.4 33 24.4H29.5V31H27V18ZM29.5 22.3H32.6C33.6 22.3 34.2 21.8 34.2 21.2C34.2 20.6 33.6 20.1 32.6 20.1H29.5V22.3Z"
            fill="#FFFFFF"
          />
          {/* Text Labels */}
          <text fill="#94A3B8" fontFamily="system-ui, -apple-system, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.08em" x="58" y="21">
            FEATURED ON
          </text>
          <text fill="#F8FAFC" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="800" x="58" y="38">
            Peerlist Projects
          </text>
          {/* Status Badge */}
          <rect x="184" y="15" width="44" height="24" rx="6" fill="#052E16" stroke="#166534" strokeWidth="1" />
          <circle cx="194" cy="27" r="3" fill="#00AA45" />
          <text fill="#4ADE80" fontFamily="system-ui, -apple-system, sans-serif" fontSize="10" fontWeight="700" x="201" y="30">
            PRO
          </text>
        </svg>
      </a>
    </div>
  );
};

export const PeerlistLaunchCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-[540px] mx-auto p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:shadow-md ${className}`}>
      <div className="flex items-center gap-3.5 mb-3.5">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#00AA45]/10 text-[#00AA45] flex items-center justify-center font-black text-2xl shrink-0 shadow-xs border border-[#00AA45]/20">
          <span className="tracking-tighter font-extrabold text-[#00AA45]">P</span>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              ToolMaster on Peerlist
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
              Project
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
            34+ Free & In-Browser PDF Tools. Zero server uploads.
          </p>
        </div>
      </div>
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Featured on Peerlist Projects
        </span>
        <a
          href="https://peerlist.io/landedofficial/project/toolmaster--34-pdf-tools"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00AA45] hover:bg-[#00923b] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
        >
          <span>View on Peerlist</span>
          <span className="text-sm font-bold">→</span>
        </a>
      </div>
    </div>
  );
};
