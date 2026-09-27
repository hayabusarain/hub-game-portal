/**
 * サイト統合後のビルド（NEXT_PUBLIC_SITE_ORIGIN あり、静的書き出し）の前処理。npm run build の前に自動で走る（package.json の prebuild）。
 *
 * 姉妹サイトの /api/latest は revalidate 1800 で取っていて（src/lib/sisterSites.ts）、取った中身は .next/cache/fetch-cache に残る。
 * 30分以内に次のビルドを回すと、Next.js は取り直さずにそれを使う（2026-09-27 に確認）。
 * 統合後は、姉妹サイトのデプロイのたびにデプロイフックでポータルを作り直す。続けてデプロイされると、あとのほうの更新が
 * ポータルに出ないまま残るので、ビルドの前にこのキャッシュを消す。
 * 今の Vercel 向けのビルド（環境変数なし）では何もしない（ISR が30分ごとに取り直す）
 */
import fs from 'node:fs';

if (!process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim()) process.exit(0);

const dir = '.next/cache/fetch-cache';
if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`[prebuild_static] ${dir} を消した（姉妹サイトの /api/latest をビルドのたびに取り直すため）`);
}
