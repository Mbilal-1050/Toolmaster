import React, { useState, useMemo } from 'react';
import {
  Combine,
  Split,
  ArrowUpDown,
  Trash2,
  RotateCw,
  Crop,
  ImageDown,
  ImagePlus,
  FileImage,
  Image,
  FilePlus2,
  FileText,
  FileEdit,
  Sheet,
  Table,
  Presentation,
  Sliders,
  Code,
  Globe,
  FileCode,
  AlignLeft,
  FileSpreadsheet,
  Archive,
  Contrast,
  Stamp,
  Hash,
  CheckCircle2,
  Info,
  PenTool,
  Layers,
  Wrench,
  Lock,
  Unlock,
  Minimize2,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { TOOLS_DATA, CATEGORIES_CONFIG } from '../data/toolsData';
import { ToolCategory, ToolItem } from '../types';

// Dynamic icon resolver
export const resolveToolIcon = (iconName: string) => {
  const map: Record<string, React.ElementType> = {
    Combine,
    Split,
    ArrowUpDown,
    Trash2,
    RotateCw,
    Crop,
    ImageDown,
    ImagePlus,
    FileImage,
    Image,
    FilePlus2,
    FileText,
    FileEdit,
    Sheet,
    Table,
    Presentation,
    Sliders,
    Code,
    Globe,
    FileCode,
    AlignLeft,
    FileSpreadsheet,
    Archive,
    Contrast,
    Stamp,
    Hash,
    CheckCircle2,
    Info,
    PenTool,
    Layers,
    Wrench,
    Lock,
    Unlock,
    Minimize2,
  };
  return map[iconName] || FileText;
};

interface ToolGridProps {
  onSelectTool: (slug: string) => void;
  selectedCategory?: ToolCategory | 'all';
}

export const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool, selectedCategory: initialCategory = 'all' }) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesSearch =
        tool.name.toLowerCase().includes(q) ||
        tool.shortDesc.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="tools-catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Tools ({TOOLS_DATA.length})
          </button>

          {CATEGORIES_CONFIG.map((cat) => {
            const count = TOOLS_DATA.filter((t) => t.category === cat.id).length;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[260px] sm:min-w-[320px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. merge, compress, sign)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No tools found matching "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool) => {
            const Icon = resolveToolIcon(tool.iconName);
            return (
              <div
                key={tool.id}
                id={`tool-card-${tool.slug}`}
                onClick={() => onSelectTool(tool.slug)}
                className="group relative bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-800 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>

                    {tool.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {tool.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
