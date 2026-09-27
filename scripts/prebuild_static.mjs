/**
 * サイト統合後のビルド（NEXT_PUBLIC_SITE_ORIGIN あり、静的書き出し）の前処理。npm run build の前に自動で走る（package.json の prebuild）。
 *
 * 姉妹サイトの /api/latest は revalidate 1800 で取っていて（src/lib/sisterSites.ts）、取った中身は .next/cache/fetch-cache に残る。
 * 30分以内に次のビルドを回すと、Next.js は取り直さずにそれを使う（2026-09-27 に確認）。
 * 統合後は、姉妹サイトが変わるたびに GitHub Actions（refresh-sister-data）がポータルを作り直す。続けて作り直すと、
 * あとのほうの更新がポータルに出ないまま残るので、ビルドの前にこのキャッシュを消す。
 * 環境変数なしのビルド（統合前の形、手元の確認など）では何もしない
 */
import fs from 'node:fs';

if (!process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim()) process.exit(0);

const dir = '.next/cache/fetch-cache';
if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`[prebuild_static] ${dir} を消した（姉妹サイトの /api/latest をビルドのたびに取り直すため）`);
}
