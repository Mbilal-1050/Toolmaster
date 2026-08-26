import React from 'react';
import { ToolItem, BlogPost } from '../types';

interface SeoStructuredDataProps {
  type: 'organization' | 'tool' | 'blog' | 'article';
  tool?: ToolItem;
  blogPost?: BlogPost;
}

export const SeoStructuredData: React.FC<SeoStructuredDataProps> = ({ type, tool, blogPost }) => {
  const getStructuredData = () => {
    if (type === 'organization') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PDFMaster',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://pdfmaster.app',
        logo: 'https://pdfmaster.app/logo.png',
        description: 'Free, privacy-first 100% in-browser PDF tools suite with zero server uploads.',
        sameAs: [
          'https://twitter.com',
          'https://github.com'
        ]
      };
    }

    if (type === 'tool' && tool) {
      const schemas: any[] = [
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `${tool.name} Online Free`,
          operatingSystem: 'Web, Windows, macOS, Linux, iOS, Android',
          applicationCategory: 'UtilityApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          description: tool.fullDesc,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: typeof window !== 'undefined' ? window.location.origin : 'https://pdfmaster.app',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: tool.category.toUpperCase(),
              item: `${typeof window !== 'undefined' ? window.location.origin : 'https://pdfmaster.app'}/#category-${tool.category}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: tool.name,
              item: `${typeof window !== 'undefined' ? window.location.origin : 'https://pdfmaster.app'}/${tool.slug}`,
            },
          ],
        },
      ];

      if (tool.faqs && tool.faqs.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tool.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        });
      }

      return schemas;
    }

    if (type === 'article' && blogPost) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blogPost.title,
        description: blogPost.excerpt,
        author: {
          '@type': 'Person',
          name: blogPost.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'PDFMaster',
        },
        datePublished: blogPost.date,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${typeof window !== 'undefined' ? window.location.origin : 'https://pdfmaster.app'}/blog/${blogPost.slug}`,
        },
      };
    }

    return null;
  };

  const data = getStructuredData();
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
