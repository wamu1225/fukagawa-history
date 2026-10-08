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
    <title id="map-title">深川の運河跡${routeStops.length}地点、実座標にもとづく位置関係図</title>
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
  <figcaption>${routeStops.length}地点の位置関係を、各地点の緯度経度から算出して描いた図。座標は駅や施設の公表座標、または住所と徒歩分数からの概算であり、測量精度ではない。正確な現代地図との重ね合わせは、ROIS-DS人文学オープンデータ共同利用センターの「深川絵図（現代位置合わせ地図）」で確認できる（出典参照）。</figcaption>
</figure>`;
}

const figures: Record<string, Figure> = {
  'fukagawa-origin': {
    html: buildRouteMapSvg(),
  },
  'aburabori-shutoko': {
    html: `<figure class="fig">
  <svg viewBox="0 0 300 210" width="100%" role="img" aria-labelledby="abura-title abura-desc">
    <title id="abura-title">油堀川がそのまま首都高速9号深川線の川幅になった断面図</title>
    <desc id="abura-desc">かつて川幅いっぱいに水が流れていた場所に、同じ幅で高架道路が架けられている様子を示す模式図。</desc>
    <g transform="translate(20,14)">
      <text x="0" y="0" font-size="13" fill="#6b6259">かつて</text>
      <rect x="0" y="10" width="260" height="60" fill="none" stroke="#ddd3bf" stroke-width="2" />
      <path d="M 10 50 Q 60 32, 110 50 T 210 50 T 250 50" fill="none" stroke="#1b4b43" stroke-width="16" stroke-linecap="round" opacity="0.55" />
      <text x="10" y="86" font-size="12" fill="#2b2420">油堀川（水路）</text>
    </g>
    <line x1="150" y1="104" x2="150" y2="124" stroke="#6b6259" stroke-width="2" marker-end="url(#abura-arrow)" />
    <defs>
      <marker id="abura-arrow" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
        <path d="M0,0 L4,8 L8,0 Z" fill="#6b6259" />
      </marker>
    </defs>
    <g transform="translate(20,128)">
      <text x="0" y="0" font-size="13" fill="#6b6259">今</text>
      <rect x="0" y="10" width="260" height="60" fill="none" stroke="#ddd3bf" stroke-width="2" />
      <rect x="0" y="34" width="260" height="10" fill="#b5533c" />
      <rect x="15" y="44" width="8" height="26" fill="#b5533c" />
      <rect x="80" y="44" width="8" height="26" fill="#b5533c" />
      <rect x="145" y="44" width="8" height="26" fill="#b5533c" />
      <rect x="210" y="44" width="8" height="26" fill="#b5533c" />
      <text x="10" y="80" font-size="12" fill="#2b2420">首都高速9号深川線（高架）</text>
    </g>
  </svg>
  <figcaption>水路の川幅と、頭上を通る高架の幅はほぼ同じ。埋め立てられたあとも、土地の区画としての幅は引き継がれている。</figcaption>
</figure>`,
  },
  'sendaibori-furuishiba': {
    html: `<figure class="fig">
  <svg viewBox="0 0 300 210" width="100%" role="img" aria-labelledby="canal-title canal-desc">
    <title id="canal-title">運河のカーブがそのまま親水公園の遊歩道の形になった模式図</title>
    <desc id="canal-desc">蛇行していた水路の形が、埋め立て後の親水公園の遊歩道の曲線としてそのまま残っている様子を示す模式図。</desc>
    <g transform="translate(20,14)">
      <text x="0" y="0" font-size="13" fill="#6b6259">かつて（水路）</text>
      <path d="M 10 70 Q 45 30, 85 56 T 170 46 T 250 50" fill="none" stroke="#1b4b43" stroke-width="16" stroke-linecap="round" opacity="0.55" />
    </g>
    <line x1="150" y1="100" x2="150" y2="120" stroke="#6b6259" stroke-width="2" marker-end="url(#canal-arrow)" />
    <defs>
      <marker id="canal-arrow" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
        <path d="M0,0 L4,8 L8,0 Z" fill="#6b6259" />
      </marker>
    </defs>
    <g transform="translate(20,124)">
      <text x="0" y="0" font-size="13" fill="#6b6259">今（親水公園）</text>
      <path d="M 10 70 Q 45 30, 85 56 T 170 46 T 250 50" fill="none" stroke="#8fae86" stroke-width="16" stroke-linecap="round" opacity="0.5" />
      <path d="M 10 70 Q 45 30, 85 56 T 170 46 T 250 50" fill="none" stroke="#b5533c" stroke-width="2" stroke-dasharray="4 5" />
    </g>
  </svg>
  <figcaption>水路の蛇行は、道路として新しく作られたものではないため直線にならない。同じカーブが遊歩道の形として残る。</figcaption>
