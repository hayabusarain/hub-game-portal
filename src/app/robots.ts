import { MetadataRoute } from 'next';
import { SITE_ORIGINS, liveSites } from '@/data/highlights';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // AdSense の審査もクロールもドメイン単位で行われるため、
    // 姉妹サイト（サブドメイン）のサイトマップもルートの robots.txt から参照させる。
    // 未公開のサイトは並べない（存在しない sitemap を指すとクロールエラーになる）。
    // 言語には依らない。日本語だけのサイトでも sitemap は1本あるので載せる。
    // 公開したら highlights.ts の SITE_LOCALES に言語を足すだけでここにも載る
    sitemap: [
      'https://hub-game.com/sitemap.xml',
      ...liveSites().map((s) => `${SITE_ORIGINS[s]}/sitemap.xml`),
    ],
  };
}
