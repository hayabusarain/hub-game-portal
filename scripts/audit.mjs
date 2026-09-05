/**
 * サイトデータの整合性監査（HoK サイトの scripts/audit.mjs と同じ思想の縮小版）。
 *
 * 使い方: npm run audit
 * 問題があれば一覧表示して exit code 1 で終了する。
 *
 * チェック内容:
 *   1. 翻訳キー差分  … messages/ja.json と en.json のキー構造が一致するか
 *   2. 記事の日付    … articles.ts の日付が YYYY-MM-DD で、updated が published 以降・未来でないか
 *   3. sitemap 網羅  … STATIC_PATHS 全部に lastmod とページがあるか。逆に、page.tsx があるのに
 *                      STATIC_PATHS に無いページや getAlternates を呼んでいないページが無いか
 *   4. 権利表記      … 2タイトルの権利者（Riot / Tencent）が両言語の3キーに入っているか
 *   5. 広告の整合    … プライバシーポリシーが AdSense 利用を書いているなら layout に広告コードがあるか
 *   6. 更新日の鮮度  … messages を触った作業ツリーで、記事・ページの更新日が今日になっているか
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const readJson = (p) => JSON.parse(read(p));

const problems = [];
const report = (check, msg) => problems.push(`[${check}] ${msg}`);

/* ---------- 1. 翻訳キー差分 ---------- */
const ja = readJson('messages/ja.json');
const en = readJson('messages/en.json');
function keysOf(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    // 配列は要素数だけ見る（本文の配列は長さが揃っていれば十分）
    if (Array.isArray(v)) out.push(`${key}[${v.length}]`);
    else if (v && typeof v === 'object') out.push(...keysOf(v, key));
    else out.push(key);
  }
  return out;
}
{
  const jaKeys = new Set(keysOf(ja));
  const enKeys = new Set(keysOf(en));
  for (const k of jaKeys) if (!enKeys.has(k)) report('i18nキー', `en.json に欠落または配列長が違う: ${k}`);
  for (const k of enKeys) if (!jaKeys.has(k)) report('i18nキー', `ja.json に欠落または配列長が違う: ${k}`);
}

/* ---------- 2. 記事の日付 ---------- */
const articlesSrc = read('src/data/articles.ts');
// 掲載日は日本時間で書いている。UTCで数えると朝9時前の作業が前日扱いになり、
// 当日の日付を入れたほうが「未来」で落ちる（sv-SE ロケールが YYYY-MM-DD を返す）
const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const articleBlocks = [...articlesSrc.matchAll(/path:\s*'([^']+)',\s*published:\s*'([^']+)',\s*updated:\s*'([^']+)'/g)];
// 冒頭のコメントにも PAGE_UPDATED の語が出るので、宣言（const ... = {）だけを拾う
const pageUpdated = Object.fromEntries(
  [...(articlesSrc.match(/const PAGE_UPDATED[^=]*=\s*\{([\s\S]*?)\}/)?.[1] ?? '').matchAll(/'([^']*)':\s*'([^']+)'/g)].map((m) => [m[1], m[2]])
);
for (const [, p, published, updated] of articleBlocks) {
  if (!ISO.test(published) || !ISO.test(updated)) report('記事日付', `${p}: 日付が YYYY-MM-DD でない (${published} / ${updated})`);
  if (updated < published) report('記事日付', `${p}: updated (${updated}) が published (${published}) より前`);
  if (updated > today) report('記事日付', `${p}: updated (${updated}) が未来`);
}
for (const [p, d] of Object.entries(pageUpdated)) {
  if (!ISO.test(d)) report('記事日付', `PAGE_UPDATED['${p}']: 日付が YYYY-MM-DD でない (${d})`);
  if (d > today) report('記事日付', `PAGE_UPDATED['${p}']: ${d} が未来`);
}

