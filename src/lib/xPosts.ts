import { SITE_LABELS, SITE_ORIGINS, liveSites, type HighlightSite } from '@/data/highlights';
import { getLatestResponse } from '@/lib/sisterSites';

/**
 * 姉妹サイトの更新を X に投稿するための下書きを組み立てる。
 *
 * 投稿そのものは行わない。/studio の画面に文面を並べ、運営者が中身を見てから
 * X の投稿画面を開く。自動で投げないのは、誤った数字をそのまま流さないため。
 *
 * 材料は各サイトの /api/latest だけ（src/lib/sisterSites.ts）。ポータルが数字を
 * 持たないので、サイト側を直せば文面も追従する。値が欠けている種類は作らない。
 */

export type XPostKind = 'patch' | 'stats' | 'data';

export type XPostDraft = {
  /** 投稿済みの記録に使う。日付や版名を含むので、更新が来れば別のIDになる */
  id: string;
  site: HighlightSite;
  kind: XPostKind;
  /** 画面の見出し。投稿文には入らない */
  heading: string;
  /** 投稿本文（URL を除く）。X の投稿画面には text と url を分けて渡す */
  text: string;
  url: string;
  /** X の数え方での長さ。日本語は1文字2、URL は23 */
  weight: number;
};

/** X の上限。全角1文字を2と数えるため、日本語なら実質140文字 */
export const X_LIMIT = 280;

/** URL は実際の長さに関係なく23と数えられる */
const URL_WEIGHT = 23;

/**
 * X の数え方に合わせた長さ。CJK と全角記号は2、それ以外は1。
 * 厳密な仕様（Unicode の範囲表）ではなく、日本語の投稿文で誤差が出ない範囲に絞っている。
 */
export function weighOf(text: string): number {
  let n = 0;
  for (const ch of text) {
    const c = ch.codePointAt(0) ?? 0;
    const wide =
      (c >= 0x1100 && c <= 0x115f) ||
      (c >= 0x2e80 && c <= 0xa4cf) ||
      (c >= 0xac00 && c <= 0xd7a3) ||
      (c >= 0xf900 && c <= 0xfaff) ||
      (c >= 0xfe30 && c <= 0xfe4f) ||
      (c >= 0xff00 && c <= 0xff60) ||
      (c >= 0xffe0 && c <= 0xffe6) ||
      c >= 0x20000;
    n += wide ? 2 : 1;
  }
  return n;
}

/** サイトごとのハッシュタグ。日本語圏で実際に使われている呼び名に合わせる */
const HASHTAGS: Record<HighlightSite, string> = {
  hok: '#オナーオブキングス #HonorOfKings',
  wildrift: '#ワイルドリフト #WildRift',
  mlbb: '#モバイルレジェンド #MLBB',
};

/** 日本語ページのURL。MLBB は日本語のみだが、他の2つも投稿は日本語なので /ja に送る */
const jaUrl = (site: HighlightSite, path: string) => `${SITE_ORIGINS[site]}/ja${path}`;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null);

