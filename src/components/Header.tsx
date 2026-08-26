import React, { useState } from 'react';
import {
  FileText,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Layers,
  RefreshCw,
  PenTool,
  ShieldCheck,
  BookOpen,
  Info,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { CATEGORIES_CONFIG, TOOLS_DATA } from '../data/toolsData';
import { ToolCategory } from '../types';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateTool: (slug: string) => void;
  onNavigateAbout: () => void;
  onNavigatePrivacy: () => void;
  onNavigateContact: () => void;
  onNavigateBlog: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onNavigateTool,
  onNavigateAbout,
  onNavigatePrivacy,
  onNavigateContact,
  onNavigateBlog,
  darkMode,
  toggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<ToolCategory | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery.trim()
    ? TOOLS_DATA.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Tool<span className="text-rose-600">Master</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-md">
                  100% In-Browser
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {CATEGORIES_CONFIG.map((cat) => {
              const toolsInCat = TOOLS_DATA.filter((t) => t.category === cat.id);
              const isOpen = activeDropdown === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(cat.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-1 transition ${
                      isOpen
                        ? 'text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/40'
                        : 'text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega-Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 px-3 py-1.5 tracking-wider">
                        {cat.label} Utilities
                      </div>
                      <div className="space-y-0.5">
                        {toolsInCat.map((tool) => (
                          <div
                            key={tool.id}
                            onClick={() => {
                              setActiveDropdown(null);
                              onNavigateTool(tool.slug);
                            }}
                            className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer flex items-center justify-between group/item transition"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover/item:text-rose-600 dark:group-hover/item:text-rose-400">
                                {tool.name}
                              </p>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                                {tool.shortDesc}
                              </p>
                            </div>
                            {tool.badge && (
                              <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase rounded-sm bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={onNavigateBlog}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Blog
            </button>
            <button
              onClick={onNavigateAbout}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              About
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-2 text-xs font-medium"
              title="Search all tools"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline font-mono text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
                ⌘K
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-800 dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home & All Tools
            </button>
            <button
              onClick={() => {
                onNavigateBlog();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              SEO & Guide Blog
            </button>
            <button
              onClick={() => {
                onNavigateAbout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About ToolMaster
            </button>
            <button
              onClick={() => {
                onNavigateContact();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact Us
            </button>
            <button
              onClick={() => {
                onNavigatePrivacy();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Privacy Policy
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Popular Tools
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TOOLS_DATA.filter((t) => t.badge === 'Popular').slice(0, 6).map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onNavigateTool(tool.slug);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-left bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
              <Search className="w-5 h-5 text-rose-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all 33+ PDF tools..."
                className="w-full text-sm bg-transparent border-none focus:outline-hidden text-slate-900 dark:text-white"
              />
              <button
                onClick={() => {
                  setSearchModalOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="py-6 text-center text-xs text-slate-600 dark:text-slate-300">
                  Type a keyword like "merge", "split", "compress", "word to pdf", "sign"...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-600 dark:text-slate-300">
                  No matching tools found.
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        onNavigateTool(tool.slug);
                        setSearchModalOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer flex items-center justify-between group transition"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600">
                          {tool.name}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {tool.shortDesc}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-sm">
                        {tool.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
