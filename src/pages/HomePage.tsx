import React from 'react';
import {
  FileText,
  Shield,
  Zap,
  Lock,
  HardDrive,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { ToolGrid } from '../components/ToolGrid';
import { TrustBadges } from '../components/TrustBadges';
import { HowItWorks } from '../components/HowItWorks';
import { AdSlot } from '../components/AdSlot';
import { SeoStructuredData } from '../components/SeoStructuredData';
import { BLOG_POSTS } from '../data/blogData';

interface HomePageProps {
  onNavigateTool: (slug: string) => void;
  onNavigateBlog: () => void;
  onNavigateBlogPost: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateTool,
  onNavigateBlog,
  onNavigateBlogPost,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <SeoStructuredData type="organization" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-14 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>33+ Powerful PDF Tools • 100% Free & Private</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Every PDF Tool You Need, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-500">
              100% in Your Browser
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Merge, split, compress, convert, edit, and sign PDF documents with zero server uploads. 
            Your files never leave your device—fast, free, and completely secure.
          </p>

          {/* Quick Action Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {['Merge PDF', 'Compress PDF', 'Word to PDF', 'PDF to JPG', 'Sign PDF', 'Protect PDF'].map(
              (name) => {
                const slug = name.toLowerCase().replace(/ /g, '-');
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onNavigateTool(slug)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-200 hover:text-rose-600 transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                  >
                    <span>{name}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <TrustBadges />

      {/* Top AdSlot */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <AdSlot id="ad-slot-header" slotType="header" />
      </div>

      {/* Main Filterable Tool Catalog */}
      <ToolGrid onSelectTool={onNavigateTool} />

      {/* How It Works 3-Step Section */}
      <HowItWorks />

      {/* In-Content AdSlot */}
      <div className="max-w-7xl mx-auto px-4 my-8">
        <AdSlot id="ad-slot-in-content" slotType="in-content" />
      </div>

      {/* SEO Articles / Latest Blog Posts */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              PDF Guides, Tips & Tutorials
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              In-depth articles to help you master document workflows, compression, and security.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateBlog}
            className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            View All Guides <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <div
              key={post.slug}
              onClick={() => onNavigateBlogPost(post.slug)}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-rose-600 dark:text-rose-400 mb-2">
                  <span className="uppercase tracking-wider">{post.category}</span>
                  <span>•</span>
                  <span className="text-slate-400 font-normal">{post.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-rose-600 transition-colors">
                <span>Read Full Tutorial</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Homepage FAQs */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Learn more about our in-browser architecture, security, and tool capabilities.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Are my uploaded PDF files safe and confidential?',
                a: 'Yes, 100%. PDFMaster runs entirely on your local computer or smartphone browser via client-side JavaScript. Your files are never uploaded to any remote server or cloud database.',
              },
              {
                q: 'Is PDFMaster really 100% free with no limits?',
                a: 'Yes! There are no subscriptions, paywalls, or credit card requirements. You can process as many documents as you need without arbitrary file size restrictions.',
              },
              {
                q: 'Do I need to install any software or extensions?',
                a: 'No software installation is necessary. PDFMaster runs instantly inside Chrome, Safari, Firefox, Edge, and mobile browsers.',
              },
              {
                q: 'Can I use PDFMaster on mobile devices?',
                a: 'Yes, the responsive mobile-friendly interface allows you to merge, sign, convert, and compress PDFs directly on your iPhone, iPad, or Android device.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                  {item.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer AdSlot */}
      <div className="max-w-7xl mx-auto px-4 my-6">
        <AdSlot id="ad-slot-footer" slotType="footer" />
      </div>
    </div>
  );
};