const dateOnly = (v: unknown): string | null => {
  const s = str(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

/** 「2026-09-10」→「9月10日」。投稿文に年は入れない（その年のうちに読まれるため） */
function toJaDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${Number(m)}月${Number(d)}日`;
}

function draft(site: HighlightSite, kind: XPostKind, id: string, heading: string, body: string, url: string): XPostDraft {
  const text = `${body}\n${HASHTAGS[site]}`;
  return { id, site, kind, heading, text, url, weight: weighOf(text) + 1 + URL_WEIGHT };
}

/** 1サイトぶんの下書き。材料が欠けている種類は飛ばす */
function buildForSite(site: HighlightSite, latest: unknown): XPostDraft[] {
  if (!isRecord(latest)) return [];
  const name = SITE_LABELS[site];
  const snapshot = isRecord(latest.snapshot) ? latest.snapshot : null;
  const patch = snapshot && isRecord(snapshot.patch) ? snapshot.patch : null;
  const catalog = snapshot && isRecord(snapshot.catalog) ? snapshot.catalog : null;
  const stats = snapshot && isRecord(snapshot.stats) ? snapshot.stats : null;
  const siteInfo = snapshot && isRecord(snapshot.site) ? snapshot.site : null;
  const out: XPostDraft[] = [];

  // 1. パッチの反映。要点の一文は /api/latest の ja.title から借りる（使える回だけ。下の条件を参照）
  const patchLabel = patch ? str(patch.labelJa) : null;
  const patchDate = patch ? dateOnly(patch.date) : null;
  const changed = patch && typeof patch.changedHeroes === 'number' ? patch.changedHeroes : null;
  if (patchLabel && patchDate) {
    // latest.path は「最新の注目」の行き先で、統計のページを指していることがある。
    // パッチの投稿はパッチのページへ送る（3サイトとも /ja/patches がある。2026-09-21 に確認）
    const latestPath = str(latest.path) ?? '/patches';
    const path = latestPath.startsWith('/patches') ? latestPath : '/patches';
    const head = `${name}の${patchLabel}を反映しました。`;
    const detail = changed && changed > 0 ? `調整されたヒーローは${changed}体。` : '';
    // ja.title を要点として足せるのは、それがこのパッチの話だと確かめられるときだけ。
    // サイトによっては「最新の注目」が統計の更新を指していて、パッチとは別物のことがある
    const jaTitle = isRecord(latest.ja) ? str(latest.ja.title) : null;
    const aboutThisPatch = latestPath.startsWith('/patches') && dateOnly(latest.date) === patchDate;
    // 「パッチ7.2e の注目ポイント」のような見出し文は、上の1文と重なるだけなので使わない
    const isHeadline = jaTitle ? jaTitle.includes(patchLabel) || jaTitle.length < 12 : true;
    const lead =
      jaTitle && aboutThisPatch && !isHeadline && weighOf(head + detail + jaTitle) + URL_WEIGHT + 40 < X_LIMIT
        ? `${jaTitle}。`
        : '';
    // 版名に日付が入っている回は、見出しで日付を繰り返さない
    const heading = /\d+月\d+日/.test(patchLabel) ? patchLabel : `${patchLabel}（${toJaDate(patchDate)}）`;
    out.push(draft(site, 'patch', `patch-${site}-${patchDate}`, heading, `${head}${detail}${lead}`, jaUrl(site, path)));
  }

  // 2. 統計の更新。stats を返しているサイトだけ（いまは HoK）
  const statsDate = stats ? dateOnly(stats.updatedAt) : null;
  if (statsDate) {
    out.push(
      draft(
        site,
        'stats',
        `stats-${site}-${statsDate}`,
        `統計（${toJaDate(statsDate)}時点）`,
        `${name}のTier表を、${toJaDate(statsDate)}時点の統計に更新しました。勝率・出現率・BAN率を、レーン別に並べています。`,
        jaUrl(site, '/tier-list'),
      ),
    );
  }

  // 3. 掲載データの更新。サイトの最終更新日が変われば別のIDになる
  const siteUpdatedAt = siteInfo ? dateOnly(siteInfo.updatedAt) : null;
  const heroes = catalog && typeof catalog.heroes === 'number' ? catalog.heroes : null;
  const items = catalog && typeof catalog.items === 'number' ? catalog.items : null;
  if (siteUpdatedAt && heroes && items) {
    out.push(
      draft(
        site,
        'data',
        `data-${site}-${siteUpdatedAt}`,
        `掲載データ（${toJaDate(siteUpdatedAt)}更新）`,
        `${name}の掲載データを更新しました。ヒーロー${heroes}体と装備${items}種の数値を、ゲーム内の表示から載せています。`,
        `${SITE_ORIGINS[site]}/ja`,
      ),
    );
  }

  return out;
}

/** 公開中の姉妹サイトぶんの下書き。取得できないサイトは黙って飛ばす */
export async function getXPostDrafts(): Promise<XPostDraft[]> {
  const sites = liveSites();
  const results = await Promise.all(sites.map(async (site) => buildForSite(site, await getLatestResponse(site))));
  return results.flat();
}

/** X の投稿画面を開くURL。本文と URL を分けて渡すと、X 側が末尾に URL を付ける */
export function intentUrl(d: XPostDraft): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(d.text)}&url=${encodeURIComponent(d.url)}`;
}
