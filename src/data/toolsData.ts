import { ToolItem, ToolCategory } from '../types';

export const TOOLS_DATA: ToolItem[] = [
  // ==================== ORGANIZE PDF ====================
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    shortDesc: 'Combine multiple PDF files into one single document in any order.',
    fullDesc: 'Easily merge and combine multiple PDF files into a single organized document. Drag and drop to reorder pages or files, preview page sequences, and generate a unified PDF completely client-side in seconds.',
    category: 'organize',
    iconName: 'Combine',
    badge: 'Popular',
    acceptedFiles: '.pdf',
    allowMultiple: true,
    keywords: ['merge pdf online free', 'combine pdfs', 'join pdf files', 'merge documents'],
    steps: [
      { title: 'Upload PDF Files', desc: 'Select or drag-and-drop two or more PDF files from your device.' },
      { title: 'Reorder Files', desc: 'Drag the file cards to arrange them in the exact sequence you desire.' },
      { title: 'Merge and Download', desc: 'Click "Merge PDF" to combine all files instantly and download your merged document.' }
    ],
    faqs: [
      { q: 'Is there a limit on the number of PDFs I can merge?', a: 'No! Because all processing happens directly in your browser, you can merge as many PDF files as your device memory can comfortably handle.' },
      { q: 'Are my uploaded files safe and private?', a: 'Yes, 100%. Your files are processed locally inside your web browser and are never transmitted to any external server or cloud storage.' },
      { q: 'Will merging reduce the quality of my PDF?', a: 'No, all original vector graphics, text clarity, and embedded images maintain their pristine native resolution.' }
    ],
    relatedToolSlugs: ['split-pdf', 'reorder-pdf', 'compress-pdf', 'rotate-pdf']
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    shortDesc: 'Extract individual pages or custom page ranges into separate PDFs.',
    fullDesc: 'Split large PDF documents into smaller files by defining custom page ranges (e.g. 1-3, 5, 8-12) or splitting every N pages. Extract high-priority sections with full fidelity.',
    category: 'organize',
    iconName: 'Split',
    badge: 'Popular',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['split pdf pages', 'extract pdf pages', 'separate pdf', 'divide pdf'],
    steps: [
      { title: 'Select PDF', desc: 'Upload the PDF document you want to split.' },
      { title: 'Specify Page Ranges', desc: 'Enter specific page ranges like "1-3, 5, 7-9" or select "Split every page".' },
      { title: 'Extract & Download', desc: 'Download your newly extracted PDF document or ZIP package immediately.' }
    ],
    faqs: [
      { q: 'How do I specify multiple separate page ranges?', a: 'Use commas and hyphens, for example: 1-4, 7, 10-15 to extract those exact pages into your new file.' },
      { q: 'Can I split a password-protected PDF?', a: 'You must first unlock the PDF using our Unlock PDF tool before splitting.' }
    ],
    relatedToolSlugs: ['merge-pdf', 'delete-pages', 'reorder-pdf', 'extract-images']
  },
  {
    id: 'reorder-pdf',
    slug: 'reorder-pdf',
    name: 'Reorder PDF Pages',
    shortDesc: 'Rearrange and reorder pages of your PDF with live visual thumbnails.',
    fullDesc: 'Visually reorganize pages within your PDF document. View page numbers, move pages up or down, or reorder sequences to fix misaligned scans or reports.',
    category: 'organize',
    iconName: 'ArrowUpDown',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['reorder pdf pages', 'rearrange pdf', 'sort pdf pages', 'move pages in pdf'],
    steps: [
      { title: 'Upload Document', desc: 'Drop your PDF file to generate live page previews.' },
      { title: 'Reorder Pages', desc: 'Move page cards left/right or up/down to sort into the right order.' },
      { title: 'Save Document', desc: 'Click "Save Reordered PDF" to download your newly sequenced document.' }
    ],
    faqs: [
      { q: 'Can I delete pages while reordering?', a: 'Yes, you can remove individual pages directly from the thumbnail view.' },
      { q: 'Does reordering alter text or hyperlinks?', a: 'No, all page objects, annotations, and vector streams remain intact.' }
    ],
    relatedToolSlugs: ['delete-pages', 'rotate-pdf', 'merge-pdf', 'split-pdf']
  },
  {
    id: 'delete-pages',
    slug: 'delete-pages',
    name: 'Delete PDF Pages',
    shortDesc: 'Remove unwanted, blank, or duplicate pages from your PDF file.',
    fullDesc: 'Quickly clean up PDF documents by selecting and removing unnecessary pages, blank scanner sheets, or confidential sections. Instant preview and instant removal.',
    category: 'organize',
    iconName: 'Trash2',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['delete pdf pages', 'remove pages from pdf', 'clean pdf pages'],
    steps: [
      { title: 'Upload File', desc: 'Select the PDF document to inspect all pages.' },
      { title: 'Select Pages to Remove', desc: 'Click on the pages you want to delete or type page numbers to remove.' },
      { title: 'Download Clean PDF', desc: 'Generate a clean PDF with only your selected pages.' }
    ],
    faqs: [
      { q: 'Can I select multiple pages at once?', a: 'Yes! Simply click any page card to toggle its deletion state.' }
    ],
    relatedToolSlugs: ['split-pdf', 'reorder-pdf', 'rotate-pdf', 'compress-pdf']
  },
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    shortDesc: 'Rotate PDF pages permanently 90°, 180°, or 270° clockwise or counter-clockwise.',
    fullDesc: 'Fix upside down or sideways scanned documents. Rotate specific pages or the entire document simultaneously with real-time visual orientation previews.',
    category: 'organize',
    iconName: 'RotateCw',
    badge: 'Popular',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['rotate pdf pages', 'turn pdf sideways', 'fix upside down pdf', 'rotate pdf 90 degrees'],
    steps: [
      { title: 'Upload PDF', desc: 'Upload your document to view orientation thumbnails.' },
      { title: 'Rotate Pages', desc: 'Click "Rotate All" or rotate specific individual pages 90° clockwise.' },
      { title: 'Apply & Download', desc: 'Save and download the permanently rotated PDF.' }
    ],
    faqs: [
      { q: 'Is the rotation saved permanently?', a: 'Yes, the page rotation metadata is embedded directly into the downloaded PDF file so it opens correctly in every viewer.' }
    ],
    relatedToolSlugs: ['crop-pdf', 'reorder-pdf', 'merge-pdf', 'delete-pages']
  },
  {
    id: 'crop-pdf',
    slug: 'crop-pdf',
    name: 'Crop PDF',
    shortDesc: 'Trim margins, headers, or footers from PDF pages to fit any canvas.',
    fullDesc: 'Crop excess white space, unwanted margins, or cut document dimensions to standardized or custom viewport boxes across all pages.',
    category: 'organize',
    iconName: 'Crop',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['crop pdf pages', 'trim pdf margins', 'cut pdf whitespace'],
    steps: [
      { title: 'Upload Document', desc: 'Choose the PDF you wish to crop.' },
      { title: 'Set Margins', desc: 'Adjust top, bottom, left, and right margin trim values.' },
      { title: 'Crop & Save', desc: 'Download your neatly cropped PDF file.' }
    ],
    faqs: [
      { q: 'Does cropping reduce file size?', a: 'Cropping adjusts the view boundary (CropBox) and often reduces visual clutter significantly.' }
    ],
    relatedToolSlugs: ['rotate-pdf', 'compress-pdf', 'add-page-numbers']
  },
  {
    id: 'extract-images',
    slug: 'extract-images',
    name: 'Extract Images from PDF',
    shortDesc: 'Extract all high-resolution pages and embedded images as a ZIP archive.',
    fullDesc: 'Rip and extract all graphics, illustrations, and pages from your PDF document in crystal clear PNG/JPG format packaged into a convenient ZIP archive.',
    category: 'organize',
    iconName: 'ImageDown',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['extract images from pdf', 'rip pdf pictures', 'export pdf photos'],
    steps: [
      { title: 'Upload Document', desc: 'Drop your PDF file into the extraction box.' },
      { title: 'Select Format', desc: 'Choose between PNG or JPG output.' },
      { title: 'Download ZIP', desc: 'Extract all page graphics directly into a single ZIP file.' }
    ],
    faqs: [
      { q: 'What resolution are the extracted images?', a: 'Extracted graphics are rendered at high DPI (up to 2x-3x retina quality) for optimal clarity.' }
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'pdf-to-png', 'jpg-to-pdf']
  },
  {
    id: 'insert-pdf-image',
    slug: 'insert-pdf-image',
    name: 'Insert Image into PDF',
    shortDesc: 'Append or merge photos and graphics directly into an existing PDF.',
    fullDesc: 'Seamlessly insert photographs, diagrams, receipts, or stamps as new pages or overlays into your existing PDF document.',
    category: 'organize',
    iconName: 'ImagePlus',
    acceptedFiles: '.pdf,.png,.jpg,.jpeg',
    allowMultiple: true,
    keywords: ['insert image into pdf', 'add photo to pdf', 'append image to document'],
    steps: [
      { title: 'Upload PDF and Image', desc: 'Select both your base PDF document and the image files.' },
      { title: 'Configure Position', desc: 'Choose whether to append as a new page or overlay.' },
      { title: 'Generate PDF', desc: 'Download your updated combined document.' }
    ],
    faqs: [
      { q: 'What image formats are supported?', a: 'JPG, PNG, WEBP, and BMP formats are fully supported.' }
    ],
    relatedToolSlugs: ['merge-pdf', 'jpg-to-pdf', 'add-watermark']
  },

  // ==================== CONVERT PDF ====================
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    shortDesc: 'Convert each PDF page into high-quality JPG images downloaded as a ZIP.',
    fullDesc: 'Turn PDF document pages into crisp JPG image files. Perfect for presentations, social media, web publishing, or archiving without specialized PDF readers.',
    category: 'convert',
    iconName: 'FileImage',
    badge: 'Popular',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['pdf to jpg converter', 'convert pdf to jpeg online', 'pdf to picture'],
    steps: [
      { title: 'Upload PDF', desc: 'Select or drag your PDF document.' },
      { title: 'Set Quality', desc: 'Select image output quality and resolution.' },
      { title: 'Download Images', desc: 'Get all pages as individual JPGs or a single ZIP package.' }
    ],
    faqs: [
      { q: 'Can I download all pages at once?', a: 'Yes! Multi-page documents are packaged automatically in a clean .ZIP archive.' }
    ],
    relatedToolSlugs: ['pdf-to-png', 'jpg-to-pdf', 'pdf-to-text']
  },
  {
    id: 'pdf-to-png',
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    shortDesc: 'Export PDF pages to lossless PNG images with transparent/clean backgrounds.',
    fullDesc: 'Convert your PDF pages into sharp, lossless PNG images. Ideal for graphics, charts, digital art, and typography where maximum clarity is essential.',
    category: 'convert',
    iconName: 'Image',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['pdf to png high quality', 'export pdf as png', 'convert pdf to image'],
    steps: [
      { title: 'Drop PDF File', desc: 'Upload the PDF you want to convert.' },
      { title: 'Process Pages', desc: 'Our in-browser engine renders each page at high DPI.' },
      { title: 'Download PNGs', desc: 'Save high-res PNG files to your computer or phone.' }
    ],
    faqs: [
      { q: 'Why choose PNG over JPG?', a: 'PNG offers lossless compression, making text and crisp diagrams sharper than standard JPG.' }
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'jpg-to-pdf', 'extract-images']
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    shortDesc: 'Convert multiple JPG, PNG, and WEBP pictures into a unified PDF file.',
    fullDesc: 'Turn photo collections, scanned documents, receipts, and images into a single cohesive PDF document. Configure page orientations, margins, and paper sizes.',
    category: 'convert',
    iconName: 'FilePlus2',
    badge: 'Popular',
    acceptedFiles: '.jpg,.jpeg,.png,.webp,.bmp',
    allowMultiple: true,
    keywords: ['jpg to pdf converter', 'convert images to pdf', 'png to pdf free', 'photos to pdf'],
    steps: [
      { title: 'Upload Photos', desc: 'Drag and drop your photos, scans, or PNG graphics.' },
      { title: 'Configure Page Layout', desc: 'Choose orientation (Portrait/Landscape) and margins.' },
      { title: 'Generate PDF', desc: 'Click "Convert to PDF" and download instantly.' }
    ],
    faqs: [
      { q: 'Can I arrange the order of pictures?', a: 'Yes! You can reorder the image list before generating the PDF.' }
    ],
    relatedToolSlugs: ['pdf-to-jpg', 'merge-pdf', 'compress-pdf']
  },
  {
    id: 'word-to-pdf',
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    shortDesc: 'Convert DOCX documents into clean, non-editable PDF format.',
    fullDesc: 'Convert Microsoft Word (.docx) documents directly to PDF format inside your browser. Retain headings, paragraphs, bullet points, and tables effortlessly.',
    category: 'convert',
    iconName: 'FileText',
    badge: 'Popular',
    acceptedFiles: '.docx',
    allowMultiple: false,
    keywords: ['convert word to pdf free', 'docx to pdf online', 'word document to pdf'],
    steps: [
      { title: 'Upload Word File', desc: 'Select your .docx Microsoft Word file.' },
      { title: 'Instant Conversion', desc: 'The document structure and styles are parsed locally.' },
      { title: 'Download PDF', desc: 'Download your finalized, shareable PDF.' }
    ],
    faqs: [
      { q: 'Do I need Microsoft Office installed?', a: 'No! The conversion runs completely in your web browser with zero software required.' }
    ],
    relatedToolSlugs: ['pdf-to-word', 'txt-to-pdf', 'excel-to-pdf']
  },
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    shortDesc: 'Extract structured text and formatting from PDF into an editable DOCX file.',
    fullDesc: 'Convert read-only PDF documents into fully editable Microsoft Word (.docx) files. Extract text blocks, tables, lists, and headings for quick editing.',
    category: 'convert',
    iconName: 'FileEdit',
    badge: 'Popular',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['pdf to word converter', 'convert pdf to docx free', 'edit pdf in word'],
    steps: [
      { title: 'Upload PDF', desc: 'Select your PDF document.' },
      { title: 'Extract Content', desc: 'Text content and structural blocks are parsed in-browser.' },
      { title: 'Download DOCX', desc: 'Open and edit the converted file in Word, Google Docs, or LibreOffice.' }
    ],
    faqs: [
      { q: 'Can I edit the converted Word file in Google Docs?', a: 'Yes! The exported .docx file is 100% compliant with Google Docs and Microsoft Word.' }
    ],
    relatedToolSlugs: ['word-to-pdf', 'pdf-to-text', 'pdf-to-excel']
  },
  {
    id: 'excel-to-pdf',
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    shortDesc: 'Convert Excel spreadsheets (.xlsx, .xls, .csv) to printable PDF reports.',
    fullDesc: 'Turn complex spreadsheets, financial sheets, and data tables into clean, formatted, printable PDF documents with custom table styling.',
    category: 'convert',
    iconName: 'Sheet',
    acceptedFiles: '.xlsx,.xls,.csv',
    allowMultiple: false,
    keywords: ['excel to pdf converter', 'convert xlsx to pdf', 'spreadsheet to pdf'],
    steps: [
      { title: 'Select Excel File', desc: 'Upload your .xlsx, .xls, or .csv file.' },
      { title: 'Preview Tables', desc: 'View parsed worksheets and tabular data layout.' },
      { title: 'Download PDF Report', desc: 'Download your formatted PDF report.' }
    ],
    faqs: [
      { q: 'Does it support multi-sheet workbooks?', a: 'Yes, worksheets are rendered sequentially into structured PDF pages.' }
    ],
    relatedToolSlugs: ['csv-to-pdf', 'pdf-to-excel', 'word-to-pdf']
  },
  {
    id: 'pdf-to-excel',
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    shortDesc: 'Extract tables and structured data from PDF into an editable XLSX spreadsheet.',
    fullDesc: 'Extract tabular data, columns, numbers, and rows from PDF reports and export them into Microsoft Excel (.xlsx) format for rapid financial analysis.',
    category: 'convert',
    iconName: 'Table',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['pdf to excel converter', 'extract table from pdf to xlsx', 'convert pdf to spreadsheet'],
    steps: [
      { title: 'Upload PDF File', desc: 'Select the PDF containing tabular data.' },
      { title: 'Extract Rows & Columns', desc: 'Our engine identifies tabular boundaries.' },
      { title: 'Download XLSX', desc: 'Open your numbers in Microsoft Excel or Google Sheets.' }
    ],
    faqs: [
      { q: 'Can I extract multiple pages of tables?', a: 'Yes, tables across all pages are organized into the output spreadsheet.' }
    ],
    relatedToolSlugs: ['excel-to-pdf', 'pdf-to-word', 'pdf-to-text']
  },
  {
    id: 'powerpoint-to-pdf',
    slug: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    shortDesc: 'Convert presentation slides (.pptx, .ppt, images) into a seamless PDF slide deck.',
    fullDesc: 'Convert slides and presentation decks into a locked PDF format so fonts, layouts, and graphics look identical on every viewer and projector.',
    category: 'convert',
    iconName: 'Presentation',
    acceptedFiles: '.pptx,.ppt,.pdf',
    allowMultiple: false,
    keywords: ['powerpoint to pdf converter', 'convert pptx to pdf', 'slides to pdf'],
    steps: [
      { title: 'Upload Presentation', desc: 'Select your presentation file or slide exports.' },
      { title: 'Render Slides', desc: 'Each slide is converted into a high-fidelity PDF page.' },
      { title: 'Download Deck', desc: 'Save your presentation PDF ready for distribution.' }
    ],
    faqs: [
      { q: 'Will my slide aspect ratio (16:9 vs 4:3) be preserved?', a: 'Yes, the PDF page geometry automatically matches your slide aspect ratio.' }
    ],
    relatedToolSlugs: ['pdf-to-powerpoint', 'word-to-pdf', 'jpg-to-pdf']
  },
  {
    id: 'pdf-to-powerpoint',
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    shortDesc: 'Convert PDF document pages into an editable Microsoft PowerPoint (.pptx) presentation.',
    fullDesc: 'Transform PDF pages and handouts into a genuine Microsoft PowerPoint (.pptx) slide deck with widescreen 16:9 layout, high-resolution visuals, and slide notes content.',
    category: 'convert',
    iconName: 'Sliders',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['pdf to powerpoint converter', 'convert pdf to pptx', 'pdf to presentation slides', 'pdf to pptx'],
    steps: [
      { title: 'Upload PDF', desc: 'Upload your PDF document or presentation handout.' },
      { title: 'Build PPTX Slides', desc: 'Each page is rendered as a 16:9 widescreen PowerPoint slide with text content.' },
      { title: 'Download PPTX', desc: 'Download your presentation file compatible with Microsoft PowerPoint, Google Slides, and Apple Keynote.' }
    ],
    faqs: [
      { q: 'What format is generated?', a: 'A standard Microsoft PowerPoint OpenXML presentation (.pptx) with 16:9 widescreen slides.' },
      { q: 'Can I open this in Google Slides or Keynote?', a: 'Yes, the exported .pptx file is fully compatible with Microsoft PowerPoint 365, Google Slides, LibreOffice Impress, and Apple Keynote.' }
    ],
    relatedToolSlugs: ['powerpoint-to-pdf', 'pdf-to-jpg', 'pdf-to-word']
  },
  {
    id: 'html-to-pdf',
    slug: 'html-to-pdf',
    name: 'HTML to PDF',
    shortDesc: 'Render HTML code, formatted snippets, or web content into a styled PDF.',
    fullDesc: 'Convert HTML code, styled web snippets, receipts, invoices, or blog content into a beautifully rendered PDF document in real time.',
    category: 'convert',
    iconName: 'Code',
    acceptedFiles: '.html,.htm,.txt',
    allowMultiple: false,
    keywords: ['html to pdf converter', 'render html to pdf', 'convert web page to pdf'],
    steps: [
      { title: 'Paste or Upload HTML', desc: 'Paste raw HTML or upload an .html file.' },
      { title: 'Preview Render', desc: 'See real-time visual styling in the preview box.' },
      { title: 'Generate PDF', desc: 'Download your styled PDF document.' }
    ],
    faqs: [
      { q: 'Can I include CSS styling?', a: 'Yes, inline styles and `<style>` blocks are parsed and rendered accurately.' }
    ],
    relatedToolSlugs: ['pdf-to-html', 'txt-to-pdf', 'word-to-pdf']
  },
  {
    id: 'pdf-to-html',
    slug: 'pdf-to-html',
    name: 'PDF to HTML',
    shortDesc: 'Convert PDF layout and formatted content into clean HTML5 markup.',
    fullDesc: 'Extract PDF pages, headings, paragraphs, and styles into clean, semantic HTML5 markup ready to embed on websites or blogs.',
    category: 'convert',
    iconName: 'Globe',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['pdf to html converter', 'convert pdf to webpage', 'export pdf as html'],
    steps: [
      { title: 'Upload PDF', desc: 'Select the PDF file to convert.' },
      { title: 'Extract HTML', desc: 'Text content and structure are parsed into semantic HTML.' },
      { title: 'Download HTML', desc: 'Save the .html file or copy the source code directly.' }
    ],
    faqs: [
      { q: 'Can I copy the HTML directly to my clipboard?', a: 'Yes! The tool provides a one-click copy button as well as a file download.' }
    ],
    relatedToolSlugs: ['html-to-pdf', 'pdf-to-text', 'pdf-to-word']
  },
  {
    id: 'txt-to-pdf',
    slug: 'txt-to-pdf',
    name: 'TXT to PDF',
    shortDesc: 'Convert plain text, markdown, or code logs into formatted PDF documents.',
    fullDesc: 'Transform plain text files, logs, meeting notes, code snippets, or markdown into beautifully styled PDF documents with custom font sizes and margins.',
    category: 'convert',
    iconName: 'FileCode',
    acceptedFiles: '.txt,.md,.log,.json',
    allowMultiple: false,
    keywords: ['txt to pdf converter', 'text to pdf online', 'convert txt file to pdf'],
    steps: [
      { title: 'Upload or Paste Text', desc: 'Drop your .txt file or paste your raw text.' },
      { title: 'Customize Layout', desc: 'Choose font family, size, line spacing, and margins.' },
      { title: 'Export PDF', desc: 'Generate and download your clean PDF.' }
    ],
    faqs: [
      { q: 'Can I customize font size and line height?', a: 'Yes, full typography controls are available in the editor.' }
    ],
    relatedToolSlugs: ['pdf-to-text', 'word-to-pdf', 'html-to-pdf']
  },
  {
    id: 'pdf-to-text',
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    shortDesc: 'Extract all raw and formatted text from any PDF document.',
    fullDesc: 'Quickly rip and extract all textual content from a PDF. Copy clean text to your clipboard or download as a .txt file for analysis, AI prompts, or documentation.',
    category: 'convert',
    iconName: 'AlignLeft',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['pdf to text converter', 'extract text from pdf', 'pdf to txt online free'],
    steps: [
      { title: 'Select PDF File', desc: 'Upload the PDF document you want to extract text from.' },
      { title: 'Extract Content', desc: 'Our engine extracts text strings across all pages in milliseconds.' },
      { title: 'Copy or Download', desc: 'Copy the full text or download as a .txt file.' }
    ],
    faqs: [
      { q: 'Does this work on scanned documents?', a: 'It extracts all native digital text streams. For scanned images, clear text layers are extracted.' }
    ],
    relatedToolSlugs: ['txt-to-pdf', 'pdf-to-word', 'pdf-to-html']
  },
  {
    id: 'csv-to-pdf',
    slug: 'csv-to-pdf',
    name: 'CSV to PDF',
    shortDesc: 'Convert comma-separated CSV files into styled, formatted PDF tables.',
    fullDesc: 'Convert raw CSV data files into clean, professional PDF table reports with alternating row colors, headers, and automatic pagination.',
    category: 'convert',
    iconName: 'FileSpreadsheet',
    acceptedFiles: '.csv,.txt',
    allowMultiple: false,
    keywords: ['csv to pdf converter', 'convert csv to pdf report', 'csv table to pdf'],
    steps: [
      { title: 'Upload CSV', desc: 'Select or drag your .csv file.' },
      { title: 'Style Table', desc: 'Preview table headers, borders, and column widths.' },
      { title: 'Download PDF', desc: 'Generate your professional PDF report.' }
    ],
    faqs: [
      { q: 'Can it handle large CSV datasets?', a: 'Yes, data is processed locally with automatic multi-page splitting.' }
    ],
    relatedToolSlugs: ['excel-to-pdf', 'pdf-to-excel', 'txt-to-pdf']
  },
  {
    id: 'pdf-to-pdfa',
    slug: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    shortDesc: 'Standardize PDF files into ISO-compliant PDF/A format for long-term archiving.',
    fullDesc: 'Convert standard PDF documents into PDF/A compliant format for legal, governmental, and long-term archival standards with standardized metadata and color profiles.',
    category: 'convert',
    iconName: 'Archive',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['pdf to pdfa converter', 'iso pdfa archival', 'pdf a compliance'],
    steps: [
      { title: 'Upload Document', desc: 'Choose the PDF you need to archive.' },
      { title: 'Standardize Profile', desc: 'Embed required archival metadata and conformance tags.' },
      { title: 'Download PDF/A', desc: 'Save your compliant long-term archival document.' }
    ],
    faqs: [
      { q: 'What is PDF/A?', a: 'PDF/A is an ISO-standardized version of the PDF specialized for preserving electronic documents over decades.' }
    ],
    relatedToolSlugs: ['edit-metadata', 'flatten-pdf', 'compress-pdf']
  },
  {
    id: 'pdf-to-grayscale',
    slug: 'pdf-to-grayscale',
    name: 'PDF to Grayscale',
    shortDesc: 'Convert colored PDF documents to crisp black & white / grayscale for printing.',
    fullDesc: 'Convert colorful graphics, images, and backgrounds in your PDF to crisp monochrome grayscale. Save expensive printer toner and reduce file size.',
    category: 'convert',
    iconName: 'Contrast',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['pdf to grayscale converter', 'convert pdf to black and white', 'monochrome pdf'],
    steps: [
      { title: 'Upload PDF', desc: 'Drop your colorful PDF file.' },
      { title: 'Apply Grayscale', desc: 'All color layers are rendered into high-contrast monochrome.' },
      { title: 'Download Grayscale PDF', desc: 'Download your print-ready B&W PDF.' }
    ],
    faqs: [
      { q: 'Will text readability be impacted?', a: 'No, text contrast is preserved with optimal luminance weighting.' }
    ],
    relatedToolSlugs: ['compress-pdf', 'flatten-pdf', 'crop-pdf']
  },

  // ==================== EDIT & SIGN ====================
  {
    id: 'add-watermark',
    slug: 'add-watermark',
    name: 'Add Watermark',
    shortDesc: 'Add custom text or image watermarks with full opacity, angle, and position control.',
    fullDesc: 'Protect your intellectual property or mark documents as DRAFT, CONFIDENTIAL, or PROPRIETARY. Add text or graphic watermarks with custom rotation, transparency, and positioning.',
    category: 'edit',
    iconName: 'Stamp',
    badge: 'Popular',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['add watermark to pdf', 'watermark pdf online free', 'stamp confidential pdf'],
    steps: [
      { title: 'Upload Document', desc: 'Select the PDF you want to watermark.' },
      { title: 'Customize Watermark', desc: 'Enter watermark text, pick font size, color, rotation angle, and opacity.' },
      { title: 'Apply and Download', desc: 'Download your protected, watermarked PDF.' }
    ],
    faqs: [
      { q: 'Can I add an image logo as a watermark?', a: 'Yes! You can choose between custom text or an uploaded image logo.' },
      { q: 'Can the watermark be easily removed by others?', a: 'No, the watermark is rendered directly onto the page stream.' }
    ],
    relatedToolSlugs: ['stamp-pdf', 'add-page-numbers', 'protect-pdf']
  },
  {
    id: 'add-page-numbers',
    slug: 'add-page-numbers',
    name: 'Add Page Numbers',
    shortDesc: 'Insert customized page numbers into header or footer with customizable formats.',
    fullDesc: 'Number pages in your PDF document effortlessly. Choose from formats like "Page X of Y", "X / Y", or simple numerals, and customize position, margin, and typography.',
    category: 'edit',
    iconName: 'Hash',
    badge: 'Popular',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['add page numbers to pdf', 'paginate pdf online', 'insert page numbers in pdf'],
    steps: [
      { title: 'Upload PDF', desc: 'Drop the document you need to number.' },
      { title: 'Choose Format & Position', desc: 'Select top/bottom positioning (left, center, right) and numbering format.' },
      { title: 'Download Numbered PDF', desc: 'Get your fully paginated document.' }
    ],
    faqs: [
      { q: 'Can I start numbering from a specific page?', a: 'Yes! You can specify starting page offset and number values.' }
    ],
    relatedToolSlugs: ['add-watermark', 'edit-metadata', 'merge-pdf']
  },
  {
    id: 'stamp-pdf',
    slug: 'stamp-pdf',
    name: 'Stamp PDF',
    shortDesc: 'Overlay business stamps like APPROVED, CONFIDENTIAL, PAID, or custom labels.',
    fullDesc: 'Apply standard business and legal stamps (APPROVED, CONFIDENTIAL, DRAFT, PAID, VOID, RECEIVED) or create your own custom colored stamp with current date and time.',
    category: 'edit',
    iconName: 'CheckCircle2',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['stamp pdf online', 'approved stamp on pdf', 'add confidential stamp to pdf'],
    steps: [
      { title: 'Select Document', desc: 'Upload your PDF invoice, contract, or form.' },
      { title: 'Select Stamp Style', desc: 'Choose a preset stamp (APPROVED, PAID, etc.) or create a custom label.' },
      { title: 'Download Stamped PDF', desc: 'Save your officially stamped document.' }
    ],
    faqs: [
      { q: 'Can I customize the stamp color?', a: 'Yes, choose from Red, Green, Blue, Purple, or custom hex colors.' }
    ],
    relatedToolSlugs: ['add-watermark', 'sign-pdf', 'edit-metadata']
  },
  {
    id: 'edit-metadata',
    slug: 'edit-metadata',
    name: 'Edit PDF Metadata',
    shortDesc: 'Modify Title, Author, Subject, Keywords, and Creation Date properties.',
    fullDesc: 'Inspect and update internal document properties. Optimize your PDF for search engines, organize document catalogs, or clean private author metadata before sharing.',
    category: 'edit',
    iconName: 'Info',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['edit pdf metadata', 'change pdf title and author', 'remove pdf metadata properties'],
    steps: [
      { title: 'Upload PDF', desc: 'Load the document to inspect current metadata properties.' },
      { title: 'Edit Fields', desc: 'Change the Title, Author, Subject, Keywords, and Creator fields.' },
      { title: 'Save Metadata', desc: 'Download the updated PDF with refreshed document properties.' }
    ],
    faqs: [
      { q: 'Can I clear all metadata for privacy?', a: 'Yes! Click "Clear All" to remove all author and creation traces.' }
    ],
    relatedToolSlugs: ['flatten-pdf', 'pdf-to-pdfa', 'protect-pdf']
  },
  {
    id: 'sign-pdf',
    slug: 'sign-pdf',
    name: 'Sign PDF',
    shortDesc: 'Draw, type, or upload your signature and place it anywhere on your PDF.',
    fullDesc: 'Fill and sign documents online with our interactive signature tool. Draw with your mouse or touchscreen, type in elegant script typography, or upload a transparent signature PNG.',
    category: 'edit',
    iconName: 'PenTool',
    badge: 'Popular',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['sign pdf online free', 'draw signature on pdf', 'electronic signature pdf', 'fill and sign pdf'],
    steps: [
      { title: 'Upload Contract / Form', desc: 'Upload the document requiring your signature.' },
      { title: 'Create Signature', desc: 'Draw using mouse/touchpad, type your name, or upload an image.' },
      { title: 'Place & Download', desc: 'Position your signature on the target page and download the signed PDF.' }
    ],
    faqs: [
      { q: 'Is my digital signature legally valid?', a: 'Electronic signatures placed on standard documents are widely recognized for standard commercial agreements.' },
      { q: 'Is my signature uploaded to any server?', a: 'Never! Everything runs 100% locally in your browser memory.' }
    ],
    relatedToolSlugs: ['add-watermark', 'stamp-pdf', 'flatten-pdf']
  },
  {
    id: 'flatten-pdf',
    slug: 'flatten-pdf',
    name: 'Flatten PDF',
    shortDesc: 'Merge interactive form fields, layers, and annotations into static non-editable page content.',
    fullDesc: 'Lock filled-in form fields, signatures, and comments so they cannot be edited, altered, or misrendered by third-party PDF viewers.',
    category: 'edit',
    iconName: 'Layers',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['flatten pdf forms', 'lock pdf form fields', 'flatten annotations pdf'],
    steps: [
      { title: 'Upload Form / PDF', desc: 'Select the interactive or filled PDF.' },
      { title: 'Flatten Layers', desc: 'Convert interactive form elements into static vector drawings.' },
      { title: 'Download Secure PDF', desc: 'Download your locked, uneditable document.' }
    ],
    faqs: [
      { q: 'What does flattening do?', a: 'It converts editable Acrobat form widgets into permanent graphic elements on the page.' }
    ],
    relatedToolSlugs: ['protect-pdf', 'edit-metadata', 'repair-pdf']
  },
  {
    id: 'repair-pdf',
    slug: 'repair-pdf',
    name: 'Repair PDF',
    shortDesc: 'Recover and repair corrupted, damaged, or unreadable PDF structures.',
    fullDesc: 'Analyze and reconstruct damaged cross-reference tables, fix broken object streams, and re-index invalid PDF files so they open smoothly in all readers.',
    category: 'edit',
    iconName: 'Wrench',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['repair corrupted pdf', 'fix damaged pdf file', 'recover broken pdf'],
    steps: [
      { title: 'Upload Damaged PDF', desc: 'Upload the corrupted or unreadable PDF file.' },
      { title: 'Rebuild Structure', desc: 'Our engine scans object streams and rebuilds cross-references.' },
      { title: 'Download Repaired File', desc: 'Download the newly structured, readable PDF.' }
    ],
    faqs: [
      { q: 'Can all damaged PDFs be fixed?', a: 'It successfully repairs missing headers, broken xref tables, and partial stream corruptions.' }
    ],
    relatedToolSlugs: ['flatten-pdf', 'unlock-pdf', 'compress-pdf']
  },

  // ==================== PDF SECURITY ====================
  {
    id: 'protect-pdf',
    slug: 'protect-pdf',
    name: 'Protect PDF',
    shortDesc: 'Encrypt your PDF with standard passwords and security restrictions.',
    fullDesc: 'Add high-grade password protection to your confidential documents. Prevent unauthorized viewing, printing, or copying with custom encryption parameters.',
    category: 'security',
    iconName: 'Lock',
    badge: 'Security',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['protect pdf with password', 'encrypt pdf online', 'password protect pdf free'],
    steps: [
      { title: 'Upload PDF', desc: 'Select the confidential PDF you want to protect.' },
      { title: 'Set Strong Password', desc: 'Enter and confirm your secure password.' },
      { title: 'Download Encrypted PDF', desc: 'Save your password-protected PDF document.' }
    ],
    faqs: [
      { q: 'Will I need this password every time I open the file?', a: 'Yes, standard PDF viewers will prompt for the password before displaying pages.' }
    ],
    relatedToolSlugs: ['unlock-pdf', 'flatten-pdf', 'compress-pdf']
  },
  {
    id: 'unlock-pdf',
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    shortDesc: 'Remove password protection and permissions security from your PDF.',
    fullDesc: 'Remove user password requirements and restrictions from PDF files you own, creating an unlocked copy that opens instantly in any reader without entering credentials.',
    category: 'security',
    iconName: 'Unlock',
    badge: 'Security',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['unlock pdf remove password', 'decrypt pdf online', 'remove password from pdf'],
    steps: [
      { title: 'Upload Protected PDF', desc: 'Select the password-protected document.' },
      { title: 'Enter Password', desc: 'Provide the document password to authenticate.' },
      { title: 'Download Unlocked PDF', desc: 'Save a clean, unencrypted version of your document.' }
    ],
    faqs: [
      { q: 'Can I unlock a file if I completely forgot the password?', a: 'For security reasons, you must provide the authorized password once to generate the permanently unlocked copy.' }
    ],
    relatedToolSlugs: ['protect-pdf', 'flatten-pdf', 'repair-pdf']
  },
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    shortDesc: 'Reduce PDF file size while maintaining optimal visual clarity.',
    fullDesc: 'Shrink bulky PDF files to fit email attachments and fast web sharing. Choose between Low, Recommended, and Extreme compression with live file size comparison.',
    category: 'security',
    iconName: 'Minimize2',
    badge: 'Popular',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    keywords: ['compress pdf without losing quality', 'reduce pdf file size', 'shrink pdf online free', 'pdf compressor'],
    steps: [
      { title: 'Upload Large PDF', desc: 'Select the document you need to compress.' },
      { title: 'Select Compression Level', desc: 'Choose between Low, Recommended (Balanced), or High compression.' },
      { title: 'Download Compressed PDF', desc: 'See your file size savings and download instantly.' }
    ],
    faqs: [
      { q: 'How much can I reduce the file size?', a: 'Typically 40% to 80% size reduction depending on the volume of embedded imagery and stream compression.' },
      { q: 'Does compression alter text clarity?', a: 'No, all vector text remains razor sharp while image bitmaps and redundant streams are optimized.' }
    ],
    relatedToolSlugs: ['merge-pdf', 'pdf-to-grayscale', 'crop-pdf']
  }
];

export const CATEGORIES_CONFIG: { id: ToolCategory; label: string; description: string; icon: string }[] = [
  {
    id: 'organize',
    label: 'Organize PDF',
    description: 'Merge, split, reorder, delete, rotate, and extract PDF pages',
    icon: 'Layers'
  },
  {
    id: 'convert',
    label: 'Convert PDF',
    description: 'Convert to and from JPG, PNG, Word, Excel, PowerPoint, HTML, TXT & CSV',
    icon: 'RefreshCw'
  },
  {
    id: 'edit',
    label: 'Edit & Sign',
    description: 'Add watermarks, page numbers, digital signatures, stamps & metadata',
    icon: 'PenTool'
  },
  {
    id: 'security',
    label: 'PDF Security',
    description: 'Encrypt, unlock, repair, and compress PDF documents securely',
    icon: 'ShieldCheck'
  }
];
