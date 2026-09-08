// 記事本文に付随する自作SVG模式図のSSOT。
// React版（ArticlePage.tsx）と prerender.ts が同じHTML文字列を共用する。

import { routeStops } from './route';

export type Figure = { html: string };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 実座標地図：routeStops の緯度経度を単純な正距円筒図法（経度をcos(緯度)で補正）で
// 平面に投影する。route.ts の注記のとおり、各地点の座標は駅・施設の実座標または
// 公表住所・徒歩分数からの概算であり、測量精度ではない相対位置の目安。
//
// ⚠️ viewBox幅は390px幅のモバイル表示でも実効フォントが11px以上になるよう、
// 表示上限幅（.fig--map svgのmax-width）に近い値に抑えている（O-2-25の再発防止）。
// 地点名はSVG内テキストにせず、figure直下のHTML（凡例リスト）に置くことで、
// 通常のCSSで読める大きさを保証する（viewBox拡大縮小の影響を受けない）。
function buildRouteMapSvg(): string {
  const R_EARTH_M = 111_320; // 1度あたりの概算距離（緯度）
  const lat0 = routeStops.reduce((s, p) => s + p.lat, 0) / routeStops.length;
  const cosLat = Math.cos((lat0 * Math.PI) / 180);

  const toXY = (lat: number, lng: number) => ({
    x: lng * cosLat * R_EARTH_M,
    y: -lat * R_EARTH_M, // 北が上になるようyを反転
  });

  const pts = routeStops.map((s) => ({ ...s, ...toXY(s.lat, s.lng) }));
  const minX = Math.min(...pts.map((p) => p.x));
  const maxX = Math.max(...pts.map((p) => p.x));
  const minY = Math.min(...pts.map((p) => p.y));
  const maxY = Math.max(...pts.map((p) => p.y));

  const PAD = 30;
  const W = 300;
  const H = 360;
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2 - 40) / spanY);

  const px = (x: number) => PAD + (x - minX) * scale;
  const py = (y: number) => PAD + (y - minY) * scale;

  const line = pts.map((p) => `${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`).join(' ');

  const dots = pts
    .map((p) => {
      const cx = px(p.x).toFixed(1);
      const cy = py(p.y).toFixed(1);
      const color = p.category === 'canal' ? '#1b4b43' : '#b5533c';
      return `<g>
        <circle cx="${cx}" cy="${cy}" r="11" fill="${color}" stroke="#fff" stroke-width="2" />
        <text x="${cx}" y="${cy}" font-size="12" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="central">${p.order}</text>
      </g>`;
    })
    .join('\n');

  // 100mスケールバー（実距離から逆算）
  const barMeters = 200;
  const barPx = barMeters * scale;
  const barX0 = PAD;
  const barY = H - 44;

  return `<figure class="fig fig--map">
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="map-title map-desc">
    <title id="map-title">深川の運河跡9地点、実座標にもとづく位置関係図</title>
    <desc id="map-desc">各地点の緯度経度から算出した相対位置を示す図。測量精度の地図ではなく、公表されている座標や住所にもとづく概略図。番号は下の凡例と対応する。</desc>
    <polyline points="${line}" fill="none" stroke="#a89f92" stroke-width="2" stroke-dasharray="3 5" />
    ${dots}
    <g transform="translate(${W - 26}, 26)">
      <line x1="0" y1="16" x2="0" y2="0" stroke="#2a2622" stroke-width="2" marker-end="url(#map-n-arrow)" />
      <text x="0" y="-4" font-size="13" text-anchor="middle" fill="#2a2622">N</text>
    </g>
    <g transform="translate(${barX0}, ${barY})">
      <line x1="0" y1="0" x2="${barPx.toFixed(1)}" y2="0" stroke="#2a2622" stroke-width="2" />
      <line x1="0" y1="-4" x2="0" y2="4" stroke="#2a2622" stroke-width="2" />
      <line x1="${barPx.toFixed(1)}" y1="-4" x2="${barPx.toFixed(1)}" y2="4" stroke="#2a2622" stroke-width="2" />
      <text x="${(barPx / 2).toFixed(1)}" y="16" font-size="11" text-anchor="middle" fill="#2a2622">${barMeters}m</text>
    </g>
    <defs>
      <marker id="map-n-arrow" markerWidth="8" markerHeight="8" refX="4" refY="1" orient="auto">
        <path d="M0,8 L4,0 L8,8 Z" fill="#2a2622" />
      </marker>
    </defs>
  </svg>
  <div class="fig-map__legend">
    <ol>
      ${pts.map((p) => `<li><span class="fig-map__dot fig-map__dot--${p.category}">${p.order}</span>${esc(p.name)}</li>`).join('\n      ')}
    </ol>
    <p class="fig-map__key">
      <span class="fig-map__key-item"><span class="fig-map__dot fig-map__dot--canal">●</span>運河（跡）</span>
      <span class="fig-map__key-item"><span class="fig-map__dot fig-map__dot--context">●</span>寄り道（文脈）</span>
    </p>
  </div>
  <figcaption>9地点の位置関係を、各地点の緯度経度から算出して描いた図。座標は駅や施設の公表座標、または住所と徒歩分数からの概算であり、測量精度ではない。正確な現代地図との重ね合わせは、ROIS-DS人文学オープンデータ共同利用センターの「深川絵図（現代位置合わせ地図）」で確認できる（出典参照）。</figcaption>
</figure>`;
}

