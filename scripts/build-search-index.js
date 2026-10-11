/**
 * scripts/build-search-index.js
 * Generates search-index.json from HTML pages.
 * Run with: node scripts/build-search-index.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const pages = [
  { file: 'index.html', url: 'index.html' },
  { file: 'about.html', url: 'about.html' },
  { file: 'programs.html', url: 'programs.html' },
  { file: 'gallery.html', url: 'gallery.html' },
  { file: 'get-involved.html', url: 'get-involved.html' },
  { file: 'contact.html', url: 'contact.html' }
];

function stripHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractPageData(html, url) {
  // Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  let title = titleMatch ? titleMatch[1].replace(/\|.*$/, '').trim() : '';
  if (!title) title = path.basename(url, '.html');

  // Description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Headings
  const headings = [];
  const headingRegex = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let hMatch;
  while ((hMatch = headingRegex.exec(html)) !== null) {
    const text = stripHtml(hMatch[2]);
    if (text && !headings.includes(text)) {
      headings.push(text);
    }
  }

  // Main body text excerpt
  const mainMatch = html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
  const mainHtml = mainMatch ? mainMatch[1] : html;
  const rawBody = stripHtml(mainHtml);
  // Keep first 1200 characters for compact and fast search index
  const body = rawBody.slice(0, 1200);

  return {
    url,
    title,
    description,
    headings,
    body
  };
}

const index = [];

for (const p of pages) {
  const filePath = path.join(rootDir, p.file);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  const pageData = extractPageData(html, p.url);
  index.push(pageData);
  console.log(`Indexed: ${p.file} - "${pageData.title}" (${pageData.headings.length} headings)`);
}

const outputPath = path.join(rootDir, 'search-index.json');
fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8');
console.log(`Successfully generated search-index.json with ${index.length} pages.`);
