import React from 'react';
import { FileQuestion, ArrowRight, Home } from 'lucide-react';
import { TOOLS_DATA } from '../data/toolsData';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateTool: (slug: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome, onNavigateTool }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6">
          <FileQuestion className="w-10 h-10" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The PDF tool or page you requested could not be located. Browse our most popular free tools below:
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {TOOLS_DATA.filter((t) => t.badge === 'Popular').slice(0, 6).map((tool) => (
            <button
              key={tool.id}
              onClick={() => onNavigateTool(tool.slug)}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-rose-500 hover:text-rose-600 transition flex items-center justify-between text-left"
            >
              <span>{tool.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        <button
          onClick={onNavigateHome}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </button>
      </div>
    </div>
  );
};
