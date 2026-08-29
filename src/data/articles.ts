/**
 * 記事の公開日・更新日を1か所で管理する。
 *
 * 以前は messages の中に「投稿日: 2026年7月」のような表示用文字列を
 * 日英それぞれ持たせていたため、片方だけ直す事故が起きやすく、
 * 構造化データや sitemap に流せる機械可読な日付も無かった。
 * ここを唯一の情報源にして、表示・JSON-LD・sitemap すべてを賄う。
 *
 * 記事を更新したら updated を直すこと（published は最初の公開日のまま）。
 * 記事以外のページも PAGE_UPDATED に更新日を持ち、sitemap の lastmod に出す。
 * 上げ忘れは npm run audit が検知する（messages を触ったのに日付が古い場合）。
 */

export type ArticleSlug = 'what-is-moba' | 'honor-of-kings' | 'wild-rift' | 'compare' | 'term-mapping';

export type ArticleMeta = {
  /** ロケールを含まないパス */
  path: string;
  /** YYYY-MM-DD */
  published: string;
  /** YYYY-MM-DD。未更新なら published と同じ */
  updated: string;
};

export const ARTICLES: Record<ArticleSlug, ArticleMeta> = {
  'what-is-moba': {
    path: '/guides/what-is-moba',
    published: '2026-07-01',
    updated: '2026-08-26',
  },
  'honor-of-kings': {
    path: '/guides/honor-of-kings',
    published: '2026-07-01',
    updated: '2026-08-28',
  },
  'wild-rift': {
    path: '/guides/wild-rift',
    published: '2026-07-01',
    updated: '2026-08-26',
  },
  compare: {
    path: '/guides/compare',
    published: '2026-07-01',
    updated: '2026-08-28',
  },
  'term-mapping': {
    path: '/guides/term-mapping',
    published: '2026-08-26',
    updated: '2026-08-28',
  },
};

/**
 * 記事以外のページの更新日（YYYY-MM-DD）。
 * 内容を変えたらその日に上げる。法的ページも権利表記の変更などで動く。
 */
export const PAGE_UPDATED: Record<string, string> = {
  '': '2026-08-29',
  '/guides': '2026-08-26',
  '/diagnosis': '2026-08-29',
  '/glossary': '2026-08-28',
  '/about': '2026-08-26',
  '/contact': '2026-08-13',
  '/disclaimer': '2026-08-26',
  '/privacy': '2026-08-26',
  '/terms': '2026-08-26',
};

/** sitemap の lastModified に使う。記事は updated、それ以外は PAGE_UPDATED から引く */
export function getLastModified(path: string): string | undefined {
  const found = Object.values(ARTICLES).find((a) => a.path === path);
  return found?.updated ?? PAGE_UPDATED[path];
}

/** 「2026年7月1日」「July 1, 2026」のようにロケールに合わせて整形する */
export function formatArticleDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}
