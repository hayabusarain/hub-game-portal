/**
 * ドメイン直下のファイルの監査（2026-11〜、案D。計画は docs/PLAN_D_2026-10-31.md）。
 *
 * 使い方: npm run audit
 * 問題があれば一覧表示して exit code 1 で終了する。
 *
 * ポータルの記事ページを閉じたので、このリポジトリが本番に出すのは root/ と public/ の決まったファイルだけになった。
 * 閉じる前の監査（翻訳キー・記事の日付・sitemap の網羅など7つ）は portal-final-2026-11 のタグにある。
 *
 * チェック内容:
 *   1. ドメイン     … wrangler.jsonc の routes に hub-game.com のカスタムドメインがあるか。消すと /hok と /mlbb も止まる
 *   2. ads.txt      … パブリッシャーIDの行がそのまま入っているか
 *   3. 書き出し     … scripts/build_root.mjs が写すファイルが全部あるか
 *   4. 閉じたサイト … robots.txt・索引・_redirects・HTML に /wildrift と閉じたポータルのページが残っていないか
 *   5. 広告のコード … / と 404 に広告やアクセス解析のコードが無いか。/ に所有権の確認タグがあるか
 *   6. 転送        … /ja・/en が 302 か（301 はブラウザに残り、開け直す妨げになる）
 *   7. 構造化データ … / の JSON-LD が読めて、HoK と MLBB が指す Organization の @id があるか
 */
import fs from 'node:fs';
import path from 'node:path';
import { FILES } from './build_root.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const problems = [];
const report = (check, msg) => problems.push(`[${check}] ${msg}`);

const PUB_ID = 'pub-7201202773518258';
const ORG_ID = 'https://hub-game.com/#organization';

// 1. ドメイン
{
  const wrangler = read('wrangler.jsonc');
  if (!/"pattern"\s*:\s*"hub-game\.com"\s*,\s*"custom_domain"\s*:\s*true/.test(wrangler)) {
    report('ドメイン', 'wrangler.jsonc の routes に { "pattern": "hub-game.com", "custom_domain": true } が無い');
  }
}

// 2. ads.txt
{
  const ads = read('public/ads.txt');
  if (!ads.split(/\r?\n/).some((l) => l.trim() === `google.com, ${PUB_ID}, DIRECT, f08c47fec0942fa0`)) {
    report('ads.txt', `public/ads.txt に「google.com, ${PUB_ID}, DIRECT, f08c47fec0942fa0」の行が無い`);
  }
}

// 3. 書き出し
for (const [from] of FILES) {
  if (!fs.existsSync(path.join(root, from))) report('書き出し', `${from} が無い（scripts/build_root.mjs が写せない）`);
}

// 4. 閉じたサイト。/wildrift は 410、ポータルの /ja・/en の下は 404 なので、どこからも指さない
const TEXT_FILES = ['root/index.html', 'root/404.html', 'root/robots.txt', 'root/sitemap_index.xml', 'root/_redirects'];
for (const f of TEXT_FILES) {
  const body = read(f);
  if (/\/wildrift\b/.test(body)) report('閉じたサイト', `${f} に /wildrift が残っている`);
}
for (const f of ['root/robots.txt', 'root/sitemap_index.xml']) {
  if (/hub-game\.com\/sitemap\.xml/.test(read(f))) report('閉じたサイト', `${f} が閉じたポータルの /sitemap.xml を指している`);
}
for (const f of ['root/index.html', 'root/404.html']) {
  const hrefs = [...read(f).matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const h of hrefs) {
    if (/^(https:\/\/hub-game\.com)?\/(ja|en)(\/|$)/.test(h)) report('閉じたサイト', `${f} が閉じたポータルのページ ${h} を指している`);
  }
}

// 5. 広告のコード。入口だけの画面とエラーページへの広告は、AdSense のポリシーで認められていない
for (const f of ['root/index.html', 'root/404.html']) {
  const body = read(f).replace(/<!--[\s\S]*?-->/g, '');
  for (const word of ['adsbygoogle', 'pagead2.googlesyndication.com', 'googletagmanager.com', 'gtag(']) {
    if (body.includes(word)) report('広告のコード', `${f} に ${word} がある`);
  }
}
if (!read('root/index.html').includes(`<meta name="google-adsense-account" content="ca-${PUB_ID}">`)) {
  report('広告のコード', 'root/index.html に AdSense の所有権の確認タグ（google-adsense-account）が無い');
}

// 6. 転送
{
  const lines = read('root/_redirects').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (const l of lines) {
    const [from, , code] = l.split(/\s+/);
    if (/^\/(ja|en)\/?$/.test(from) && code !== '302') report('転送', `${from} が ${code}（302 にする）`);
    if (from === '/') report('転送', '/ を転送している（/ は運営者のページを 200 で返す）');
  }
}

// 7. 構造化データ
{
  const m = read('root/index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!m) report('構造化データ', 'root/index.html に JSON-LD が無い');
  else {
    try {
      const data = JSON.parse(m[1]);
      const ids = (data['@graph'] ?? []).map((n) => n['@id']);
      if (!ids.includes(ORG_ID)) report('構造化データ', `Organization の @id ${ORG_ID} が無い（HoK と MLBB の publisher がこれを指す）`);
    } catch (e) {
      report('構造化データ', `root/index.html の JSON-LD が読めない: ${e.message}`);
    }
  }
}

if (problems.length) {
  console.error(`監査で ${problems.length} 件の問題が見つかった:\n${problems.map((p) => `  ${p}`).join('\n')}`);
  process.exit(1);
}
console.log('監査: 問題なし（ドメイン直下のファイル 7 項目）');