</figure>`,
  },
  chimei: {
    html: `<figure class="fig">
  <svg viewBox="0 0 300 200" width="100%" role="img" aria-labelledby="chimei-title chimei-desc">
    <title id="chimei-title">深川の地名が生まれるまでの3段階の図</title>
    <desc id="chimei-desc">摂津出身の深川八郎右衛門による開拓、慶長元年の家康の巡視、姓がそのまま地名になるまでを順に示した流れ図。</desc>
    <rect width="300" height="200" fill="#f5efe4"/>
    <rect x="20" y="12" width="260" height="42" rx="3" fill="none" stroke="#1b4b43" stroke-width="2"/>
    <text x="150" y="30" font-size="12" font-weight="700" fill="#1b4b43" text-anchor="middle">① 開拓</text>
    <text x="150" y="46" font-size="11.5" fill="#2b2420" text-anchor="middle">摂津出身の深川八郎右衛門が葦の三角州へ</text>
    <path d="M150 56 v16 m-5 -6 l5 6 l5 -6" stroke="#6b6259" stroke-width="2" fill="none"/>
    <rect x="20" y="76" width="260" height="42" rx="3" fill="none" stroke="#b5533c" stroke-width="2"/>
    <text x="150" y="94" font-size="12" font-weight="700" fill="#b5533c" text-anchor="middle">② 1596年（慶長元年）</text>
    <text x="150" y="110" font-size="11.5" fill="#2b2420" text-anchor="middle">巡視した家康が土地の名を尋ねる</text>
    <path d="M150 120 v16 m-5 -6 l5 6 l5 -6" stroke="#6b6259" stroke-width="2" fill="none"/>
    <rect x="20" y="140" width="260" height="42" rx="3" fill="none" stroke="#2b2420" stroke-width="2"/>
    <text x="150" y="158" font-size="12" font-weight="700" fill="#2b2420" text-anchor="middle">③ 姓がそのまま地名に</text>
    <text x="150" y="174" font-size="11.5" fill="#2b2420" text-anchor="middle">「深川」を村名とするよう命じる → 深川村</text>
  </svg>
  <figcaption>深川は川の深さや地形にちなむ名ではなく、開拓者の姓が村の名になったものです。深川神明宮の由緒に伝わる経緯を3段階に並べました。</figcaption>
