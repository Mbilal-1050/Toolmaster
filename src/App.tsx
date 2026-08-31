import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { PageView } from './types';
import { TOOLS_DATA } from './data/toolsData';
import { BLOG_POSTS } from './data/blogData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { PwaInstallBanner } from './components/PwaInstallBanner';
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

  // Parse current route from window location pathname (or legacy hash)
  const parseCurrentRoute = (): PageView => {
    let pathname = window.location.pathname.replace(/^\/+/, '').trim();
    const hash = window.location.hash.replace(/^#\/?/, '').trim();

    // If there is a legacy hash and no pathname, normalize to clean path
    if (!pathname && hash) {
      pathname = hash;
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState(null, '', `/${hash}`);
      }
    }

    if (!pathname || pathname === '') return { type: 'home' };
    if (pathname === 'about') return { type: 'about' };
    if (pathname === 'privacy-policy' || pathname === 'privacy') return { type: 'privacy' };
    if (pathname === 'terms-of-service' || pathname === 'terms') return { type: 'terms' };
    if (pathname === 'cookie-policy' || pathname === 'cookies') return { type: 'cookies' };
    if (pathname === 'contact') return { type: 'contact' };
    if (pathname === 'blog') return { type: 'blog' };

    if (pathname.startsWith('blog/')) {
      const blogSlug = pathname.replace('blog/', '');
      const post = BLOG_POSTS.find((p) => p.slug === blogSlug);
      if (post) return { type: 'blog-post', slug: blogSlug };
    }

    const tool = TOOLS_DATA.find((t) => t.slug === pathname);
    if (tool) return { type: 'tool', slug: tool.slug };

    return { type: '404' };
  };

  // Sync document title and canonical meta tag on route change
  const updatePageSeo = (page: PageView) => {
    let title = 'ToolMaster - 100% Free & In-Browser PDF Suite (33+ Tools)';
    let canonicalPath = '/';

    switch (page.type) {
      case 'home':
        title = 'ToolMaster - 100% Free & In-Browser PDF Suite (33+ Tools)';
        canonicalPath = '/';
        break;
      case 'tool': {
        const tool = TOOLS_DATA.find((t) => t.slug === page.slug);
        if (tool) {
          title = `${tool.name} Online Free - 100% In-Browser & Private | ToolMaster`;
          canonicalPath = `/${tool.slug}`;
        }
        break;
      }
      case 'blog':
        title = 'PDF Guides, Optimization Tips & Tutorials | ToolMaster';
        canonicalPath = '/blog';
        break;
      case 'blog-post': {
        const post = BLOG_POSTS.find((p) => p.slug === page.slug);
        if (post) {
          title = `${post.title} | ToolMaster`;
          canonicalPath = `/blog/${post.slug}`;
        }
        break;
      }
      case 'about':
        title = 'About ToolMaster - In-Browser PDF Suite';
        canonicalPath = '/about';
        break;
      case 'privacy':
        title = 'Privacy Policy - Zero Document Upload Guarantee | ToolMaster';
        canonicalPath = '/privacy-policy';
        break;
      case 'terms':
        title = 'Terms of Service | ToolMaster';
        canonicalPath = '/terms-of-service';
        break;
      case 'cookies':
        title = 'Cookie Policy & Consent | ToolMaster';
        canonicalPath = '/cookie-policy';
        break;
      case 'contact':
        title = 'Contact Us & Technical Support | ToolMaster';
        canonicalPath = '/contact';
        break;
      default:
        title = 'Page Not Found | ToolMaster';
        canonicalPath = '/404';
    }

    document.title = title;

    // Update or insert canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const fullCanonicalUrl = `https://www.freetoolmaster.online${canonicalPath === '/' ? '' : canonicalPath}`;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);
  };

  useEffect(() => {
    const initialRoute = parseCurrentRoute();
    setCurrentPage(initialRoute);
    updatePageSeo(initialRoute);

    const handleRouteChange = () => {
      const route = parseCurrentRoute();
      setCurrentPage(route);
      updatePageSeo(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const navigateTo = (page: PageView, cleanPath: string) => {
    setCurrentPage(page);
    updatePageSeo(page);
    const targetUrl = cleanPath ? `/${cleanPath.replace(/^\/+/, '')}` : '/';
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
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

      {/* Slim Dismissible PWA Install Banner */}
      <PwaInstallBanner />

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

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
