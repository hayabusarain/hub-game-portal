import { routing } from '@/i18n/routing';

/**
 * 構造化データ（JSON-LD）のビルダー。
 * 生成した object は <script type="application/ld+json"> で埋め込む。
 * 埋め込みは src/components/JsonLd.tsx を使う。
 */

const BASE_URL = 'https://hub-game.com';

/** 姉妹サイト。sameAs に並べて同一運営であることを機械可読に示す */
const SISTER_SITES = ['https://wildrift.hub-game.com', 'https://hok.hub-game.com'];

const X_ACCOUNT = 'https://x.com/hub_gamecom';

export const ORGANIZATION_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;

function absoluteUrl(locale: string, path: string): string {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}/${locale}${normalized}`;
}

function inLanguage(locale: string): string {
  return locale === 'ja' ? 'ja-JP' : 'en-US';
}

/** サイト全体の運営者情報。全ページのレイアウトに1回だけ出す */
export function buildOrganization() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'HUB-GAME',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icon-512x512.png`,
      width: 512,
      height: 512,
    },
    // 姉妹サイトと公式アカウントを同一運営として関連付ける
    sameAs: [...SISTER_SITES, X_ACCOUNT],
  };
}

/** サイト自体の情報。運営者と紐づける */
export function buildWebSite(locale: string, siteDescription: string) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'HUB-GAME',
    url: BASE_URL,
    description: siteDescription,
    inLanguage: routing.locales.map(inLanguage),
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export type BreadcrumbItem = { name: string; path: string };

/** パンくず。path はロケールを含まない形（'/guides' など）で渡す */
export function buildBreadcrumb(locale: string, items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

export type ArticleInput = {
  locale: string;
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
};

/** 記事ページ用。日付は ISO（YYYY-MM-DD）で渡す */
export function buildArticle({
  locale,
  path,
  headline,
  description,
  datePublished,
  dateModified,
}: ArticleInput) {
  const url = absoluteUrl(locale, path);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline,
    description,
    inLanguage: inLanguage(locale),
    datePublished,
    dateModified,
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export type GlossaryTerm = { anchor: string; term: string; definition: string };

/** 用語集ページ用。各用語をアンカーIDで個別に参照できるようにする */
export function buildDefinedTermSet(
  locale: string,
  name: string,
  description: string,
  terms: GlossaryTerm[]
) {
  const url = absoluteUrl(locale, '/glossary');
  return {
    '@type': 'DefinedTermSet',
    '@id': `${url}#glossary`,
    name,
    description,
    url,
    inLanguage: inLanguage(locale),
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${url}#${t.anchor}`,
      name: t.term,
      description: t.definition,
      inDefinedTermSet: `${url}#glossary`,
    })),
  };
}

/** 複数のノードを1つの @graph にまとめる */
export function buildGraph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
