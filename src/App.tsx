import React, { useState, useEffect } from 'react';
import { PageView } from './types';
import { TOOLS_DATA } from './data/toolsData';
import { BLOG_POSTS } from './data/blogData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { HomePage } from './pages/HomePage';
import { ToolRunnerPage } from './pages/ToolRunnerPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { ContactPage } from './pages/ContactPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>({ type: 'home' });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('toolmaster_theme') === 'dark' ||
        localStorage.getItem('pdfmaster_theme') === 'dark' ||
        (!('toolmaster_theme' in localStorage) &&
          !('pdfmaster_theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // Dark mode class sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('toolmaster_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('toolmaster_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Parse current route from window location hash or pathname
  const parseCurrentRoute = (): PageView => {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    const pathname = window.location.pathname.replace(/^\//, '').trim();
    const route = hash || pathname;

    if (!route || route === '') return { type: 'home' };
    if (route === 'about') return { type: 'about' };
    if (route === 'privacy-policy' || route === 'privacy') return { type: 'privacy' };
    if (route === 'terms-of-service' || route === 'terms') return { type: 'terms' };
    if (route === 'cookie-policy' || route === 'cookies') return { type: 'cookies' };
    if (route === 'contact') return { type: 'contact' };
    if (route === 'blog') return { type: 'blog' };

    if (route.startsWith('blog/')) {
      const blogSlug = route.replace('blog/', '');
      const post = BLOG_POSTS.find((p) => p.slug === blogSlug);
      if (post) return { type: 'blog-post', slug: blogSlug };
    }

    const tool = TOOLS_DATA.find((t) => t.slug === route);
    if (tool) return { type: 'tool', slug: tool.slug };

    return { type: '404' };
  };

  useEffect(() => {
    setCurrentPage(parseCurrentRoute());

    const handleRouteChange = () => {
      setCurrentPage(parseCurrentRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const navigateTo = (page: PageView, hashRoute: string) => {
    setCurrentPage(page);
    window.location.hash = hashRoute;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => navigateTo({ type: 'home' }, '');
  const handleNavigateTool = (slug: string) => navigateTo({ type: 'tool', slug }, slug);
  const handleNavigateAbout = () => navigateTo({ type: 'about' }, 'about');
  const handleNavigatePrivacy = () => navigateTo({ type: 'privacy' }, 'privacy-policy');
  const handleNavigateTerms = () => navigateTo({ type: 'terms' }, 'terms-of-service');
  const handleNavigateCookies = () => navigateTo({ type: 'cookies' }, 'cookie-policy');
  const handleNavigateContact = () => navigateTo({ type: 'contact' }, 'contact');
  const handleNavigateBlog = () => navigateTo({ type: 'blog' }, 'blog');
  const handleNavigateBlogPost = (slug: string) =>
    navigateTo({ type: 'blog-post', slug }, `blog/${slug}`);

  // Dynamic Page Renderer
  const renderPage = () => {
    switch (currentPage.type) {
      case 'home':
        return (
          <HomePage
            onNavigateTool={handleNavigateTool}
            onNavigateBlog={handleNavigateBlog}
            onNavigateBlogPost={handleNavigateBlogPost}
          />
        );

      case 'tool': {
        const tool = TOOLS_DATA.find((t) => t.slug === currentPage.slug);
        if (!tool) return <NotFoundPage onNavigateHome={handleNavigateHome} onNavigateTool={handleNavigateTool} />;
        return (
          <ToolRunnerPage
            tool={tool}
            onNavigateTool={handleNavigateTool}
            onNavigateHome={handleNavigateHome}
          />
        );
      }

      case 'about':
        return <AboutPage onNavigateHome={handleNavigateHome} />;

      case 'privacy':
        return <PrivacyPolicyPage />;

      case 'terms':
        return <TermsPage />;

      case 'cookies':
        return <CookiePolicyPage />;

      case 'contact':
        return <ContactPage />;

      case 'blog':
        return (
          <BlogListPage
            onNavigateBlogPost={handleNavigateBlogPost}
            onNavigateTool={handleNavigateTool}
          />
        );

      case 'blog-post': {
        const post = BLOG_POSTS.find((p) => p.slug === currentPage.slug);
        if (!post) return <NotFoundPage onNavigateHome={handleNavigateHome} onNavigateTool={handleNavigateTool} />;
        return (
          <BlogPostPage
            post={post}
            onNavigateBlog={handleNavigateBlog}
            onNavigateTool={handleNavigateTool}
          />
        );
      }

      default:
        return <NotFoundPage onNavigateHome={handleNavigateHome} onNavigateTool={handleNavigateTool} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        onNavigateHome={handleNavigateHome}
        onNavigateTool={handleNavigateTool}
        onNavigateAbout={handleNavigateAbout}
        onNavigatePrivacy={handleNavigatePrivacy}
        onNavigateContact={handleNavigateContact}
        onNavigateBlog={handleNavigateBlog}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex-1">{renderPage()}</div>

      {/* Global Footer */}
      <Footer
        onNavigateHome={handleNavigateHome}
        onNavigateTool={handleNavigateTool}
        onNavigateAbout={handleNavigateAbout}
        onNavigatePrivacy={handleNavigatePrivacy}
        onNavigateTerms={handleNavigateTerms}
        onNavigateCookies={handleNavigateCookies}
        onNavigateContact={handleNavigateContact}
        onNavigateBlog={handleNavigateBlog}
      />

      {/* GDPR / AdSense Cookie Banner */}
      <CookieBanner onNavigatePolicy={handleNavigateCookies} />
    </div>
  );
}