</figure>`,
  },
  ooyokogawa: {
    html: `<figure class="fig">
  <svg viewBox="0 0 300 250" width="100%" role="img" aria-labelledby="ooyoko-title ooyoko-desc">
    <title id="ooyoko-title">大横川と交差する運河の並びの模式図</title>
    <desc id="ooyoko-desc">北十間川から隅田川まで南北に流れる大横川と、北から順に竪川、小名木川、仙台堀川、平久川が交差する様子を示す模式図。縮尺や正確な位置は表していない。</desc>
    <rect width="300" height="250" fill="#f5efe4"/>
    <text x="20" y="22" font-size="11.5" fill="#6b6259">北（北十間川）</text>
    <line x1="60" y1="32" x2="60" y2="212" stroke="#1b4b43" stroke-width="10" stroke-linecap="round" opacity="0.6"/>
    <text x="20" y="238" font-size="11.5" fill="#6b6259">南（隅田川）</text>
    <text x="78" y="52" font-size="12" font-weight="700" fill="#1b4b43">大横川</text>
    <line x1="60" y1="84" x2="250" y2="84" stroke="#a89f92" stroke-width="5" stroke-linecap="round"/>
    <text x="84" y="76" font-size="12" fill="#2b2420">竪川</text>
    <line x1="60" y1="118" x2="250" y2="118" stroke="#a89f92" stroke-width="5" stroke-linecap="round"/>
    <text x="84" y="110" font-size="12" fill="#2b2420">小名木川</text>
    <line x1="60" y1="152" x2="250" y2="152" stroke="#a89f92" stroke-width="5" stroke-linecap="round"/>
    <text x="84" y="144" font-size="12" fill="#2b2420">仙台堀川</text>
    <line x1="60" y1="186" x2="250" y2="186" stroke="#a89f92" stroke-width="5" stroke-linecap="round"/>
    <text x="84" y="178" font-size="12" fill="#2b2420">平久川</text>
    <text x="150" y="236" font-size="11.5" fill="#6b6259">総延長 6.52km</text>
  </svg>
  <figcaption>大横川は南北の一本の軸として、東西に走る運河と順に交わります。模式図であり、間隔や縮尺は実際の距離を表しません。</figcaption>
</figure>`,
  },
  heikyugawa: {
    html: `<figure class="fig">
  <svg viewBox="0 0 300 170" width="100%" role="img" aria-labelledby="heiku-title heiku-desc">
    <title id="heiku-title">平久川の名が二つの新田から作られた図</title>
    <desc id="heiku-desc">右岸の平井新田の「平」と、左岸の久左衛門新田の「久」を合わせて平久川と名付けられた経緯を示す図。</desc>
    <rect width="300" height="170" fill="#f5efe4"/>
    <rect x="12" y="14" width="124" height="44" rx="3" fill="none" stroke="#1b4b43" stroke-width="2"/>
    <text x="74" y="32" font-size="11" fill="#6b6259" text-anchor="middle">右岸</text>
    <text x="74" y="50" font-size="12.5" font-weight="700" fill="#2b2420" text-anchor="middle"><tspan fill="#b5533c">平</tspan>井新田</text>
    <rect x="164" y="14" width="124" height="44" rx="3" fill="none" stroke="#1b4b43" stroke-width="2"/>
    <text x="226" y="32" font-size="11" fill="#6b6259" text-anchor="middle">左岸</text>
    <text x="226" y="50" font-size="12.5" font-weight="700" fill="#2b2420" text-anchor="middle"><tspan fill="#b5533c">久</tspan>左衛門新田</text>
    <path d="M74 60 L134 100 M226 60 L166 100" stroke="#6b6259" stroke-width="2" fill="none"/>
    <rect x="100" y="100" width="100" height="40" rx="3" fill="#1b4b43" opacity="0.12" stroke="#1b4b43" stroke-width="2"/>
    <text x="150" y="126" font-size="16" font-weight="700" fill="#1b4b43" text-anchor="middle"><tspan fill="#b5533c">平久</tspan>川</text>
    <text x="150" y="160" font-size="11.5" fill="#6b6259" text-anchor="middle">全長 1.13km</text>
  </svg>
  <figcaption>両岸の新田の名から一字ずつ取った名前が、この川が埋め立て地の造成のなかで生まれたことを物語っています。</figcaption>
