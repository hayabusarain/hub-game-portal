/**
 * ポータルの書き出し（2026-11〜、案D。計画は docs/PLAN_D_2026-10-31.md）。npm run build で走る。
 *
 * ポータルの記事ページは閉じ、このリポジトリは hub-game.com の直下に置くファイルだけを受け持つ。
 * ここに並べたファイルを out/ に写すだけで、Next.js の src/ は使わない。
 * 閉じる前のポータル（Next.js の書き出し）は portal-final-2026-11 のタグにある。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'out');

// [元のファイル, out/ の中の名前]
export const FILES = [
  ['root/index.html', 'index.html'],
  ['root/404.html', '404.html'],
  ['root/robots.txt', 'robots.txt'],
  ['root/sitemap_index.xml', 'sitemap_index.xml'],
  ['root/_redirects', '_redirects'],
  // ads.txt は AdSense の審査と配信で読まれる。中身は監査が見張る
  ['public/ads.txt', 'ads.txt'],
  // 昔のポータルの Service Worker を外す掃除用。昔の端末が取りに来るので残す
  ['public/sw.js', 'sw.js'],
  // Google の検索結果のファビコンは、ホスト名の / のページが指すものが使われる
  ['src/app/icon.png', 'icon.png'],
  ['src/app/apple-icon.png', 'apple-icon.png'],
  ['public/icon-192x192.png', 'icon-192x192.png'],
  ['public/icon-512x512.png', 'icon-512x512.png'],
];

// 直接実行されたときだけ書き出す（監査が FILES を読むために import する）
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT);
  for (const [from, to] of FILES) fs.copyFileSync(path.join(ROOT, from), path.join(OUT, to));
  console.log(`[build_root] ${FILES.length} 個のファイルを out/ に書き出した`);
}
