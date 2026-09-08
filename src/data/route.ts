export interface RouteStop {
  id: string;
  order: number;
  name: string;
  area: string;
  category: 'canal' | 'context';
  whatWasHere: string;
  whatYouSeeToday: string;
  articleId: string;
  lat: number;
  lng: number;
}

// 緯度経度は公表されている駅・施設の座標、または住所（丁目）と徒歩分数から
// 実在の地点に対して概算した値。測量精度の座標ではなく、実座標にもとづく
// 相対位置の目安として扱う（詳細は figures-data.ts のmap図キャプション参照）。
export const routeStops: RouteStop[] = [
  {
    id: 'onagigawa',
    order: 1,
    name: '小名木川',
    area: '清澄白河の北側',
    category: 'canal',
    whatWasHere: '慶長年間、徳川家康の命で小名木四郎兵衛が開削した、行徳の塩を運ぶための運河。江戸時代の川幅は隅田川口で20間（約36m）。',
    whatYouSeeToday: '埋め立てられていない、今も現役の一級河川。全長約5kmにわたって水面が続き、遊覧船が行き交う。',
    articleId: 'onagigawa',
    lat: 35.6798,
    lng: 139.7975,
  },
  {
    id: 'saito-an',
    order: 2,
    name: '採荼庵跡（さいとあんあと）',
    area: '清澄白河、深川1丁目付近',
    category: 'context',
    whatWasHere: '松尾芭蕉が「おくのほそ道」へ旅立つ前に身を寄せた、門人である杉山杉風の別荘。旅立ちは舟で小名木川から隅田川へ出る水路だった。',
    whatYouSeeToday: '海辺橋のたもとに、腰掛けて杖を持つ芭蕉の姿を模した石像と説明板がある小さな児童公園の一角。',
    articleId: 'saito-an',
    lat: 35.6805,
    lng: 139.7982,
  },
  {
    id: 'fukagawa-edo-museum',
    order: 3,
    name: '深川江戸資料館',
    area: '白河1丁目',
    category: 'context',
    whatWasHere:
      '江戸時代末期の深川佐賀町、隅田川と小名木川の合流部に近い水運の要衝を実物大で再現した資料館。運河そのものではないが、運河に面した町がどう機能していたかを伝える。',
    whatYouSeeToday:
      '土蔵、問屋、船宿、長屋を実寸で復元した屋内展示。掘割に浮かぶ猪牙舟の模型もある。',
    articleId: 'fukagawa-edo-museum',
    lat: 35.6811,
    lng: 139.7988,
  },
  {
    id: 'sendaibori',
    order: 4,
    name: '仙台堀川親水公園',
    area: '清澄〜東陽',
    category: 'canal',
    whatWasHere: '仙台藩をはじめとする諸藩の蔵屋敷へ米や物資を運んだ運河。延長3.7km、面積10.4haは都内最大級の親水公園として整備された区間の元の姿。',
    whatYouSeeToday: '運河そのものの幅を保ったまま整備された遊歩道と桜並木。',
    articleId: 'sendaibori-furuishiba',
    lat: 35.6735,
    lng: 139.8065,
  },
  {
    id: 'furuishiba',
    order: 5,
    name: '古石場川親水公園',
    area: '牡丹〜古石場',
    category: 'canal',
    whatWasHere: '江戸城の築城石を置いた「石置き場」に由来する一帯を流れていた水路。延長0.8km、面積1.6ha。',
    whatYouSeeToday: '牡丹2丁目から古石場2丁目にかけて、住宅街の中を緩やかにカーブしながら伸びる細長い公園。',
    articleId: 'sendaibori-furuishiba',
    lat: 35.6715,
    lng: 139.8028,
  },
  {
    id: 'aburabori',
    order: 6,
    name: '油堀川跡（首都高速9号深川線）と和倉橋親柱',
    area: '門前仲町',
    category: 'canal',
    whatWasHere: '別名「十五間川」。川幅24〜30m（十五間はおよそ27m）、全長約1,670m。元禄12年（1699年）に開削され、両岸に油問屋が集まった。',
    whatYouSeeToday: '頭上を走る首都高速9号深川線の高架。富岡八幡宮の北側、高架下には昭和4年（1929年）竣工の和倉橋の親柱2基が、江東区指定の文化財として今も保存されている。',
    articleId: 'aburabori-shutoko',
    lat: 35.6716,
    lng: 139.7975,
  },
  {
    id: 'tomioka-hachimangu',
    order: 7,
    name: '富岡八幡宮',
    area: '富岡、門前仲町',
    category: 'context',
    whatWasHere: '寛永4年（1627年）創建の神社。江戸勧進相撲の発祥地であり、伊能忠敬が測量旅の安全を祈願した場所。和倉橋跡のすぐ南に位置する。',
    whatYouSeeToday: '境内に残る横綱力士碑などの相撲関連の碑石群と、大鳥居横に立つ伊能忠敬の銅像。',
    articleId: 'tomioka-hachimangu',
    lat: 35.6719,
    lng: 139.7996,
  },
  {
    id: 'ogyoku-heikyu',
    order: 8,
    name: '大横川と平久川',
    area: '木場の西側',
    category: 'canal',
    whatWasHere: '大横川は竪川、小名木川、仙台堀川、平久川と交差しながら南北に流れる運河。平久川は右岸の平井新田、左岸の久左衛門新田という開発地の名から名付けられた。',
    whatYouSeeToday: 'どちらも埋め立てられず今も水面が続く現役の川。大横川沿いは桜の名所として知られる。',
    articleId: 'ogyoku-heikyu',
    lat: 35.6740,
    lng: 139.8055,
  },
  {
    id: 'kiba-park',
    order: 9,
    name: '木場公園',
    area: '木場',
    category: 'canal',
    whatWasHere: '元禄期以降、材木を浮かべて保管した貯木場。広大な水面と、材木を運ぶための掘割「大島川東支川」などを持っていた。',
    whatYouSeeToday: '広大な緑地と防災公園（木場公園）。すぐそばの「木場親水公園」では、貯木場の掘割そのものを整備し直した水路と、川並の像や木製の太鼓橋が残る。',
    articleId: 'kiba',
    lat: 35.6732,
    lng: 139.8084,
  },
];
