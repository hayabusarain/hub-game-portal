/**
 * 姉妹サイトの /api/latest が前回から変わったかを見る（GitHub Actions の refresh-sister-data から呼ぶ）。
 *
 * サイト統合（2026-09-27）で、ポータルはサーバーの無い静的書き出しになり、30分ごとの取り直し（ISR）が無くなった。
 * トップの「タイトル別の最新データ」表と「最新パッチの注目」は、ポータルをビルドしたときの /api/latest の値のまま止まる。
 * そこで1時間ごとにこのスクリプトで3サイトの /api/latest を取り、中身のハッシュが前回と違えば記録を書き換える。
 * 記録の変更を main へ push すると、Cloudflare の Workers Builds がポータルを作り直す（数字が新しくなる）。
 *
 * 記録は .github/refresh/sister-latest.json（サイトごとのハッシュだけ。日時は入れない。入れると毎回変わって作り直しが止まらない）。
 * 1サイトでも取れなければ何もしない（取れない間に作り直すと、ポータルのビルドが止まる。src/lib/sisterSites.ts）。
 *
 * 出力（GITHUB_OUTPUT）: changed=true|false、sites=変わったサイトの名前（カンマ区切り）
 */
import crypto from 'node:crypto';
import fs from 'node:fs';

const SITES = ['hok', 'mlbb', 'wildrift'];
const ORIGIN = 'https://hub-game.com';
const RECORD = '.github/refresh/sister-latest.json';

const output = (key, value) => {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  console.log(`${key}=${value}`);
};

const previous = fs.existsSync(RECORD) ? JSON.parse(fs.readFileSync(RECORD, 'utf8')) : {};
const next = {};
for (const site of SITES) {
  try {
    const res = await fetch(`${ORIGIN}/${site}/api/latest`, { headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.text();
    JSON.parse(body); // 壊れた応答で作り直さない
    next[site] = crypto.createHash('sha256').update(body).digest('hex').slice(0, 16);
  } catch (e) {
    console.log(`::warning::${site} の /api/latest が取れない（${e.message}）。今回は作り直さない`);
    output('changed', 'false');
    output('sites', '');
    process.exit(0);
  }
}

const changed = SITES.filter((s) => previous[s] !== next[s]);
if (changed.length) {
  fs.writeFileSync(RECORD, JSON.stringify(next, null, 2) + '\n');
  console.log(`変わった: ${changed.join(', ')}`);
} else {
  console.log('変わっていない');
}
output('changed', changed.length ? 'true' : 'false');
output('sites', changed.join(','));