</figure>`,
  },
  'tomioka-hachimangu': {
    html: `<figure class="fig">
  <svg viewBox="0 0 300 110" width="100%" role="img" aria-labelledby="tomioka-title tomioka-desc">
    <title id="tomioka-title">富岡八幡宮の年表の図</title>
    <desc id="tomioka-desc">寛永4年（1627年）の創建から、深川八幡祭りの始まり、勧進相撲の解禁、伊能忠敬像の建立までの年表。</desc>
    <rect width="300" height="110" fill="#f5efe4"/>
    <line x1="30" y1="54" x2="270" y2="54" stroke="#b9ac94" stroke-width="2.2"/>
    <path d="M270 54 l-8 -4 M270 54 l-8 4" stroke="#b9ac94" stroke-width="2.2" fill="none"/>
    <circle cx="40" cy="54" r="9" fill="#1b4b43"/>
    <text x="40" y="34" font-size="11" font-weight="700" fill="#2b2420" text-anchor="middle">1627</text>
    <text x="40" y="80" font-size="10.5" fill="#2b2420" text-anchor="middle">富岡八幡宮</text>
    <text x="40" y="92" font-size="10.5" fill="#2b2420" text-anchor="middle">創建</text>
    <circle cx="115" cy="54" r="9" fill="#b5533c"/>
    <text x="115" y="34" font-size="11" font-weight="700" fill="#2b2420" text-anchor="middle">1642</text>
    <text x="115" y="80" font-size="10.5" fill="#2b2420" text-anchor="middle">深川八幡祭り</text>
    <text x="115" y="92" font-size="10.5" fill="#2b2420" text-anchor="middle">始まる</text>
    <circle cx="195" cy="54" r="9" fill="#1b4b43"/>
    <text x="195" y="34" font-size="11" font-weight="700" fill="#2b2420" text-anchor="middle">1684</text>
    <text x="195" y="80" font-size="10.5" fill="#2b2420" text-anchor="middle">境内で勧進</text>
    <text x="195" y="92" font-size="10.5" fill="#2b2420" text-anchor="middle">相撲が解禁</text>
    <circle cx="260" cy="54" r="9" fill="#2b2420"/>
    <text x="260" y="34" font-size="11" font-weight="700" fill="#2b2420" text-anchor="middle">2001</text>
    <text x="260" y="80" font-size="10.5" fill="#2b2420" text-anchor="middle">伊能忠敬</text>
    <text x="260" y="92" font-size="10.5" fill="#2b2420" text-anchor="middle">像を建立</text>
  </svg>
  <figcaption>富岡八幡宮は寛永4年（1627年）の創建以来、相撲・祭り・測量という性格の異なる3つの歴史を重ねてきました。貞享元年（1684年）に境内での勧進相撲が解禁され、以後およそ100年にわたり本場所が開かれています。</figcaption>
