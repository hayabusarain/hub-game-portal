import { SITE_ORIGINS, liveSites } from '@/data/highlights';
import { SITE_ORIGIN } from '@/lib/siteOrigin';

/**
 * 4サイトのサイトマップを束ねる索引（2026-09-28〜）。Search Console にはこの1本を出せば4サイト分が読まれる。
 *
 * /sitemap.xml はポータルの urlset のまま残す（索引に変えると、Search Console に登録済みの URL の中身が変わる）。
 * robots.txt も4本を並べているので、この索引を出さなくても Google は4本とも見つける。これは「出すなら1本で済む」ための入口。
 * 並べるのは公開中のサイトだけ（highlights.ts の SITE_LOCALES）。サイトを足したらここにも自動で載る
 */
export const dynamic = 'force-static';

export function GET() {
  const maps = [`${SITE_ORIGIN}/sitemap.xml`, ...liveSites().map((s) => `${SITE_ORIGINS[s]}/sitemap.xml`)];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    maps.map((loc) => `  <sitemap><loc>${loc}</loc></sitemap>`).join('\n') +
    '\n</sitemapindex>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
