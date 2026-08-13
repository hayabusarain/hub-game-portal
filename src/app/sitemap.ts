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

    // 記事は更新日を持つので lastModified として出す（持たないページは省略）
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
