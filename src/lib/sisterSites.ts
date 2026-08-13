import { SITE_ORIGINS, type Highlight, type HighlightSite } from '@/data/highlights';

/**
 * 姉妹サイトの「最新情報」を各サイトの公開エンドポイントから取得する。
 *
 * 各サイトが /api/latest で整形済みの JSON を返すので、ポータル側は
 * 相手のデータ源（Supabase なのかリポジトリ内 JSON なのか）を知らなくてよい。
 * 取得に失敗した場合は空配列を返し、呼び出し側が src/data/highlights.ts の
 * 手動ピックだけで表示できるようにしてある（姉妹サイトが落ちてもトップは壊れない）。
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
};

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

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

export async function getLiveHighlights(): Promise<Highlight[]> {
  const sites = Object.keys(ENDPOINTS) as HighlightSite[];

  const results = await Promise.all(
    sites.map(async (site) => {
      try {
        const res = await fetch(ENDPOINTS[site], {
          next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!res.ok) return null;
        return toHighlight(site, (await res.json()) as LatestResponse);
      } catch {
        // 姉妹サイトが未デプロイ・停止中でもトップページは手動ピックで成立させる
        return null;
      }
    })
  );

  return results.filter((h): h is Highlight => h !== null);
}
