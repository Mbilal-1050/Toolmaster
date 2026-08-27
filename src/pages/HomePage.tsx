import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  FileText,
  Shield,
  Zap,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';
import { ToolGrid } from '../components/ToolGrid';
import { TrustBadges } from '../components/TrustBadges';
import { HowItWorks } from '../components/HowItWorks';
import { AdSlot } from '../components/AdSlot';
import { SeoStructuredData } from '../components/SeoStructuredData';
import { ProductHuntBadge, ProductHuntLaunchCard } from '../components/ProductHuntBadge';
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
  const prefersReduced = useReducedMotion();

  const headlineWords = ['Every', 'PDF', 'Tool', 'You', 'Need,'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-rose-500 selection:text-white">
      <SeoStructuredData type="organization" />

      {/* Hero Section with Aurora Gradient and Floating Elements */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-16 sm:pt-20 pb-16 border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Aurora Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[550px] bg-gradient-to-tr from-rose-500/15 via-pink-500/10 to-amber-500/15 blur-3xl opacity-70 dark:opacity-40 animate-aurora rounded-full" />
          <div className="absolute -bottom-20 right-10 w-96 h-96 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />
        </div>

        {/* Decorative Floating Badges (Desktop) */}
        {!prefersReduced && (
          <>
            <div className="hidden xl:flex items-center gap-2 absolute top-24 left-16 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-lg text-xs font-bold text-slate-700 dark:text-slate-300 animate-float-slow backdrop-blur-md pointer-events-none">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>100% In-Browser</span>
            </div>
            <div className="hidden xl:flex items-center gap-2 absolute top-36 right-16 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-lg text-xs font-bold text-slate-700 dark:text-slate-300 animate-float-alt backdrop-blur-md pointer-events-none">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Zero Server Latency</span>
            </div>
          </>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-200/70 dark:border-rose-900/70 text-rose-600 dark:text-rose-400 text-xs font-bold mb-6 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>33+ Powerful PDF Tools • 100% Free & Private</span>
          </motion.div>

          {/* Staggered Animated Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            <span className="inline-flex flex-wrap justify-center gap-x-2.5 sm:gap-x-3">
              {headlineWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: prefersReduced ? 0 : idx * 0.08,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </span>{' '}
            <motion.span
              initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: prefersReduced ? 0 : 0.42,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 mt-1 sm:mt-0"
            >
              100% in Your Browser
            </motion.span>
          </h1>

          {/* Subheadline Entrance */}
          <motion.p
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: prefersReduced ? 0 : 0.55,
              ease: 'easeOut',
            }}
            className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Merge, split, compress, convert, edit, and sign PDF documents with zero server uploads.
            Your files never leave your device—instant speed, full privacy, and zero file limits.
          </motion.p>

          {/* Quick Action Pill Buttons with Hover Scale */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: prefersReduced ? 0 : 0.68,
              ease: 'easeOut',
            }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
          >
            {[
              'Merge PDF',
              'Compress PDF',
              'Word to PDF',
              'PDF to JPG',
              'Sign PDF',
              'Protect PDF',
            ].map((name) => {
              const slug = name.toLowerCase().replace(/ /g, '-');
              return (
                <motion.button
                  key={name}
                  type="button"
                  whileHover={prefersReduced ? {} : { scale: 1.05, y: -2 }}
                  whileTap={prefersReduced ? {} : { scale: 0.96 }}
                  onClick={() => onNavigateTool(slug)}
                  className="px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </motion.button>
              );
            })}
          </motion.div>

          {/* Product Hunt Featured Badge */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: prefersReduced ? 0 : 0.8,
              ease: 'easeOut',
            }}
            className="mt-8 flex justify-center"
          >
            <ProductHuntBadge />
          </motion.div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <TrustBadges />

      {/* Product Hunt Launch Card Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <ProductHuntLaunchCard />
      </div>

      {/* Top AdSlot */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <AdSlot id="ad-slot-header" slotType="header" />
      </div>

      {/* Main Stacked Category Tool Catalog */}
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
                a: 'Yes, 100%. ToolMaster runs entirely on your local computer or smartphone browser via client-side JavaScript. Your files are never uploaded to any remote server or cloud database.',
              },
              {
                q: 'Is ToolMaster really 100% free with no limits?',
                a: 'Yes! There are no subscriptions, paywalls, or credit card requirements. You can process as many documents as you need without arbitrary file size restrictions.',
              },
              {
                q: 'Do I need to install any software or extensions?',
                a: 'No software installation is necessary. ToolMaster runs instantly inside Chrome, Safari, Firefox, Edge, and mobile browsers.',
              },
              {
                q: 'Can I use ToolMaster on mobile devices?',
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
