import React from 'react';

interface ProductHuntBadgeProps {
  theme?: 'light' | 'dark' | 'neutral' | 'auto';
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
        className="inline-block shadow-xs hover:shadow-md rounded-xl overflow-hidden transition-shadow"
        title="ToolMaster on Product Hunt"
      >
        {theme === 'auto' ? (
          <>
            {/* Light Mode Badge */}
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1234219&theme=light"
              alt="ToolMaster - 34+ PDF tools that never leave your browser | Product Hunt"
              width={250}
              height={54}
              className="w-[220px] sm:w-[250px] h-auto dark:hidden"
              loading="lazy"
            />
            {/* Dark Mode Badge */}
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1234219&theme=dark"
              alt="ToolMaster - 34+ PDF tools that never leave your browser | Product Hunt"
              width={250}
              height={54}
              className="w-[220px] sm:w-[250px] h-auto hidden dark:block"
              loading="lazy"
            />
          </>
        ) : (
          <img
            src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1234219&theme=${theme}`}
            alt="ToolMaster - 34+ PDF tools that never leave your browser | Product Hunt"
            width={250}
            height={54}
            className="w-[220px] sm:w-[250px] h-auto"
            loading="lazy"
          />
        )}
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
