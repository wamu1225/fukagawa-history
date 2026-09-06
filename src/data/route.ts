export interface RouteStop {
  id: string;
  order: number;
  name: string;
  area: string;
  whatWasHere: string;
  whatYouSeeToday: string;
  articleId: string;
}

export const routeStops: RouteStop[] = [
  {
    id: 'saito-an',
    order: 1,
    name: '採荼庵跡（さいとあんあと）',
    area: '清澄白河、深川1丁目付近',
    whatWasHere:
      '松尾芭蕉の門人である杉山杉風（さんぷう）の別荘。芭蕉は「おくのほそ道」へ旅立つ前、住まいだった芭蕉庵を人に譲り、しばらくここで過ごした。',
    whatYouSeeToday:
      '海辺橋のたもとに、腰掛けて杖を持つ芭蕉の姿を模した石像と説明板がある小さな児童公園の一角。当時の建物は残っていない。',
    articleId: 'saito-an',
  },
  {
    id: 'fukagawa-edo-museum',
    order: 2,
    name: '深川江戸資料館',
    area: '白河1丁目',
    whatWasHere:
      '江戸時代末期の深川佐賀町（隅田川と小名木川の合流部に近い水運の要衝）そのものではなく、その町並みを実物大で再現した資料館。',
    whatYouSeeToday:
      '土蔵、問屋、船宿、長屋を実寸で復元した屋内展示。掘割に浮かぶ猪牙舟の模型もあり、水路に面した町がどう機能していたかを体感できる。',
    articleId: 'fukagawa-edo-museum',
  },
  {
    id: 'sendaibori',
    order: 3,
    name: '仙台堀川親水公園',
    area: '常盤、平野、清澄',
    whatWasHere: '仙台藩の蔵屋敷などへ米や物資を運んだ運河「仙台堀川」の東側区間。',
    whatYouSeeToday:
      '運河そのものの幅を保ったまま整備された遊歩道と桜並木。歩いている道の広さが、そのままかつての水面の広さになっている。',
    articleId: 'sendaibori-furuishiba',
  },
  {
    id: 'furuishiba',
    order: 4,
    name: '古石場川親水公園',
    area: '牡丹〜古石場',
    whatWasHere: '江戸城の築城石を置いた「石置き場」に由来する一帯を流れていた水路。',
    whatYouSeeToday:
      '牡丹2丁目から古石場2丁目にかけて、住宅街の中を緩やかにカーブしながら伸びる細長い公園。直線的な道路造成では生まれない蛇行の形が残っている。',
    articleId: 'sendaibori-furuishiba',
  },
  {
    id: 'aburabori',
    order: 5,
    name: '油堀川跡（首都高速9号深川線）',
    area: '門前仲町',
    whatWasHere: '両岸に油問屋が集積し、油を運んだ運河「油堀川」。',
    whatYouSeeToday:
      '頭上を走る首都高速9号深川線の高架。高架の脚が並ぶ細長い日陰の敷地（油堀川公園など）が、水路だった頃の川幅をそのまま引き継いでいる。',
    articleId: 'aburabori-shutoko',
  },
  {
    id: 'tomioka-hachimangu',
    order: 6,
    name: '富岡八幡宮',
    area: '富岡、門前仲町',
    whatWasHere:
      '寛永4年（1627年）創建の神社。江戸勧進相撲の発祥地であり、伊能忠敬が測量旅の安全を祈願した場所でもある。',
    whatYouSeeToday:
      '境内に残る横綱力士碑などの相撲関連の碑石群と、大鳥居横に立つ伊能忠敬の銅像。銅像の傍らには測量の基準点も設置されている。',
    articleId: 'tomioka-hachimangu',
  },
  {
    id: 'kiba-park',
    order: 7,
    name: '木場公園',
    area: '木場',
    whatWasHere: '元禄期以降、江戸から東京にかけての建築需要を支えた貯木場（材木の集積地）「木場」。',
    whatYouSeeToday:
      '広大な緑地と防災公園。かつて材木を浮かべて保管していた水面の記憶は、公園内に部分的に残る水辺の風景に見て取れる。',
    articleId: 'kiba',
  },
];
