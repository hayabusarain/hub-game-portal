import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getLastModified } from '@/data/articles';

const BASE_URL = 'https://hub-game.com';

// 公開中の静的パス（ロケールプレフィックスなし）。ページを足したらここにも追加する
const STATIC_PATHS = [
  '',
  '/guides',
  '/guides/compare',
  '/guides/what-is-moba',
  '/guides/wild-rift',
  '/guides/honor-of-kings',
  '/guides/term-mapping',
  '/diagnosis',
  '/glossary',
  '/about',
  '/contact',
  '/disclaimer',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    const isHome = path === '';

    // hreflang 用の言語別 URL を生成する
    const alternatesLanguages: Record<string, string> = {};
    for (const l of routing.locales) {
      alternatesLanguages[l] = `${BASE_URL}/${l}${path}`;
    }
    // 言語を判定できない訪問者向けの既定はデフォルトロケール
    alternatesLanguages['x-default'] = `${BASE_URL}/${routing.defaultLocale}${path}`;

    // 記事は articles.ts の updated、それ以外は PAGE_UPDATED から更新日を出す。
    // 全URLに lastmod を付け、更新中のサイトであることをクローラーに示す
    const lastModified = getLastModified(path);

    for (const locale of routing.locales) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${path}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: isHome ? 'weekly' : 'monthly',
        priority: isHome ? 1.0 : 0.8,
        alternates: {
          languages: alternatesLanguages,
        },
      });
    }
  }

  return sitemapEntries;
}
