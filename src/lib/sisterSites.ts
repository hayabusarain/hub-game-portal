import { cache } from 'react';
import { SITE_ORIGINS, type Highlight, type HighlightSite } from '@/data/highlights';

/**
 * 姉妹サイトの「最新情報」を各サイトの公開エンドポイントから取得する。
 *
 * 各サイトが /api/latest で整形済みの JSON を返すので、ポータル側は
 * 相手のデータ源（Supabase なのかリポジトリ内 JSON なのか）を知らなくてよい。
 * 取得に失敗した場合は空配列を返し、呼び出し側が src/data/highlights.ts の
 * 手動ピックだけで表示できるようにしてある（姉妹サイトが落ちてもトップは壊れない）。
 *
 * 取り出し口は2つある。どちらも取得できなければ null か空配列を返し、
 * 呼び出し側がその部分だけを描かずに済ませる。
 * - getLiveHighlights() … 「最新パッチの注目」カード用。以前からある
 * - getSiteSnapshot()   … 「2タイトルの最新データ」表用。snapshot キーが無い相手には null を返すので、
 *                         対応していないサイトが混ざっても既存の表示は変わらない
 */

/**
 * 取得先のオリジン。既定は本番の姉妹サイトだが、環境変数で差し替えられる。
 * ローカルで姉妹サイトを起動して連動を確認したいときに使う。
 * 例: SISTER_ORIGIN_WILDRIFT=http://localhost:3002
 */
const ENDPOINT_ORIGINS: Record<HighlightSite, string> = {
  wildrift: process.env.SISTER_ORIGIN_WILDRIFT || SITE_ORIGINS.wildrift,
  hok: process.env.SISTER_ORIGIN_HOK || SITE_ORIGINS.hok,
};

const ENDPOINTS: Record<HighlightSite, string> = {
  wildrift: `${ENDPOINT_ORIGINS.wildrift}/api/latest`,
  hok: `${ENDPOINT_ORIGINS.hok}/api/latest`,
};

/** 30分ごとに取り直す。姉妹サイト側も同じ間隔でキャッシュしている */
const REVALIDATE_SECONDS = 1800;

type LatestResponse = {
  path?: unknown;
  date?: unknown;
  ja?: { title?: unknown; body?: unknown };
  en?: { title?: unknown; body?: unknown };
  /** 対応していないサイトでは丸ごと無い。無ければ表を出さないだけで、他の表示には影響しない */
  snapshot?: unknown;
};

/**
 * 姉妹サイトが公開している「掲載データの最新状況」。
 * 数字を画面に出す以上、いつ時点で・どこから来た値かが分からないものは採らない。
 * そのため全項目が揃っているときだけ組み立て、1つでも欠けたら null を返す。
 */
export type SiteSnapshot = {
  site: HighlightSite;
  patch: {
    /** 英語表記の版名（例: August 27 Update） */
    label: string;
    /** 日本語表記の版名（例: 8月27日アップデート） */
    labelJa: string;
    /** YYYY-MM-DD */
    date: string;
    /** そのパッチで調整されたヒーロー数。修正のみのパッチなら 0 もありうる */
    changedHeroes: number;
  };
  catalog: {
    heroes: number;
    items: number;
    spells: number;
    arcana: number;
  };
};
// 相手の /api/latest は snapshot.stats（統計の取得日と出典）も返すが、表からその行を
// 外したので受け取っていない。ここに戻すと、使わない項目が欠けただけで表が丸ごと消える

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** 掲載数として使える値だけを通す（1以上の整数）。0件の一覧は表に出す意味がない */
function toPositiveInt(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
}

/** 調整ヒーロー数だけは 0 を正しい値として扱う（不具合修正だけのパッチがある） */
function toCount(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

/** ISO 日時でも YYYY-MM-DD でも受け取れるようにし、日付部分だけを取り出す */
function toDateOnly(value: unknown): string | null {
  if (!isNonEmptyString(value)) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function toHighlight(site: HighlightSite, data: LatestResponse): Highlight | null {
  const date = toDateOnly(data.date);
  const path = isNonEmptyString(data.path) ? data.path : '/patches';

  // 日英どちらかでも欠けていると表示が崩れるので、揃っているものだけ採用する
  if (
    !date ||
    !isNonEmptyString(data.ja?.title) ||
    !isNonEmptyString(data.ja?.body) ||
    !isNonEmptyString(data.en?.title) ||
    !isNonEmptyString(data.en?.body)
  ) {
    return null;
  }

  return {
    id: `live-${site}-${date}`,
    site,
    path,
    date,
    ja: { title: data.ja.title, body: data.ja.body },
    en: { title: data.en.title, body: data.en.body },
  };
}

/**
 * snapshot を組み立てる。欠けている・型が違う項目が1つでもあれば null。
 * 半端な行が混ざった表を出すくらいなら、表ごと出さないほうがよい。
 */
function toSnapshot(site: HighlightSite, data: LatestResponse): SiteSnapshot | null {
  const snapshot = data.snapshot;
  if (!isRecord(snapshot)) return null;

  const patch = isRecord(snapshot.patch) ? snapshot.patch : null;
  const catalog = isRecord(snapshot.catalog) ? snapshot.catalog : null;
  if (!patch || !catalog) return null;

  const patchDate = toDateOnly(patch.date);
  const changedHeroes = toCount(patch.changedHeroes);
  const heroes = toPositiveInt(catalog.heroes);
  const items = toPositiveInt(catalog.items);
  const spells = toPositiveInt(catalog.spells);
  const arcana = toPositiveInt(catalog.arcana);

  if (
    !patchDate ||
    changedHeroes === null ||
    !isNonEmptyString(patch.label) ||
    !isNonEmptyString(patch.labelJa) ||
    heroes === null ||
    items === null ||
    spells === null ||
    arcana === null
  ) {
    return null;
  }

  return {
    site,
    patch: { label: patch.label, labelJa: patch.labelJa, date: patchDate, changedHeroes },
    catalog: { heroes, items, spells, arcana },
  };
}

/**
 * /api/latest を1回だけ叩く。同じ描画のなかで「最新パッチの注目」と「最新データ」表の
 * 両方から呼ばれるため、react の cache で1リクエストにまとめている。
 */
const fetchLatest = cache(async (site: HighlightSite): Promise<LatestResponse | null> => {
  try {
    const res = await fetch(ENDPOINTS[site], {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as LatestResponse;
  } catch {
    // 姉妹サイトが未デプロイ・停止中でもトップページは成立させる
    return null;
  }
});

export async function getLiveHighlights(): Promise<Highlight[]> {
  const sites = Object.keys(ENDPOINTS) as HighlightSite[];

  const results = await Promise.all(
    sites.map(async (site) => {
      const data = await fetchLatest(site);
      // 手動ピック（src/data/highlights.ts）だけでもトップは成立する
      return data ? toHighlight(site, data) : null;
    })
  );

  return results.filter((h): h is Highlight => h !== null);
}

/** 取得できなければ null。呼び出し側は表そのものを描かない */
export async function getSiteSnapshot(site: HighlightSite): Promise<SiteSnapshot | null> {
  const data = await fetchLatest(site);
  return data ? toSnapshot(site, data) : null;
}