/* ---------- 3. sitemap 網羅 ---------- */
{
  const sitemapSrc = read('src/app/sitemap.ts');
  const paths = [...(sitemapSrc.match(/STATIC_PATHS\s*=\s*\[([\s\S]*?)\]/)?.[1] ?? '').matchAll(/'([^']*)'/g)].map((m) => m[1]);
  const articlePaths = new Set(articleBlocks.map((m) => m[1]));
  for (const p of paths) {
    if (!articlePaths.has(p) && !(p in pageUpdated)) {
      report('sitemap', `${p || '/'} に更新日が無い（articles.ts の ARTICLES か PAGE_UPDATED に追加する）`);
    }
  }
  // 逆に、存在しないページの日付だけが残っていないか
  const pageDir = path.join(root, 'src/app/[locale]');
  for (const p of paths) {
    const dir = path.join(pageDir, p.replace(/^\//, ''));
    if (!fs.existsSync(path.join(dir, 'page.tsx'))) report('sitemap', `${p || '/'} のページファイルが無い`);
  }

  // 逆方向。ページを足して STATIC_PATHS への追記を忘れると、sitemap に出ず hreflang も出ない。
  // 記事を追加する作業でいちばん起きやすい取りこぼしなので、page.tsx の側から数える。
  // canonical と hreflang の付け忘れも同じ走査で見る。
  // 動的セグメント（[...rest] など）とルートグループは静的パスに出せないので降りない。
  {
    const declared = new Set(paths);
    const inspect = (dir, rel) => {
      const file = path.join(dir, 'page.tsx');
      if (fs.existsSync(file)) {
        if (!declared.has(rel)) {
          report('sitemap', `${rel || '/'} に page.tsx があるのに sitemap.ts の STATIC_PATHS に無い（sitemap に出ず hreflang も出ない）`);
        }
        if (!/getAlternates/.test(fs.readFileSync(file, 'utf8'))) {
          report('sitemap', `${rel || '/'} が @/utils/seo の getAlternates を呼んでいない（canonical と hreflang が出ない）`);
        }
      }
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!e.isDirectory() || e.name.startsWith('[') || e.name.startsWith('(')) continue;
        inspect(path.join(dir, e.name), `${rel}/${e.name}`);
      }
    };
    inspect(pageDir, '');
  }
}

/* ---------- 4. 権利表記 ---------- */
{
  const keys = [['Home', 'disclaimerText'], ['Terms', 'copyrightNote'], ['Disclaimer', 'copyrightsText']];
  for (const [ns, key] of keys) {
    for (const [lang, msgs] of [['ja', ja], ['en', en]]) {
      const text = msgs[ns]?.[key] ?? '';
      if (!/Riot Games/.test(text) || !/Tencent/.test(text)) {
        report('権利表記', `messages/${lang}.json ${ns}.${key} に Riot Games と Tencent の両方が入っていない`);
      }
    }
  }
}

/* ---------- 5. 広告の整合 ---------- */
{
  const layout = read('src/app/[locale]/layout.tsx');
  const hasAds = layout.includes('adsbygoogle.js');
  const claimsAds = /AdSense/.test(ja.Privacy?.adsText ?? '') && /AdSense/.test(en.Privacy?.adsText ?? '');
  if (claimsAds && !hasAds) report('広告', 'プライバシーポリシーは AdSense 利用を書いているが、layout.tsx に adsbygoogle.js が無い');
  if (hasAds && !claimsAds) report('広告', 'layout.tsx に広告コードがあるのに、プライバシーポリシーに AdSense の記述が無い');
  if (hasAds && !layout.includes("gtag('consent', 'default'")) report('広告', '広告コードがあるのに Consent Mode の既定値が無い（EEA 向け配信に必要）');
}

/* ---------- 6. 更新日の鮮度 ---------- */
// messages を変更した作業ツリーなのに、どの記事・ページの更新日も今日になっていなければ上げ忘れ。
// 中身に関係ない作業なら SKIP_FRESHNESS_CHECK=1 で飛ばせる
if (!process.env.SKIP_FRESHNESS_CHECK) {
  let changed = '';
  try {
    changed = execSync('git status --porcelain -- messages src/app src/components src/data', { cwd: root }).toString();
  } catch {
    changed = '';
  }
  const touchedContent = changed.split('\n').some((l) => /messages\/(ja|en)\.json/.test(l));
  if (touchedContent) {
    const dates = [...articleBlocks.map((m) => m[3]), ...Object.values(pageUpdated)];
    if (!dates.includes(today)) {
      report('更新日',
        `messages を変更しているのに、articles.ts のどの updated / PAGE_UPDATED も今日 (${today}) になっていない。` +
        `\n      → 触ったページの日付を上げる。文言に関係ない作業なら SKIP_FRESHNESS_CHECK=1 npm run audit`);
    }
  }
}

/* ---------- 結果 ---------- */
if (problems.length === 0) {
  console.log('✓ 監査OK: 問題は見つかりませんでした');
  process.exit(0);
} else {
  console.error(`✗ 監査NG: ${problems.length} 件の問題`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
