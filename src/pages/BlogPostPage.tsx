import React from 'react';
import { ArrowLeft, Clock, User, Calendar, Tag, ArrowRight, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';
import { SeoStructuredData } from '../components/SeoStructuredData';
import { AdSlot } from '../components/AdSlot';

interface BlogPostPageProps {
  post: BlogPost;
  onNavigateBlog: () => void;
  onNavigateTool: (slug: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onNavigateBlog, onNavigateTool }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10">
      <SeoStructuredData type="article" blogPost={post} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={onNavigateBlog}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Guides & Tutorials
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-rose-600 dark:text-rose-400 mb-4">
            <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/80 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-slate-400 font-normal flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {post.date}
            </span>
            <span className="text-slate-400 font-normal flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{post.author}</p>
                <p className="text-[11px] text-slate-500">Document Security & Web Standards</p>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              Keyword: <strong className="text-rose-600">{post.targetKeyword}</strong>
            </div>
          </div>
        </div>

        {/* Top AdSlot */}
        <AdSlot id="ad-slot-article-top" slotType="header" />

        {/* Article Body */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm leading-relaxed text-sm sm:text-base text-slate-700 dark:text-slate-300 space-y-6">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl font-black text-slate-900 dark:text-white pt-4 pb-1 border-b border-slate-100 dark:border-slate-800">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
              const items = paragraph.split('\n');
              return (
                <ul key={idx} className="list-disc list-inside space-y-2 pl-2">
                  {items.map((it, i) => (
                    <li key={i} className="text-sm">
                      {it.replace(/^[0-9]+\.\s+/, '').replace(/^-\s+/, '')}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}

          {/* In-Article AdSlot */}
          <AdSlot id="ad-slot-article-middle" slotType="in-content" />

          {/* Related Tools Callout Banner */}
          {post.relatedToolSlugs && post.relatedToolSlugs.length > 0 && (
            <div className="mt-10 p-6 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60">
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Try Related Free Tools In Your Browser:
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.relatedToolSlugs.map((slug) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => onNavigateTool(slug)}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 hover:bg-rose-600 hover:text-white text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 capitalize"
                  >
                    <span>{slug.replace(/-/g, ' ')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
