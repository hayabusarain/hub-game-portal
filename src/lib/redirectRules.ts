/**
 * 旧 URL からの恒久転送の一覧。next.config の redirects()（今の Vercel）と、
 * src/app/%5Fredirects（サイト統合後の Cloudflare の _redirects）の両方がここを読む。
 * 足すときはここだけを直す（片方だけ直すと、統合の前後で転送が食い違う）
 */
export type RedirectRule = { source: string; destination: string; permanent: boolean };

export const REDIRECTS: RedirectRule[] = [
  // 適性診断は 2026-09-27 に運営者の判断で廃止した。検索に残っている旧 URL は各言語のトップへ送る
  { source: '/:locale(ja|en)/diagnosis', destination: '/:locale', permanent: true },
];
