import fs from 'node:fs';
import path from 'node:path';
import { REDIRECTS } from '@/lib/redirectRules';
import { routing } from '@/i18n/routing';

/**
 * Cloudflare の _redirects を書き出す（サイト統合後の静的書き出し用、2026-09-27。HoK の同名ルートと同じ作り）。
 *
 * フォルダ名の %5F は「_」。App Router は _ で始まるフォルダをルートにしないので、この書き方で /_redirects を作る。
 * 静的書き出しでは out/_redirects になり、Workers の静的アセットがアセットのフォルダの直下から読む。
 * ポータルはドメイン直下なので前置きは付けない（姉妹サイトのような後処理は要らない）。
 * サーバーのある今の本番（Vercel）では next.config の redirects() と src/proxy.ts が同じ仕事をしているので、この出力は使わない
 * （/_redirects は proxy が言語付きへ送るので、読者に見えることも無い）。
 *
 * 中身:
 * 1. 旧 URL の恒久転送（src/lib/redirectRules.ts）。:locale(ja|en) は ja と en の2行に展開する
 * 2. 言語の付いていない旧 URL（/diagnosis など、今は無いページ）→ 既定の言語の最終の行き先へ1段で
 * 3. 言語の付いていないパス（/guides など）→ 既定の言語。今の本番では proxy がブラウザの言語で振り分けているが、
 *    静的書き出しではできないので既定の言語へ送る。i18n を入れる前の /privacy・/terms・/disclaimer・/contact もここで拾う
 * 4. / → 既定の言語。ふだんは入口のスクリプト（worker/entry.js）がブラウザの言語で先に振り分けるので、ここは予備
 *
 * 並びは「完全一致の行をすべて先、* を含む行を後」。Cloudflare は動的な行が1本でも出ると、
 * それより後の完全一致の行も動的な規則として扱う（HoK で確認）
 */
export const dynamic = 'force-static';

const FALLBACK = routing.defaultLocale;
const LOCALE_SOURCE = '/:locale(ja|en)';

const isDynamic = (source: string) => /[:*]/.test(source);

function lines(): string[] {
  // [locale] の下の最上位のフォルダ（guides・glossary など）。_ ( [ で始まるものはルートにならないので除く
  const segments = fs
    .readdirSync(path.join(process.cwd(), 'src', 'app', '[locale]'), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !/^[_([]/.test(e.name))
    .map((e) => e.name)
    .sort();
  const segmentSet = new Set(segments);

  const all: string[] = [];
  for (const r of REDIRECTS) {
    const status = r.permanent ? 301 : 302;
    // 1. 旧 URL（言語付き）
    for (const locale of routing.locales) {
      all.push(`${r.source.replace(LOCALE_SOURCE, `/${locale}`)} ${r.destination.replace(':locale', locale)} ${status}`);
    }
    // 2. 言語の付いていない旧 URL（今あるフォルダの下は 3 が既定の言語へ送り、そこから 1 が効く）
    if (r.source.startsWith(`${LOCALE_SOURCE}/`)) {
      const rest = r.source.slice(LOCALE_SOURCE.length);
      if (!segmentSet.has(rest.split('/')[1])) all.push(`${rest} ${r.destination.replace(':locale', FALLBACK)} ${status}`);
    }
  }
  // 3. 言語の付いていないパス → 既定の言語
  for (const s of segments) all.push(`/${s} /${FALLBACK}/${s} 302`, `/${s}/* /${FALLBACK}/${s}/:splat 302`);
  // 4. トップ → 既定の言語（予備）
  all.push(`/ /${FALLBACK} 302`);

  const staticLines = all.filter((l) => !isDynamic(l.split(' ')[0]));
  const dynamicLines = all.filter((l) => isDynamic(l.split(' ')[0]));
  return [
    `# 完全一致の行（${staticLines.length} 本）。動的な行より先に置く`,
    ...staticLines,
    `# * を含む行（${dynamicLines.length} 本）`,
    ...dynamicLines,
  ];
}

export function GET() {
  return new Response(lines().join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
