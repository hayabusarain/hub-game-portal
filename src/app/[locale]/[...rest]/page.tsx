import { notFound } from 'next/navigation';
import { STATIC_EXPORT } from '@/lib/siteOrigin';

// ロケール配下の未知のパスをすべて 404（not-found.tsx）へ流す catch-all。
// これが無いと未知のURLはロケールレイアウトを通らず、
// ナビ無しのルート側デフォルト404が表示されてしまう。
export default function CatchAllPage() {
  notFound();
}

/**
 * サイト統合後の静的書き出し（src/lib/siteOrigin.ts）でだけ置く。動的なルートに書き出す値が無いとビルドが止まるため。
 * /ja/404 と /en/404 だけを書き出し、Cloudflare が「いちばん近い 404.html」として /ja/xxx などに返す
 * （wrangler.jsonc の not_found_handling: 404-page）。これでナビ付きの各言語の 404 が出る。
 *
 * 今の本番（Vercel）では undefined にして、置く前と同じ「その場で描く」ルートのままにする。
 * 関数を置くとルートが SSG 扱いになり、/ja/xxx のような未知のパスの 404 がパスごとに1年キャッシュされる
 * （2026-09-27 に next start で確認。空の配列を返しても同じ）。dynamicParams = false はナビの無い英語の 404 に、
 * connection() で動的に戻すと 500 になった
 */
export const generateStaticParams = STATIC_EXPORT ? () => [{ rest: ['404'] }] : undefined;
