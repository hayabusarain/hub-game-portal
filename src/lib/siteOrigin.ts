/**
 * サイト統合（2026-09-27 運営者了承。計画は HoK の docs/CONSOLIDATION_PLAN.md）の切り替え。
 *
 * 統合後は hub-game.com の直下をポータルが、/hok・/mlbb・/wildrift を各サイトが Cloudflare の静的アセットで配る。
 * 統合後のビルドには、4サイト共通で NEXT_PUBLIC_SITE_ORIGIN=https://hub-game.com を渡す
 * （前置きのある3サイトは NEXT_PUBLIC_BASE_PATH も）。ポータルはドメイン直下なので前置きを持たず、
 * **NEXT_PUBLIC_SITE_ORIGIN があることを「統合後のビルド」の合図にする。**
 *
 * 無ければ今の Vercel（サーバーあり、姉妹サイトはサブドメイン）向けのまま。main に入れても今の本番は変わらない。
 * 統合後のビルドで変わるもの:
 * - 静的書き出し（next.config の output: 'export'）。転送とヘッダーは src/app/%5Fredirects・%5Fheaders が書き出す
 * - 姉妹サイトの URL が https://hub-game.com/hok などのパスになる（src/data/highlights.ts の SITE_ORIGINS）
 * - robots.txt が姉妹サイトの Disallow も束ねる。JSON-LD の sameAs から姉妹サイトを外す
 * - Link の先読みと言語の cookie を止める（src/i18n/routing.ts）
 * - 姉妹サイトの /api/latest が取れなければビルドを止める（src/lib/sisterSites.ts）
 */
// 空文字や空白だけの値は「無し」と同じに扱う。?? で受けると、空文字のまま SITE_ORIGIN に入って metadataBase の new URL('') でビルドが落ちる
const RAW_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() ?? '';

export const CONSOLIDATED = RAW_ORIGIN !== '';

/** 静的書き出しかどうか。ポータルでは統合後のビルドと同じ意味 */
export const STATIC_EXPORT = CONSOLIDATED;

/** ポータルのオリジン。統合の前後で値は同じ（https://hub-game.com） */
export const SITE_ORIGIN = RAW_ORIGIN || 'https://hub-game.com';
