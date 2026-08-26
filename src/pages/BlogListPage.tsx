import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, Sparkles, Clock, User, Tag } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { BlogPost } from '../types';
import { AdSlot } from '../components/AdSlot';

interface BlogListPageProps {
  onNavigateBlogPost: (slug: string) => void;
  onNavigateTool: (slug: string) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ onNavigateBlogPost, onNavigateTool }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Optimization', 'Document Management', 'Formats & Standards', 'Security & Legal', 'Image Conversion', 'Architecture & Privacy'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.targetKeyword.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-full mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>PDF Master Guides & Tutorials</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Learn How to Master PDF Documents
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Comprehensive tutorials, privacy insights, compression tricks, and conversion best practices.
          </p>
        </div>

        {/* AdSlot */}
        <AdSlot id="ad-slot-blog-top" slotType="header" />

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides & keywords..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              id={`blog-post-${post.slug}`}
              onClick={() => onNavigateBlogPost(post.slug)}
              className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-900 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-rose-600 dark:text-rose-400 mb-3">
                  <span className="uppercase tracking-wider px-2 py-0.5 bg-rose-50 dark:bg-rose-950 rounded-md">
                    {post.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 font-normal">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-rose-600 transition-colors">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5" /> {post.author}
                </span>
                <span className="flex items-center gap-1">
                  Read Article <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
