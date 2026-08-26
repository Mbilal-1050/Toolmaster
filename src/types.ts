export type ToolCategory = 'organize' | 'convert' | 'edit' | 'security';

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  category: ToolCategory;
  iconName: string;
  badge?: string;
  accentColor?: string;
  acceptedFiles: string; // e.g. ".pdf", ".jpg,.png", ".docx"
  allowMultiple?: boolean;
  keywords: string[];
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  relatedToolSlugs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown / HTML-like paragraphs
  date: string;
  readTime: string;
  author: string;
  category: string;
  targetKeyword: string;
  relatedToolSlugs: string[];
}

export interface ProcessedFileResult {
  blob: Blob;
  fileName: string;
  originalSize?: number;
  newSize?: number;
  type: string;
  previewUrl?: string;
}

export type PageView = 
  | { type: 'home' }
  | { type: 'tool'; slug: string }
  | { type: 'about' }
  | { type: 'privacy' }
  | { type: 'terms' }
  | { type: 'cookies' }
  | { type: 'contact' }
  | { type: 'blog' }
  | { type: 'blog-post'; slug: string }
  | { type: '404' };
