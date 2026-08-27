import React from 'react';
import { FileText, Shield, Heart, Lock, Globe, ExternalLink } from 'lucide-react';
import { CATEGORIES_CONFIG, TOOLS_DATA } from '../data/toolsData';
import { ProductHuntBadge } from './ProductHuntBadge';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateTool: (slug: string) => void;
  onNavigateAbout: () => void;
  onNavigatePrivacy: () => void;
  onNavigateTerms: () => void;
  onNavigateCookies: () => void;
  onNavigateContact: () => void;
  onNavigateBlog: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateTool,
  onNavigateAbout,
  onNavigatePrivacy,
  onNavigateTerms,
  onNavigateCookies,
  onNavigateContact,
  onNavigateBlog,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      {/* Main Links Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-14 mb-12">
          {/* Brand Col */}
          <div className="lg:max-w-xs xl:max-w-sm space-y-4 shrink-0">
            <div
              onClick={onNavigateHome}
              className="flex items-center gap-2 cursor-pointer inline-flex"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Tool<span className="text-rose-500">Master</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Free, privacy-first 100% in-browser PDF suite with 33+ tools. All processing executes securely within your local device browser sandbox without uploading data to external servers.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 text-slate-300">
              <div className="flex items-center gap-1.5 text-[11px] bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Client-Side Safe</span>
              </div>
            </div>

            {/* Product Hunt Badge */}
            <div className="pt-2">
              <ProductHuntBadge theme="dark" />
            </div>
          </div>

          {/* Categorized Tools Columns - Balanced 4-Column Subgrid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {CATEGORIES_CONFIG.map((cat) => {
              const tools = TOOLS_DATA.filter((t) => t.category === cat.id);
              return (
                <div key={cat.id} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {cat.label}
                  </h4>
                  <ul className="space-y-1.5">
                    {tools.slice(0, 8).map((tool) => (
                      <li key={tool.id}>
                        <a
                          href={`/${tool.slug}`}
                          onClick={(e) => {
                            if (!e.ctrlKey && !e.metaKey) {
                              e.preventDefault();
                              onNavigateTool(tool.slug);
                            }
                          }}
                          className="hover:text-white transition text-left block text-slate-400 hover:text-rose-400"
                        >
                          {tool.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company, Blog & Legal Columns */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-5 font-medium">
            <a
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  onNavigateHome();
                }
              }}
              className="hover:text-white transition"
            >
              Home
            </a>
            <a
              href="/blog"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  onNavigateBlog();
                }
              }}
              className="hover:text-white transition"
            >
              Blog & Guides
            </a>
            <a
              href="/about"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  onNavigateAbout();
                }
              }}
              className="hover:text-white transition"
            >
              About Us
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  onNavigateContact();
                }
              }}
              className="hover:text-white transition"
            >
              Contact & Support
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  onNavigatePrivacy();
                }
              }}
              className="hover:text-white transition"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  onNavigateTerms();
                }
              }}
              className="hover:text-white transition"
            >
              Terms of Service
            </a>
            <a
              href="/cookie-policy"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  onNavigateCookies();
                }
              }}
              className="hover:text-white transition"
            >
              Cookie Policy
            </a>
          </div>

          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} ToolMaster. All rights reserved. 100% Free & Open-Source.
          </div>
        </div>

        {/* AdSense & Legal Disclosure */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 text-[11px] text-slate-500 leading-relaxed max-w-4xl">
          <p>
            <strong>Privacy & AdSense Notice:</strong> ToolMaster uses Google AdSense and standard analytics to support free development. We do not store or transmit your documents. All file transformations execute locally in browser memory via HTML5 File and Canvas APIs.
          </p>
        </div>
      </div>
    </footer>
  );
};
