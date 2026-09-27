import createNextIntlPlugin from 'next-intl/plugin';
import { REDIRECTS } from './src/lib/redirectRules';

const withNextIntl = createNextIntlPlugin();

/**
 * 全レスポンスに付けるセキュリティヘッダー。
 * CSP は AdSense のスクリプトを通す必要があり、誤ると広告が表示されなくなるため
 * ここでは入れていない（導入するなら Report-Only から始めること）。
 *
 * サイト統合後の静的書き出しでは headers() が効かない。同じ5つは Cloudflare のゾーンの Transform Rules で
 * hub-game.com の全パス（姉妹サイトの /hok なども）にまとめて付ける（HoK の docs/CONSOLIDATION_PLAN.md の2章）
 */
const securityHeaders = [
  // MIME タイプの推測を止める
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // 外部サイトへはオリジンまでしか送らない
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // 他サイトへの iframe 埋め込みを拒否する
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // 使わない機能へのアクセスを明示的に落とす
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  // HTTPS を強制する（本番は常時 TLS 前提）
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // サイト統合（2026-09-27）。NEXT_PUBLIC_SITE_ORIGIN があるときだけ静的書き出しに切り替える（src/lib/siteOrigin.ts）。
  // 無ければ今の Vercel（サーバーあり）向けのまま。ポータルはドメイン直下なので basePath は持たない。
  // 画像の最適化はサーバーが要るので、静的書き出しでは切る（バナー3枚が縮小されずに配られる。/ja で計約277KB）
  ...(process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() ? { output: 'export' as const, images: { unoptimized: true } } : {}),
  // Next.js のバージョンを露出させない
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // 旧 URL の転送。一覧は src/lib/redirectRules.ts（静的書き出しの _redirects と共通）
  async redirects() {
    return REDIRECTS;
  },
};

export default withNextIntl(nextConfig);
