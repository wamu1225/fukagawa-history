// 記事一覧の まとまり（読む順）。一覧のページと prerender の両方が使う（2026-11-07 監督）
export const ARTICLE_GROUPS: { title: string; lead: string; ids: string[] }[] = [
  { title: 'はじめに：地名と成り立ち', lead: '名前の由来と、埋め立てで町ができるまで。', ids: ['chimei', 'fukagawa-origin'] },
  { title: '運河をたどる', lead: 'いまも流れる川と、公園や高速道路に姿を変えた川。', ids: ['onagigawa', 'sendaibori-furuishiba', 'aburabori-shutoko', 'ooyokogawa', 'heikyugawa'] },
  { title: '木場と町の暮らし', lead: '材木の町、資料館の町並み、深川めし。', ids: ['kiba', 'fukagawa-edo-museum', 'fukagawa-meshi'] },
  { title: '芭蕉と八幡さま', lead: '旅立ちの庵と、相撲の記憶が残る神社。', ids: ['saito-an', 'tomioka-hachimangu'] },
  { title: 'よくある誤解', lead: '運河の名前、木場、辰巳芸者。', ids: ['faq'] },
];
