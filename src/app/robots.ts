import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // AdSense の審査もクロールもドメイン単位で行われるため、
    // 姉妹サイト（サブドメイン）のサイトマップもルートの robots.txt から参照させる
    sitemap: [
      'https://hub-game.com/sitemap.xml',
      'https://wildrift.hub-game.com/sitemap.xml',
      'https://hok.hub-game.com/sitemap.xml',
    ],
  };
}
