import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const siteUrlRaw =
  process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://education-roi.netlify.app';
const siteUrl = siteUrlRaw.replace(/\/+$/, '');
const lastmod = new Date().toISOString().split('T')[0];

const rootPages = [
  '/',
  '/calculators.html',
  '/about.html',
  '/privacy.html',
  '/terms.html',
  '/accessibility.html'
];

function listHtmlFiles(dir, basePath) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.html'))
    .sort()
    .map((file) => `${basePath}/${file}`);
}

const calculatorPages = listHtmlFiles(path.join(rootDir, 'calculators'), '/calculators');
const articlePages = listHtmlFiles(path.join(rootDir, 'articles'), '/articles');

const allPages = [...rootPages, ...calculatorPages, ...articlePages];

const urlsXml = allPages
  .map((pagePath) => {
    const loc = pagePath === '/' ? `${siteUrl}/` : `${siteUrl}${pagePath}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`;

const outputPath = path.join(rootDir, 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml);
console.log(`sitemap.xml generated with ${allPages.length} URLs using ${siteUrl}`);
