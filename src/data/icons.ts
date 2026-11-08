// つかみの部品に添える線画アイコン（2026-11-08 ユーザー「アイコン使うとか」）。絵文字は使いません。
// どれも同じ太さの線画（24x24・stroke 1.8）。主題を見分けるためだけに使い、飾りとしては増やしません。
// 画面の読み上げでは文字の方を読ませるので aria-hidden にします。

const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const ICONS = {
  // 地名＝地図のピン
  pin: svg('<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'),
  // 成り立ち（年表）＝砂時計
  hourglass: svg('<path d="M6 3h12M6 21h12"/><path d="M7 3v2c0 3 5 5 5 7s-5 4-5 7v2M17 3v2c0 3-5 5-5 7s5 4 5 7v2"/><path d="M10 18.5h4"/>'),
  // 運河＝舟と波線
  canal: svg('<path d="M4 12h16l-2.5 3.5h-11z"/><path d="M12 12V6l4 3h-4"/><path d="M3 19c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>'),
  // 閘門＝扉に挟まれた高い水面と低い水面
  lock: svg('<path d="M8 4v16M16 4v16"/><path d="M3 9h5M16 14h5"/><path d="M8 11h8"/><path d="M11 6.5l1-1.5 1 1.5M11 15.5l1 1.5 1-1.5"/>'),
  // 運河跡の高架＝橋脚の並ぶ高架
  viaduct: svg('<path d="M3 8h18"/><path d="M3 11h18"/><path d="M6 11v6M12 11v6M18 11v6"/><path d="M3 20c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>'),
  // 桜並木＝五弁の花
  sakura: svg('<circle cx="12" cy="12" r="1.2"/>' + [0, 72, 144, 216, 288].map((a) => `<path d="M12 10.5c-1.8-1.6-2-4.4 0-6.5 2 2.1 1.8 4.9 0 6.5z" transform="rotate(${a} 12 12)"/>`).join('')),
  // 芭蕉＝旅の笠
  hat: svg('<path d="M2.5 15.5L12 6l9.5 9.5z"/><path d="M6 15.5c1 2 3.4 3 6 3s5-1 6-3"/><path d="M12 6v-1.5"/>'),
  // 資料館の町並み＝瓦屋根の家
  house: svg('<path d="M3 11L12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'),
  // 神社＝鳥居
  torii: svg('<path d="M3 5c3 1 15 1 18 0"/><path d="M5 9h14"/><path d="M7 6v15M17 6v15"/><path d="M12 6v3"/>'),
  // 木場＝積んだ材木
  timber: svg('<circle cx="7" cy="16" r="3.2"/><circle cx="17" cy="16" r="3.2"/><circle cx="12" cy="9.5" r="3.2"/><circle cx="7" cy="16" r=".6"/><circle cx="17" cy="16" r=".6"/><circle cx="12" cy="9.5" r=".6"/><path d="M3 21h18"/>'),
  // 名物＝お椀と箸
  bowl: svg('<path d="M3 12h18c0 4.5-4 8-9 8s-9-3.5-9-8z"/><path d="M9 20v1h6v-1"/><path d="M14 3l-3 7M19 4l-5 6"/>'),
  // よくある誤解＝丸の中の問い
  question: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6v.6"/><path d="M12 17.2v.1"/>'),
} as const;

export type IconName = keyof typeof ICONS;

// 記事ごとのアイコン（その記事の中身に合わせる）
export const ARTICLE_ICON: Record<string, IconName> = {
  chimei: 'pin',
  'fukagawa-origin': 'hourglass',
  onagigawa: 'canal',
  'saito-an': 'hat',
  'fukagawa-edo-museum': 'house',
  'sendaibori-furuishiba': 'canal',
  'aburabori-shutoko': 'viaduct',
  'tomioka-hachimangu': 'torii',
  ooyokogawa: 'canal',
  heikyugawa: 'canal',
  kiba: 'timber',
  'fukagawa-meshi': 'bowl',
  faq: 'question',
};

export function articleIcon(id: string): string {
  return ICONS[ARTICLE_ICON[id] ?? 'canal'];
}
