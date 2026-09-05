import React from 'react';

interface ProductHuntBadgeProps {
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const ProductHuntBadge: React.FC<ProductHuntBadgeProps> = ({
  theme = 'auto',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-200 ${className}`}>
      <a
        href="https://www.producthunt.com/products/toolmaster-3?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-toolmaster-3"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
        title="ToolMaster on Product Hunt"
        aria-label="ToolMaster - Featured on Product Hunt"
      >
        {/* Light Theme SVG */}
        <svg
          width="250"
          height="54"
          viewBox="0 0 250 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={theme === 'auto' ? 'dark:hidden' : theme === 'dark' ? 'hidden' : 'block'}
        >
          <rect width="250" height="54" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* PH Cat/P Logo Circle */}
          <circle cx="32" cy="27" r="16" fill="#FF6154" />
          <path
            d="M28 20H33.2C35.4 20 37 21.2 37 23.3C37 25.4 35.4 26.6 33.2 26.6H30.5V34H28V20ZM30.5 24.6H33C34.2 24.6 35 24.1 35 23.3C35 22.5 34.2 22 33 22H30.5V24.6Z"
            fill="#FFFFFF"
          />
          {/* Text Labels */}
          <text fill="#64748B" fontFamily="system-ui, -apple-system, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.08em" x="58" y="21">
            FEATURED ON
          </text>
          <text fill="#0F172A" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="800" x="58" y="38">
            Product Hunt
          </text>
          {/* Upvote Pill */}
          <rect x="186" y="13" width="52" height="28" rx="8" fill="#FFF5F4" stroke="#FED7D2" strokeWidth="1" />
          <path d="M198 28L203 21L208 28H198Z" fill="#FF6154" />
          <text fill="#FF6154" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" fontWeight="700" x="212" y="28">
            ▲
          </text>
        </svg>

        {/* Dark Theme SVG */}
        <svg
          width="250"
          height="54"
          viewBox="0 0 250 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={theme === 'auto' ? 'hidden dark:block' : theme === 'light' ? 'hidden' : 'block'}
        >
          <rect width="250" height="54" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          {/* PH Cat/P Logo Circle */}
          <circle cx="32" cy="27" r="16" fill="#FF6154" />
          <path
            d="M28 20H33.2C35.4 20 37 21.2 37 23.3C37 25.4 35.4 26.6 33.2 26.6H30.5V34H28V20ZM30.5 24.6H33C34.2 24.6 35 24.1 35 23.3C35 22.5 34.2 22 33 22H30.5V24.6Z"
            fill="#FFFFFF"
          />
          {/* Text Labels */}
          <text fill="#94A3B8" fontFamily="system-ui, -apple-system, sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.08em" x="58" y="21">
            FEATURED ON
          </text>
          <text fill="#F8FAFC" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="800" x="58" y="38">
            Product Hunt
          </text>
          {/* Upvote Pill */}
          <rect x="186" y="13" width="52" height="28" rx="8" fill="#2A1715" stroke="#7F231C" strokeWidth="1" />
          <path d="M198 28L203 21L208 28H198Z" fill="#FF6154" />
          <text fill="#FF6154" fontFamily="system-ui, -apple-system, sans-serif" fontSize="12" fontWeight="700" x="212" y="28">
            ▲
          </text>
        </svg>
      </a>
    </div>
  );
};

export const ProductHuntLaunchCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-[540px] mx-auto p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:shadow-md ${className}`}>
      <div className="flex items-center gap-3.5 mb-3.5">
        <img
          alt="ToolMaster"
          src="https://ph-files.imgix.net/213df699-417f-4543-ad80-3796577fc83a.png?auto=compress,format&codec=mozjpeg&cs=strip&fit=crop&h=80&w=80"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 shadow-xs border border-slate-100 dark:border-slate-800"
          loading="lazy"
        />
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              ToolMaster
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0">
              Launch
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
            34+ PDF tools that never leave your browser
          </p>
        </div>
      </div>
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Featured on Product Hunt
        </span>
        <a
          href="https://www.producthunt.com/products/toolmaster-3?embed=true&utm_source=embed&utm_medium=post_embed"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6154] hover:bg-[#eb5246] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
        >
          <span>Check it out on Product Hunt</span>
          <span className="text-sm font-bold">→</span>
        </a>
      </div>
    </div>
  );
};
