/**
 * MLBB Hub を公開済みにする。
 *
 * mlbb.hub-game.com が日本語で 200 を返すことを 2026-09-09 に確かめた
 * （/ は /ja へ 302、sitemap 177件を抜き取りで確認、canonical も独自ドメインを指す）。
 * 引継ぎ（docs/HANDOFF_TO_MLBB_2026-09-08.md）のとおり、書き換えるのはこの1行だけ。
 */
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve(import.meta.dirname, '../src/data/highlights.ts');
const raw = fs.readFileSync(file, 'utf8');

const from = `export const SITE_LOCALES: Record<HighlightSite, string[]> = {
  wildrift: ['ja', 'en'],
  hok: ['ja', 'en'],
  mlbb: [],
};`;
const to = `export const SITE_LOCALES: Record<HighlightSite, string[]> = {
  wildrift: ['ja', 'en'],
  hok: ['ja', 'en'],
  // 2026-09-09 公開。日本語のみ（英語版は畳んである）
  mlbb: ['ja'],
};`;

const hits = raw.split(from).length - 1;
if (hits !== 1) {
  console.log(`★ ${hits}件一致。書き換えていない`);
} else {
  fs.writeFileSync(file, raw.replace(from, to));
  console.log('src/data/highlights.ts: mlbb を [] から ["ja"] にした');
}
