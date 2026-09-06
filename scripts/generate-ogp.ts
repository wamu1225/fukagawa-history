// scripts/generate-ogp.ts — OGP画像（1200×630）を public/ogp.png に生成する。
// 実行: npx tsx scripts/generate-ogp.ts
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const FONT_SERIF = "'Hiragino Mincho ProN','Yu Mincho',serif";
const FONT_SANS = "'Yu Gothic','Hiragino Kaku Gothic ProN','Hiragino Sans',Meiryo,'Noto Sans JP',sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5efe4"/>
  <rect x="0" y="0" width="1200" height="16" fill="#1b4b43"/>
  <rect x="0" y="16" width="1200" height="6" fill="#b5533c"/>
  <g transform="translate(0 380)" opacity="0.9">
    <path d="M -40 40 Q 220 -60, 480 40 T 1000 40 T 1300 40" fill="none" stroke="#1b4b43" stroke-width="10" stroke-linecap="round" opacity="0.25"/>
    <path d="M -40 110 Q 220 10, 480 110 T 1000 110 T 1300 110" fill="none" stroke="#1b4b43" stroke-width="10" stroke-linecap="round" opacity="0.15"/>
  </g>
  <text x="96" y="230" font-family="${FONT_SERIF}" font-size="72" font-weight="700" fill="#1b4b43">深川さんぽ史</text>
  <text x="96" y="300" font-family="${FONT_SANS}" font-size="26" fill="#6b6259">街路の形に残る運河の記憶をたどる</text>
  <line x1="96" y1="340" x2="560" y2="340" stroke="#b5533c" stroke-width="2"/>
  <text x="96" y="390" font-family="${FONT_SANS}" font-size="24" fill="#1b4b43" font-weight="600">study-apps.com/fukagawa-history/</text>
</svg>`;

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const outPath = path.join(PUBLIC_DIR, 'ogp.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`✓ ogp.png (1200x630) を生成: ${outPath}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