</figure>`,
  },
  kiba: {
    html: `<figure class="fig">
  <svg viewBox="0 0 300 110" width="100%" role="img" aria-labelledby="kiba-title kiba-desc">
    <title id="kiba-title">木場の移り変わりの年表の図</title>
    <desc id="kiba-desc">明暦の大火をきっかけにした材木置場の移転から、現在地への再移転、防災拠点としての位置づけ、新木場への移転までの年表。</desc>
    <rect width="300" height="110" fill="#f5efe4"/>
    <line x1="30" y1="54" x2="270" y2="54" stroke="#b9ac94" stroke-width="2.2"/>
    <path d="M270 54 l-8 -4 M270 54 l-8 4" stroke="#b9ac94" stroke-width="2.2" fill="none"/>
    <circle cx="40" cy="54" r="9" fill="#b5533c"/>
    <text x="40" y="34" font-size="11" font-weight="700" fill="#2b2420" text-anchor="middle">1657</text>
    <text x="40" y="80" font-size="10.5" fill="#2b2420" text-anchor="middle">明暦の大火</text>
    <text x="40" y="92" font-size="10.5" fill="#2b2420" text-anchor="middle">材木置場を郊外へ</text>
    <circle cx="125" cy="54" r="9" fill="#1b4b43"/>
    <text x="125" y="34" font-size="11" font-weight="700" fill="#2b2420" text-anchor="middle">1701頃</text>
    <text x="125" y="80" font-size="10.5" fill="#2b2420" text-anchor="middle">現在地へ</text>
    <text x="125" y="92" font-size="10.5" fill="#2b2420" text-anchor="middle">再移転</text>
    <circle cx="200" cy="54" r="9" fill="#b5533c"/>
    <text x="200" y="34" font-size="11" font-weight="700" fill="#2b2420" text-anchor="middle">1969</text>
    <text x="200" y="80" font-size="10.5" fill="#2b2420" text-anchor="middle">防災拠点に</text>
    <text x="200" y="92" font-size="10.5" fill="#2b2420" text-anchor="middle">位置づけ</text>
    <circle cx="260" cy="54" r="9" fill="#2b2420"/>
    <text x="260" y="34" font-size="11" font-weight="700" fill="#2b2420" text-anchor="middle">現在</text>
    <text x="260" y="80" font-size="10.5" fill="#2b2420" text-anchor="middle">木場公園・</text>
    <text x="260" y="92" font-size="10.5" fill="#2b2420" text-anchor="middle">親水公園</text>
  </svg>
  <figcaption>約280年にわたって材木を浮かべ続けた貯木場は、昭和44年（1969年）の江東再開発構想で防災拠点と位置づけられ、材木関連業者の新木場移転を経て、今は木場公園・木場親水公園という緑地に変わっています。</figcaption>
</figure>`,
  },
  onagigawa: {
    html: `<figure class="fig">
  <svg viewBox="0 0 300 160" width="100%" role="img" aria-labelledby="ougi-title ougi-desc">
    <title id="ougi-title">扇橋閘門が水位差を調整する仕組みの図</title>
    <desc id="ougi-desc">地盤沈下で生じた最大3mの水位差を、前後の扉で挟んだ閘室の水位を昇降させて調整する断面図。パナマ運河と同じ原理。</desc>
    <rect width="300" height="160" fill="#f5efe4"/>
    <text x="20" y="22" font-size="12" fill="#6b6259">東側（高い）</text>
    <rect x="15" y="30" width="60" height="18" fill="#1b4b43" opacity="0.55"/>
    <text x="230" y="48" font-size="12" fill="#6b6259">西側（低い）</text>
    <rect x="225" y="56" width="60" height="18" fill="#1b4b43" opacity="0.55"/>
    <rect x="75" y="30" width="150" height="44" fill="none" stroke="#b5533c" stroke-width="2"/>
    <text x="150" y="20" font-size="11.5" font-weight="700" fill="#b5533c" text-anchor="middle">閘室（幅11m・長さ110m）</text>
    <line x1="75" y1="30" x2="75" y2="74" stroke="#b5533c" stroke-width="3"/>
    <line x1="225" y1="30" x2="225" y2="74" stroke="#b5533c" stroke-width="3"/>
    <text x="150" y="58" font-size="11" fill="#2b2420" text-anchor="middle">給排水で水位を約2分で調整</text>
    <path d="M70 100 q80 -14 160 0" fill="none" stroke="#6b6259" stroke-width="1.6" stroke-dasharray="3 4"/>
    <text x="150" y="126" font-size="12" font-weight="700" fill="#2b2420" text-anchor="middle">最大水位差 約3m</text>
    <text x="150" y="146" font-size="11" fill="#6b6259" text-anchor="middle">地盤沈下で東西に生じた差を、扉で挟んで通航</text>
  </svg>
  <figcaption>地盤沈下によって小名木川の東側と西側で水位に最大3mの差ができたため、パナマ運河と同じ原理で船を昇降させる「扇橋閘門」が設けられました。前後の扉に挟まれた閘室に船を入れ、給排水で水位を約2分で調整してから反対側へ通します。</figcaption>
</figure>`,
  },
};

export function figureHtml(articleId: string): string | null {
  return figures[articleId]?.html ?? null;
}
