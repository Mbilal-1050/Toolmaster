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
import { BackgroundRemoverPage } from './pages/BackgroundRemoverPage';
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

    // Support background remover route aliases (essential for Search Console & SEO)
    if (
      pathname === 'remove-background' ||
      pathname === 'remove-bg' ||
      pathname === 'background-remover' ||
      pathname === 'tools/remove-background' ||
      pathname === 'tools/remove-bg' ||
      pathname === 'tools/background-remover'
    ) {
      return { type: 'tool', slug: 'background-remover' };
    }

    if (pathname.startsWith('blog/')) {
      const blogSlug = pathname.replace('blog/', '');
      const post = BLOG_POSTS.find((p) => p.slug === blogSlug);
      if (post) return { type: 'blog-post', slug: blogSlug };
    }

    if (pathname.startsWith('tools/')) {
      const toolSlug = pathname.replace('tools/', '');
      const tool = TOOLS_DATA.find((t) => t.slug === toolSlug);
      if (tool) return { type: 'tool', slug: tool.slug };
    }

    const tool = TOOLS_DATA.find((t) => t.slug === pathname);
    if (tool) return { type: 'tool', slug: tool.slug };

    return { type: '404' };
  };

  // Sync document title, description, and canonical meta tag on route change
  const updatePageSeo = (page: PageView) => {
    let title = 'ToolMaster - 100% Free & In-Browser PDF Suite (34+ Tools)';
    let metaDescription =
      'Free, privacy-first utility suite with 34+ tools running 100% in your browser. Remove image backgrounds with client-side AI, merge, split, compress, convert, edit, and secure documents with zero server uploads.';
    let canonicalPath = '/';

    const currentPath = typeof window !== 'undefined' ? window.location.pathname.replace(/^\/+/, '').trim() : '';

    switch (page.type) {
      case 'home':
        title = 'ToolMaster - 100% Free & In-Browser PDF Suite (34+ Tools)';
        canonicalPath = '/';
        break;
      case 'tool': {
        const tool = TOOLS_DATA.find((t) => t.slug === page.slug);
        if (tool) {
          if (tool.slug === 'background-remover') {
            title = 'Free Background Remover Online - Remove Image Background Instantly | ToolMaster';
            metaDescription =
              'Automatically erase image backgrounds with AI precision directly in your browser. 100% free, zero server uploads, interactive preview, and instant transparent PNG download.';
            
            // Align canonical path with whichever URL was visited to ensure Google Search Console live test matches perfectly
            if (currentPath === 'remove-background' || currentPath === 'tools/remove-background') {
              canonicalPath = '/remove-background';
            } else if (currentPath === 'tools/background-remover') {
              canonicalPath = '/tools/background-remover';
            } else {
              canonicalPath = '/background-remover';
            }
          } else {
            title = `${tool.name} Online Free - 100% In-Browser & Private | ToolMaster`;
            metaDescription = tool.shortDesc || `${tool.name} online free and 100% private in your browser.`;
            canonicalPath = `/${tool.slug}`;
          }
        }
        break;
      }
      case 'blog':
        title = 'PDF Guides, Optimization Tips & Tutorials | ToolMaster';
        metaDescription = 'Practical guides, file optimization advice, security tips, and format conversions for PDF documents.';
        canonicalPath = '/blog';
        break;
      case 'blog-post': {
        const post = BLOG_POSTS.find((p) => p.slug === page.slug);
        if (post) {
          title = `${post.title} | ToolMaster`;
          metaDescription = post.excerpt;
          canonicalPath = `/blog/${post.slug}`;
        }
        break;
      }
      case 'about':
        title = 'About ToolMaster - In-Browser PDF Suite';
        metaDescription = 'Learn more about ToolMaster, our zero-upload privacy architecture, and our mission to provide free client-side document tools.';
        canonicalPath = '/about';
        break;
      case 'privacy':
        title = 'Privacy Policy - Zero Document Upload Guarantee | ToolMaster';
        metaDescription = 'Our strict privacy policy explains how all document processing happens locally on your computer with zero server storage.';
        canonicalPath = '/privacy-policy';
        break;
      case 'terms':
        title = 'Terms of Service | ToolMaster';
        metaDescription = 'Review the terms of service and acceptable usage policies for ToolMaster.';
        canonicalPath = '/terms-of-service';
        break;
      case 'cookies':
        title = 'Cookie Policy & Consent | ToolMaster';
        metaDescription = 'Read about how ToolMaster uses cookies and local storage to enhance user experience.';
        canonicalPath = '/cookie-policy';
        break;
      case 'contact':
        title = 'Contact Us & Technical Support | ToolMaster';
        metaDescription = 'Get in touch with the ToolMaster engineering team for feedback, bug reports, or feature requests.';
        canonicalPath = '/contact';
        break;
      default:
        title = 'Page Not Found | ToolMaster';
        metaDescription = 'The requested page could not be found on ToolMaster.';
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

    // Update meta description
    let metaDescTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDescTag) {
      metaDescTag.setAttribute('content', metaDescription);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', metaDescription);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullCanonicalUrl);

    // Structured data (Schema.org WebApplication, BlogPosting, WebSite)
    let schemaScript = document.getElementById('schema-structured-data') as HTMLScriptElement | null;
    if (page.type === 'tool') {
      const tool = TOOLS_DATA.find((t) => t.slug === page.slug);
      if (tool) {
        const schemaData = {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: tool.name,
          url: fullCanonicalUrl,
          description: metaDescription,
          applicationCategory: tool.slug === 'background-remover' ? 'PhotoEditor' : 'BusinessApplication',
          operatingSystem: 'All',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        };
        if (!schemaScript) {
          schemaScript = document.createElement('script');
          schemaScript.id = 'schema-structured-data';
          schemaScript.type = 'application/ld+json';
          document.head.appendChild(schemaScript);
        }
        schemaScript.textContent = JSON.stringify(schemaData);
      }
    } else if (page.type === 'blog-post') {
      const post = BLOG_POSTS.find((p) => p.slug === page.slug);
      if (post) {
        const schemaData = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          url: fullCanonicalUrl,
          datePublished: '2026-02-01',
          author: {
            '@type': 'Person',
            name: post.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'ToolMaster',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.freetoolmaster.online/favicon.svg',
            },
          },
        };
        if (!schemaScript) {
          schemaScript = document.createElement('script');
          schemaScript.id = 'schema-structured-data';
          schemaScript.type = 'application/ld+json';
          document.head.appendChild(schemaScript);
        }
        schemaScript.textContent = JSON.stringify(schemaData);
      }
    } else if (page.type === 'home') {
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ToolMaster',
        url: 'https://www.freetoolmaster.online',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.freetoolmaster.online/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      };
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-structured-data';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemaData);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    // Send pageview to Google Analytics (gtag.js) if loaded
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: Function }).gtag === 'function') {
      (window as unknown as { gtag: Function }).gtag('event', 'page_view', {
        page_title: title,
        page_location: fullCanonicalUrl,
        page_path: canonicalPath,
      });
    }
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
  const handleNavigateTool = (slug: string) => {
    const routePath = slug === 'background-remover' ? `tools/${slug}` : slug;
    navigateTo({ type: 'tool', slug }, routePath);
  };
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
        if (tool.slug === 'background-remover') {
          return (
            <BackgroundRemoverPage
              tool={tool}
              onNavigateTool={handleNavigateTool}
              onNavigateHome={handleNavigateHome}
            />
          );
        }
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
