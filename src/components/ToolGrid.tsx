import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
  RefreshCw,
  Wrench,
  Lock,
  Unlock,
  Minimize2,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Eraser,
  Wand2,
  X,
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
    RefreshCw,
    Wrench,
    Lock,
    Unlock,
    Minimize2,
    ShieldCheck,
    Scissors,
    Eraser,
    Wand2,
  };
  return map[iconName] || FileText;
};

const resolveCategoryIcon = (catId: ToolCategory) => {
  switch (catId) {
    case 'organize':
      return Layers;
    case 'convert':
      return RefreshCw;
    case 'edit':
      return PenTool;
    case 'security':
      return ShieldCheck;
    default:
      return Layers;
  }
};

const getCategoryColor = (catId: ToolCategory) => {
  switch (catId) {
    case 'organize':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200/80 dark:border-rose-900/60',
        accent: 'bg-rose-500',
      };
    case 'convert':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/60',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200/80 dark:border-indigo-900/60',
        accent: 'bg-indigo-500',
      };
    case 'edit':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/60',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200/80 dark:border-amber-900/60',
        accent: 'bg-amber-500',
      };
    case 'security':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/60',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200/80 dark:border-emerald-900/60',
        accent: 'bg-emerald-500',
      };
    default:
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200/80 dark:border-rose-900/60',
        accent: 'bg-rose-500',
      };
  }
};

interface ToolGridProps {
  onSelectTool: (slug: string) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const prefersReduced = useReducedMotion();

  // Filter tools per category based on active search
  const categorizedTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CATEGORIES_CONFIG.map((category) => {
      const allCategoryTools = TOOLS_DATA.filter((tool) => tool.category === category.id);
      const matchingTools = q
        ? allCategoryTools.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.shortDesc.toLowerCase().includes(q) ||
              t.keywords.some((k) => k.toLowerCase().includes(q))
          )
        : allCategoryTools;

      return {
        ...category,
        tools: matchingTools,
        totalCount: allCategoryTools.length,
      };
    });
  }, [searchQuery]);

  const totalMatches = categorizedTools.reduce((acc, cat) => acc + cat.tools.length, 0);

  const scrollToCategory = (categoryId: string) => {
    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <section id="tools-catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Controls: Sticky Quick Nav & Search Bar */}
      <div className="sticky top-16 sm:top-18 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 mb-10 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Quick Anchor Jump Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline-block">
              Jump To:
            </span>
            {CATEGORIES_CONFIG.map((cat) => {
              const count = TOOLS_DATA.filter((t) => t.category === cat.id).length;
              const color = getCategoryColor(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToCategory(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-xl whitespace-nowrap bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5`}
                >
                  <span className={`w-2 h-2 rounded-full ${color.accent}`} />
                  <span>{cat.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Real-Time Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all 33+ tools..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 shadow-2xs text-slate-900 dark:text-white placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* No Results Fallback */}
      {totalMatches === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 my-8 shadow-xs">
          <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No tools found for "{searchQuery}"
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Try searching for common terms like "merge", "split", "word", "compress", "sign", or "jpg".
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-4 px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition"
          >
            Clear Search Filter
          </button>
        </div>
      )}

      {/* Stacked Category Blocks */}
      <div className="space-y-16">
        {categorizedTools.map((catGroup, catIdx) => {
          if (catGroup.tools.length === 0) return null;

          const CategoryIcon = resolveCategoryIcon(catGroup.id);
          const color = getCategoryColor(catGroup.id);

          return (
            <motion.section
              key={catGroup.id}
              id={`category-${catGroup.id}`}
              initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: prefersReduced ? 0 : 0.05, ease: 'easeOut' }}
              className="scroll-mt-28"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 mb-6 border-b border-slate-200/90 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shadow-xs border ${color.border}`}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {catGroup.label}
                      </h2>
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                        {catGroup.tools.length} {catGroup.tools.length === 1 ? 'tool' : 'tools'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 sm:ml-12">
                    {catGroup.description}
                  </p>
                </div>
              </div>

              {/* Grid of Tool Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {catGroup.tools.map((tool, idx) => {
                  const Icon = resolveToolIcon(tool.iconName);

                  return (
                    <motion.a
                      key={tool.id}
                      id={`tool-card-${tool.slug}`}
                      href={`/${tool.slug}`}
                      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={{ duration: 0.3, delay: prefersReduced ? 0 : Math.min(idx * 0.04, 0.3) }}
                      whileHover={prefersReduced ? {} : { y: -3 }}
                      onClick={(e) => {
                        if (!e.ctrlKey && !e.metaKey) {
                          e.preventDefault();
                          onSelectTool(tool.slug);
                        }
                      }}
                      className="group relative bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-200 cursor-pointer flex flex-col justify-between block"
                    >
                      <div>
                        {/* Card Header with Icon and Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>

                          {tool.badge && (
                            <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                              {tool.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
                          {tool.name}
                        </h3>

                        {/* Description */}
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {tool.shortDesc}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        <span>Open Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>
    </section>
  );
};
