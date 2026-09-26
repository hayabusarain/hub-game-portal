import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/**
 * 全レスポンスに付けるセキュリティヘッダー。
 * CSP は AdSense のスクリプトを通す必要があり、誤ると広告が表示されなくなるため
 * ここでは入れていない（導入するなら Report-Only から始めること）。
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
  // Next.js のバージョンを露出させない
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // 適性診断は 2026-09-27 に運営者の判断で廃止した。検索に残っている旧 URL は各言語のトップへ送る。
  // Cloudflare へ移したら、同じ規則を public/_redirects に移すこと（静的書き出しでは redirects() が効かない）
  async redirects() {
    return [{ source: '/:locale(ja|en)/diagnosis', destination: '/:locale', permanent: true }];
  },
};

export default withNextIntl(nextConfig);
