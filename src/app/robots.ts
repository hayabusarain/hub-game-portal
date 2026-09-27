import { MetadataRoute } from 'next';
import { SITE_DISALLOW, SITE_ORIGINS, liveSites } from '@/data/highlights';
import { CONSOLIDATED, SITE_ORIGIN } from '@/lib/siteOrigin';

/**
 * サイト統合（src/lib/siteOrigin.ts）の後は、姉妹サイトの Disallow もここで束ねる。
 * クローラーが読む robots.txt はドメイン直下の1枚だけで、/hok/robots.txt などは読まれないため。
 * 並べるのは highlights.ts の SITE_DISALLOW に前置き（/hok など）を付けたもの
 */
// 静的書き出し（サイト統合）でもファイルとして出す（今の本番でも静的に生成されている）
export const dynamic = 'force-static';

const sisterDisallow = (): string[] =>
  liveSites().flatMap((s) => SITE_DISALLOW[s].map((p) => `${new URL(SITE_ORIGINS[s]).pathname}${p}`));

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /studio は運営者用の下書き画面。読者向けの中身が無いので検索には出さない
      disallow: CONSOLIDATED ? ['/studio', ...sisterDisallow()] : '/studio',
    },
    // AdSense の審査もクロールもドメイン単位で行われるため、
    // 姉妹サイト（サブドメイン）のサイトマップもルートの robots.txt から参照させる。
    // 未公開のサイトは並べない（存在しない sitemap を指すとクロールエラーになる）。
    // 言語には依らない。日本語だけのサイトでも sitemap は1本あるので載せる。
    // 公開したら highlights.ts の SITE_LOCALES に言語を足すだけでここにも載る。
    // /sitemap.xml はポータルの urlset のまま残す。索引（sitemapindex）に変えると、
    // Search Console に登録済みの URL の中身が変わってしまう
    sitemap: [
      `${SITE_ORIGIN}/sitemap.xml`,
      ...liveSites().map((s) => `${SITE_ORIGINS[s]}/sitemap.xml`),
    ],
  };
}
