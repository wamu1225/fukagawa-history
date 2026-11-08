// scripts/prerender.ts：SSG。トップ（さんぽルート）、記事一覧、記事10本、about/privacyの
// 静的フォールバックHTML、per-page meta、JSON-LDを焼き込み、sitemap.xmlを生成する。
// 実行: npx tsx scripts/prerender.ts（npm run predeploy 内）
import * as fs from 'fs';
import * as path from 'path';
import { articles, CATEGORY_LABEL } from '../src/data/articles';
import { ABOUT_CONTENT, PRIVACY_CONTENT, SITE_NAME } from '../src/data/static-pages';
import { figureHtml, heroSceneSvg } from '../src/data/figures-data';
import { ARTICLE_GROUPS } from '../src/data/articleGroups';
import { HOOK, ARTICLE_POINTS } from '../src/data/hooks';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const BASE = '/fukagawa-history';
const BASE_URL = 'https://study-apps.com/fukagawa-history';
const SITE_UPDATED_AT = '2026-09-13';

console.log('--- fukagawa-history SSG Pre-rendering ---');
if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
function templateForDepth(depth: number): string {
  if (depth === 0) return templateHtml;
  const up = '../'.repeat(depth);
  return templateHtml
    .replace(/href="\.\/assets\//g, `href="${up}assets/`)
    .replace(/src="\.\/assets\//g, `src="${up}assets/`)
    .replace(/href="\.\/favicon\.svg"/g, `href="${up}favicon.svg"`);
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const linkify = (s: string) => s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => `<a href="${url}">${label}</a>`);

function extractHeadings(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.startsWith('## '))
    .map((b) => b.slice(3));
}

function mdToHtml(content: string): string {
  let h2Index = 0;
  return content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => (b.startsWith('## ') ? `<h2 id="sec-${h2Index++}">${linkify(esc(b.slice(3)))}</h2>` : `<p>${linkify(esc(b))}</p>`))
    .join('\n');
}

function tocHtml(content: string): string {
  const headings = extractHeadings(content);
  if (headings.length < 2) return '';
  return `<nav aria-label="目次" style="margin:16px 0;padding:12px 16px;background:#fff;border:1px solid #ddd3bf;border-radius:6px">
    <p style="margin:0 0 6px;font-weight:700;color:#1b4b43">目次</p>
    <ol style="margin:0;padding-left:18px">${headings.map((h, i) => `<li><a href="#sec-${i}" style="color:#1b4b43">${esc(h)}</a></li>`).join('')}</ol>
  </nav>`;
}

function applyMeta(html: string, title: string, description: string, urlPath: string): string {
  const fullTitle = urlPath === '/' ? SITE_NAME : `${title}｜${SITE_NAME}`;
  const url = `${BASE_URL}${urlPath}`;
  return html
    .replace(/<title>.*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${esc(description)}" />`);
}

function writePage(subpath: string, html: string) {
  const dir = subpath === '' ? DIST_DIR : path.join(DIST_DIR, subpath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

const footerNav = `<nav style="margin-top:24px;display:flex;gap:16px;flex-wrap:wrap"><a href="${BASE}/about/" style="color:#1b4b43">このサイトについて</a><a href="${BASE}/privacy/" style="color:#1b4b43">プライバシーポリシー</a></nav>`;

const shellStyle =
  'font-family:sans-serif;line-height:1.85;max-width:720px;margin:0 auto;padding:24px 20px;color:#2b2420';
const h1Style = 'font-size:1.5rem;border-bottom:3px solid #b5533c;padding-bottom:8px;margin-bottom:16px;color:#1b4b43';

function wrap(depth: number, title: string, desc: string, urlPath: string, bodyHtml: string, jsonLd: object) {
  let html = applyMeta(templateForDepth(depth), title, desc, urlPath);
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`);
  return html;
}

// ── トップ（分野別の入口＝亀戸型・O-2-30） ──
const homeDesc =
  '東京都江東区深川の歴史と文化を一次資料でまとめる。地名の由来、運河網の形成、松尾芭蕉、富岡八幡宮、深川めしまで。';
const groupedHtml = ARTICLE_GROUPS.map((g) =>
  `<h3 style="font-size:1.02rem;margin:18px 0 6px;color:#1b4b43">${esc(g.title)}</h3>\n<ul style="padding-left:18px">${g.ids.map((id) => articles.find((a) => a.id === id)).filter((a) => a !== undefined).map((a) => `<li><a href="${BASE}/articles/${a.id}/" style="color:#1b4b43">${esc(a.title)}</a></li>`).join('\n')}</ul>`,
).join('\n');
const homeBody = `<article style="${shellStyle}">
  <p style="color:#6b6259;font-size:0.8rem">${SITE_NAME}&#12288;東京都江東区 深川</p>
  <h1 style="${h1Style}">${esc(HOOK.catch).replace('\n', '<br/>')}</h1>
  <p>${esc(HOOK.sub)}</p>
  ${heroSceneSvg()}
  <ul style="padding-left:18px">${HOOK.numbers.map((x) => `<li><a href="${BASE}/articles/${x.id}/" style="color:#1b4b43"><strong>${esc(x.n + x.unit)}</strong></a>：${esc(x.label)}</li>`).join('')}</ul>
  <h2 style="font-size:1.15rem;margin:24px 0 8px;color:#1b4b43">気になる問いから読む</h2>
  <ul style="padding-left:18px">${HOOK.questions.map((x) => `<li><a href="${BASE}/articles/${x.id}/" style="color:#1b4b43"><strong>${esc(x.q)}</strong></a> ${esc(x.a)}</li>`).join('')}</ul>
  <h2 style="font-size:1.15rem;margin:24px 0 8px;color:#1b4b43">記事をぜんぶ見る</h2>
  ${groupedHtml}
  ${footerNav}
</article>`;
writePage(
  '',
  wrap(0, '', homeDesc, '/', homeBody, {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${BASE_URL}/`,
    description: homeDesc,
    inLanguage: 'ja',
  }),
);
console.log('✓ トップページ');

// ── 記事一覧 ──
{
  const desc = '深川の地名の由来から、運河網、松尾芭蕉、富岡八幡宮、深川めしまでをまとめた記事一覧です。';
  const row = (a: (typeof articles)[number]) => `<li>[${CATEGORY_LABEL[a.category]}] <a href="${BASE}/articles/${a.id}/" style="color:#1b4b43">${esc(a.title)}</a>：${esc(a.dek)}</li>`;
  const grouped = new Set(ARTICLE_GROUPS.flatMap((g) => g.ids));
  const rest = articles.filter((a) => !grouped.has(a.id));
  const rows = ARTICLE_GROUPS.map((g) =>
    `<h2 style="font-size:1.05rem;margin-top:20px">${esc(g.title)}</h2><p style="color:#5f5a52">${esc(g.lead)}</p><ul style="padding-left:18px">${g.ids.map((id) => articles.find((a) => a.id === id)).filter((a) => a !== undefined).map(row).join('\n')}</ul>`,
  ).join('\n') + (rest.length ? `<h2 style="font-size:1.05rem;margin-top:20px">そのほか</h2><ul style="padding-left:18px">${rest.map(row).join('\n')}</ul>` : '');
  const body = `<article style="${shellStyle}">
    <h1 style="${h1Style}">記事一覧</h1>
    <p>${esc(desc)}</p>
    ${rows}
    ${footerNav}
  </article>`;
  writePage(
    'articles',
    wrap(1, '記事一覧', desc, '/articles/', body, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: '記事一覧',
      url: `${BASE_URL}/articles/`,
      inLanguage: 'ja',
    }),
  );
}
console.log('✓ /articles/');

