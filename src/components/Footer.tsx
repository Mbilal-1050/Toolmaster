import React from 'react';
import { FileText, Shield, Heart, Lock, Globe, ExternalLink } from 'lucide-react';
import { CATEGORIES_CONFIG, TOOLS_DATA } from '../data/toolsData';

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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div
              onClick={onNavigateHome}
              className="flex items-center gap-2 cursor-pointer inline-flex"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                PDF<span className="text-rose-500">Master</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Free, privacy-first 100% in-browser PDF suite with 33+ tools. All processing executes securely within your local device browser sandbox without uploading data to external servers.
            </p>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex items-center gap-1 text-[11px] bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Client-Side Safe</span>
              </div>
            </div>
          </div>

          {/* Categorized Tools Columns */}
          {CATEGORIES_CONFIG.map((cat) => {
            const tools = TOOLS_DATA.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {cat.label}
                </h4>
                <ul className="space-y-1.5">
                  {tools.slice(0, 7).map((tool) => (
                    <li key={tool.id}>
                      <button
                        onClick={() => onNavigateTool(tool.slug)}
                        className="hover:text-white transition text-left"
                      >
                        {tool.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Company, Blog & Legal Columns */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-5 font-medium">
            <button onClick={onNavigateHome} className="hover:text-white transition">
              Home
            </button>
            <button onClick={onNavigateBlog} className="hover:text-white transition">
              Blog & Guides
            </button>
            <button onClick={onNavigateAbout} className="hover:text-white transition">
              About Us
            </button>
            <button onClick={onNavigateContact} className="hover:text-white transition">
              Contact & Support
            </button>
            <button onClick={onNavigatePrivacy} className="hover:text-white transition">
              Privacy Policy
            </button>
            <button onClick={onNavigateTerms} className="hover:text-white transition">
              Terms of Service
            </button>
            <button onClick={onNavigateCookies} className="hover:text-white transition">
              Cookie Policy
            </button>
          </div>

          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} PDFMaster. All rights reserved. 100% Free & Open-Source.
          </div>
        </div>

        {/* AdSense & Legal Disclosure */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 text-[11px] text-slate-500 leading-relaxed max-w-4xl">
          <p>
            <strong>Privacy & AdSense Notice:</strong> PDFMaster uses Google AdSense and standard analytics to support free development. We do not store or transmit your documents. All file transformations execute locally in browser memory via HTML5 File and Canvas APIs.
          </p>
        </div>
      </div>
    </footer>
  );
};
