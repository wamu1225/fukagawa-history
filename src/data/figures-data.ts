// 記事本文に付随する自作SVG模式図のSSOT。
// React版（ArticlePage.tsx）と prerender.ts が同じHTML文字列を共用する。
// 精密な地図ではなく、テキストだけでは伝わらない「形の変化」を補う概念図。

export type Figure = { html: string };

const figures: Record<string, Figure> = {
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