// ── 記事本体 ──
for (const a of articles) {
  const sourcesHtml = a.sources
    .map((s) => `<li><a href="${esc(s.url)}" style="color:#1b4b43">${esc(s.label)}</a></li>`)
    .join('\n');
  const fig = figureHtml(a.id);
  const body = `<article style="${shellStyle}">
    <p style="display:inline-block;font-size:0.74rem;padding:3px 10px;border-radius:12px;color:#fff;background:#1b4b43">${esc(CATEGORY_LABEL[a.category])}</p>
    <h1 style="${h1Style}">${esc(a.title)}</h1>
    <p style="color:#6b6259">${esc(a.dek)}</p>
    ${ARTICLE_POINTS[a.id] ? `<div style="margin:12px 0;padding:12px 14px;background:#fff;border:2px solid #1b4b43;border-radius:8px"><p style="margin:0 0 4px;font-weight:700;color:#1b4b43;font-size:0.85rem">ざっくり3行</p><ol style="margin:0;padding-left:1.3em">${ARTICLE_POINTS[a.id].map((p) => `<li>${esc(p)}</li>`).join('')}</ol></div>` : ''}
    ${tocHtml(a.body)}
    ${mdToHtml(a.body)}
    ${fig ?? ''}
    <div style="margin-top:24px;padding:14px 16px;background:#fff;border:1px solid #ddd3bf;border-radius:6px">
      <strong>出典</strong>
      <ul style="margin:6px 0 0;padding-left:18px">${sourcesHtml}</ul>
    </div>
    <p style="margin-top:20px"><a href="${BASE}/articles/" style="color:#1b4b43">← 記事一覧に戻る</a></p>
    ${footerNav}
  </article>`;
  writePage(
    `articles/${a.id}`,
    wrap(2, a.title, a.dek, `/articles/${a.id}/`, body, {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.dek,
      dateModified: a.updatedAt,
      url: `${BASE_URL}/articles/${a.id}/`,
      inLanguage: 'ja',
    }),
  );
}
console.log(`✓ /articles/<id>/ 全${articles.length}件`);

// ── about / privacy ──
for (const [slug, title, desc, content] of [
  ['about', 'このサイトについて', `${SITE_NAME}のデータの出典と編集方針を説明します。`, ABOUT_CONTENT],
  ['privacy', 'プライバシーポリシー', `${SITE_NAME}のプライバシーポリシー。`, PRIVACY_CONTENT],
] as const) {
  const body = `<article style="${shellStyle}">
    <h1 style="${h1Style}">${esc(title)}</h1>
    ${mdToHtml(content)}
    ${footerNav}
  </article>`;
  writePage(
    slug,
    wrap(1, title, desc, `/${slug}/`, body, {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: desc,
      url: `${BASE_URL}/${slug}/`,
      inLanguage: 'ja',
    }),
  );
}
console.log('✓ /about/ /privacy/');

// ── sitemap.xml（lastmodはページ単位＝O-2-27の教訓。全URL一律の日付にしない） ──
const urls = [
  { loc: `${BASE_URL}/`, priority: '1.0', lastmod: SITE_UPDATED_AT },
  { loc: `${BASE_URL}/articles/`, priority: '0.8', lastmod: SITE_UPDATED_AT },
  ...articles.map((a) => ({ loc: `${BASE_URL}/articles/${a.id}/`, priority: '0.7', lastmod: a.updatedAt })),
  { loc: `${BASE_URL}/about/`, priority: '0.3', lastmod: SITE_UPDATED_AT },
  { loc: `${BASE_URL}/privacy/`, priority: '0.2', lastmod: SITE_UPDATED_AT },
];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);
console.log(`✓ sitemap.xml（全${urls.length}URL）`);

console.log('--- Done ---');
