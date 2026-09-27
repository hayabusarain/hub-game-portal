/**
 * Cloudflare の _headers を書き出す（サイト統合後の静的書き出し用、2026-09-27。HoK の同名ルートと同じ作り）。
 *
 * フォルダ名の %5F は「_」。静的書き出しでは out/_headers になる。行頭が / の行がパスで、字下げした行がヘッダー。
 * サーバーのある今の本番（Vercel）では next.config の headers() が同じ仕事をしているので、この出力は使わない。
 *
 * セキュリティヘッダー（HSTS など5つ）はここに書かない。姉妹サイトの /hok なども含めてドメイン全体に効かせるものなので、
 * Cloudflare のゾーンの Transform Rules でまとめて付ける（HoK の docs/CONSOLIDATION_PLAN.md の2章）。
 * ここに書いた規則は、ポータルの Worker が配るパスにしか効かない
 */
export const dynamic = 'force-static';

const RULES = `# OGP 画像。Next.js は拡張子の付かない URL（/ja/opengraph-image）で出すので、明示しないと octet-stream として配られ、
# SNS のクローラーが画像として扱わない。ポータルは言語の直下の1枚を全ページが使う
/:locale/opengraph-image
  Content-Type: image/png

# 画像は URL にハッシュが付かない。差し替える運用があるので immutable は使わず、1週間で見直させる（HoK と同じ）
/images/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

# Next.js がハッシュ付きで出すものは、中身が変われば名前も変わる
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`;

export function GET() {
  return new Response(RULES, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
