import { articles } from '../src/data/articles';
import { routeStops } from '../src/data/route';

let errors = 0;

function fail(msg: string) {
  console.error(`✗ ${msg}`);
  errors++;
}

// ── articles ──
const articleIds = new Set<string>();
for (const a of articles) {
  if (articleIds.has(a.id)) fail(`記事id重複: ${a.id}`);
  articleIds.add(a.id);
  if (!a.title || !a.dek || !a.body) fail(`記事の必須フィールド欠落: ${a.id}`);
  if (a.sources.length === 0) fail(`出典が0件: ${a.id}`);
  if (a.body.length < 300) fail(`本文が短すぎる（300字未満）: ${a.id}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.updatedAt)) fail(`updatedAtの形式不正: ${a.id}`);
}

const orders = articles.map((a) => a.order).sort((a, b) => a - b);
orders.forEach((o, i) => {
  if (o !== i + 1) fail(`記事のorderが連番になっていない: ${o}番目の値が${i + 1}でない`);
});

// ── route stops ──
const stopIds = new Set<string>();
for (const s of routeStops) {
  if (stopIds.has(s.id)) fail(`地点id重複: ${s.id}`);
  stopIds.add(s.id);
  if (!articleIds.has(s.articleId)) fail(`地点${s.id}のarticleIdが存在しない記事を指している: ${s.articleId}`);
}

const stopOrders = routeStops.map((s) => s.order).sort((a, b) => a - b);
stopOrders.forEach((o, i) => {
  if (o !== i + 1) fail(`地点のorderが連番になっていない: ${o}番目の値が${i + 1}でない`);
});

console.log('--- fukagawa-history データ検証 ---');
console.log(`記事: ${articles.length}本`);
console.log(`さんぽルート地点: ${routeStops.length}件`);

if (errors > 0) {
  console.error(`\n❌ ${errors}件のエラー`);
  process.exit(1);
}
console.log('\n✅ All checks passed!');
