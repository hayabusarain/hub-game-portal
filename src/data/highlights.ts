/**
 * トップページの「最新パッチの注目」に出す姉妹サイトのピックアップ（手動分）。
 *
 * パッチノートの最新情報は各サイトの /api/latest から自動取得するので、
 * ここには書かない（src/lib/sisterSites.ts）。このファイルに置くのは、
 * 自動取得の対象にならない「いつ見ても価値のあるページ」の紹介だけ。
 *
 * 運用: 紹介したいページが増えたらこの配列の先頭に足す。
 * 表示は date の新しい順に並び替えて上位 N 件だけを出すため、古いエントリは
 * 消さずに残しておいてよい（履歴としてそのまま蓄積できる）。
 * 同じ日付のものは配列の並び順どおりに出るので、2サイトを交互に並べておくと
 * トップページで偏りなく見える。
 *
 * date は「ポータルで紹介した日」を指す。元記事の公開日ではないので、
 * 同じページを再度取り上げたいときは新しい date でエントリを足せばよい。
 */

export type HighlightSite = 'wildrift' | 'hok';

export type Highlight = {
  /** 重複を避けるための一意なID（表示には使わない） */
  id: string;
  site: HighlightSite;
  /** ロケールを除いたパス。URL は site + locale + path で組み立てる */
  path: string;
  /** YYYY-MM-DD。ポータルで紹介した日 */
  date: string;
  en: { title: string; body: string };
  ja: { title: string; body: string };
};

export const SITE_ORIGINS: Record<HighlightSite, string> = {
  wildrift: 'https://wildrift.hub-game.com',
  hok: 'https://hok.hub-game.com',
};

export const SITE_LABELS: Record<HighlightSite, string> = {
  wildrift: 'Wild Rift',
  hok: 'Honor of Kings',
};

export const highlights: Highlight[] = [
  {
    id: 'hok-item-usage-2026-08-26',
    site: 'hok',
    path: '/items/usage',
    date: '2026-08-26',
    en: {
      title: 'Item pick rates from 226 popular builds',
      body: 'Which of the 114 items actually get built across all 116 heroes, filterable by role and lane. A quick read on what the current meta is buying.',
    },
    ja: {
      title: '装備採用率ランキング（人気ビルド226通り）',
      body: '116体の人気ビルドを集計し、114種の装備がどれだけ組まれているかをロール別・レーン別に確認できます。今の環境で買われている装備が一目で分かります。',
    },
  },
  {
    id: 'wr-encyclopedia-2026-08-26',
    site: 'wildrift',
    path: '/encyclopedia',
    date: '2026-08-26',
    en: {
      title: 'Wild Rift glossary: crowd control, waves and objectives',
      body: 'How each crowd-control effect behaves, wave management such as freezing and slow pushing, teamfight formations, and how to play around dragons and Baron.',
    },
    ja: {
      title: 'ワイリフ大辞典：CC・ウェーブ管理・オブジェクト',
      body: 'スタンやノックアップなどCCの仕様、フリーズやスロープッシュといったウェーブ管理、ドラゴンとバロンの扱い方を項目ごとに解説しています。',
    },
  },
  {
    id: 'wr-tier-list',
    site: 'wildrift',
    path: '/tier-list',
    date: '2026-08-13',
    en: {
      title: 'Wild Rift tier list, rebuilt for the current patch',
      body: 'Rankings by lane with win-rate data, so you can see which picks actually hold up in the current meta rather than which ones simply look strong.',
    },
    ja: {
      title: 'ワイルドリフト Tier表（現行パッチ対応）',
      body: 'レーン別のランキングを勝率データ付きで掲載。見た目の強さではなく、現環境で実際に勝てているピックが分かります。',
    },
  },
  {
    id: 'hok-tier-list',
    site: 'hok',
    path: '/tier-list',
    date: '2026-08-13',
    en: {
      title: 'Honor of Kings tier list by role',
      body: 'Where every hero currently sits, split by role, with the reasoning behind each placement so you know what to pick up next.',
    },
    ja: {
      title: 'オナー・オブ・キングス ロール別Tier表',
      body: '全ヒーローの現在の評価をロール別に整理。順位の理由まで書いてあるので、次に練習するヒーロー選びに使えます。',
    },
  },
  {
    id: 'wr-calculator',
    site: 'wildrift',
    path: '/calculator',
    date: '2026-08-13',
    en: {
      title: 'Damage calculator for build comparisons',
      body: 'Put two builds side by side and see the damage difference before you spend the gold in a real game.',
    },
    ja: {
      title: 'ビルド比較用のダメージ計算機',
      body: '2つのビルドを並べてダメージ差を確認できます。実戦でゴールドを使う前に、どちらが伸びるか試せます。',
    },
  },
  {
    id: 'hok-arcana',
    site: 'hok',
    path: '/arcana',
    date: '2026-08-13',
    en: {
      title: 'Arcana pages that carry the early game',
      body: 'Arcana decide how your first few levels feel. This breaks down which pages are worth building first when you cannot afford them all.',
    },
    ja: {
      title: '序盤を左右する紋章の組み方',
      body: '紋章は序盤の手触りをほぼ決めます。全部は揃えられない前提で、どのページから作るべきかを整理しています。',
    },
  },
];

/**
 * date の新しい順に並べて上位 limit 件を返す。
 * 同じ日付のものは配列の並び順を保つ（sort が安定ソートであることを利用）。
 * つまり同日に複数足すときは、見せたい順に並べておけばそのまま出る。
 */
export function getLatestHighlights(limit = 4): Highlight[] {
  return [...highlights]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function buildHighlightUrl(highlight: Highlight, locale: string): string {
  return `${SITE_ORIGINS[highlight.site]}/${locale}${highlight.path}`;
}