const figures: Record<string, Figure> = {
  'fukagawa-origin': {
    html: buildRouteMapSvg(),
  },
  'aburabori-shutoko': {
    html: `<figure class="fig">
  <svg viewBox="0 0 640 220" role="img" aria-labelledby="abura-title abura-desc">
    <title id="abura-title">油堀川がそのまま首都高速9号深川線の川幅になった断面図</title>
    <desc id="abura-desc">かつて川幅いっぱいに水が流れていた場所に、同じ幅で高架道路が架けられている様子を示す模式図。</desc>
    <g transform="translate(20,20)">
      <text x="0" y="0" font-size="14" fill="#6b6259">かつて</text>
      <rect x="0" y="14" width="260" height="70" fill="none" stroke="#ddd3bf" stroke-width="2" />
      <path d="M 10 60 Q 60 40, 110 60 T 210 60 T 250 60" fill="none" stroke="#1b4b43" stroke-width="18" stroke-linecap="round" opacity="0.55" />
      <text x="10" y="100" font-size="12" fill="#2b2420">油堀川（水路）</text>
    </g>
    <g transform="translate(360,20)">
      <text x="0" y="0" font-size="14" fill="#6b6259">今</text>
      <rect x="0" y="14" width="260" height="70" fill="none" stroke="#ddd3bf" stroke-width="2" />
      <rect x="0" y="40" width="260" height="10" fill="#b5533c" />
      <rect x="15" y="50" width="8" height="34" fill="#b5533c" />
      <rect x="80" y="50" width="8" height="34" fill="#b5533c" />
      <rect x="145" y="50" width="8" height="34" fill="#b5533c" />
      <rect x="210" y="50" width="8" height="34" fill="#b5533c" />
      <text x="10" y="100" font-size="12" fill="#2b2420">首都高速9号深川線（高架）</text>
    </g>
    <line x1="290" y1="60" x2="350" y2="60" stroke="#6b6259" stroke-width="2" marker-end="url(#abura-arrow)" />
    <defs>
      <marker id="abura-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#6b6259" />
      </marker>
    </defs>
  </svg>
  <figcaption>水路の川幅と、頭上を通る高架の幅はほぼ同じ。埋め立てられたあとも、土地の区画としての幅は引き継がれている。</figcaption>
</figure>`,
  },
  'sendaibori-furuishiba': {
    html: `<figure class="fig">
  <svg viewBox="0 0 640 220" role="img" aria-labelledby="canal-title canal-desc">
    <title id="canal-title">運河のカーブがそのまま親水公園の遊歩道の形になった模式図</title>
    <desc id="canal-desc">蛇行していた水路の形が、埋め立て後の親水公園の遊歩道の曲線としてそのまま残っている様子を示す模式図。</desc>
    <g transform="translate(20,20)">
      <text x="0" y="0" font-size="14" fill="#6b6259">かつて（水路）</text>
      <path d="M 10 100 Q 60 40, 120 80 T 240 60" fill="none" stroke="#1b4b43" stroke-width="22" stroke-linecap="round" opacity="0.55" />
    </g>
    <g transform="translate(360,20)">
      <text x="0" y="0" font-size="14" fill="#6b6259">今（親水公園）</text>
      <path d="M 10 100 Q 60 40, 120 80 T 240 60" fill="none" stroke="#8fae86" stroke-width="22" stroke-linecap="round" opacity="0.5" />
      <path d="M 10 100 Q 60 40, 120 80 T 240 60" fill="none" stroke="#b5533c" stroke-width="2" stroke-dasharray="4 5" />
    </g>
    <line x1="290" y1="90" x2="350" y2="90" stroke="#6b6259" stroke-width="2" marker-end="url(#canal-arrow)" />
    <defs>
      <marker id="canal-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#6b6259" />
      </marker>
    </defs>
  </svg>
  <figcaption>水路の蛇行は、道路として新しく作られたものではないため直線にならない。同じカーブが遊歩道の形として残る。</figcaption>
</figure>`,
  },
};

export function figureHtml(articleId: string): string | null {
  return figures[articleId]?.html ?? null;
}
