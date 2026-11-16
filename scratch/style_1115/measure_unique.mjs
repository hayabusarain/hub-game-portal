// ページ固有の文と、他ページと共通の文を数える（11/7 の測り方と同じ）。
// <main> の中から表・ボタン・ラベル・SVG・フォーム・ナビを除き、
// 「。」で終わる文か20字以上の行を読み物の文とする。数字は伏せて比べる。
// 比べる範囲は、同じサイト・同じ言語のページどうし。
// 使い方: node measure_unique.mjs <ページを保存したフォルダ>（ファイル名は hok__ja__tier-list.html の形）
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));

const strip = (html) => {
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  let s = m ? m[0] : '';
  for (const tag of ['script', 'style', 'svg', 'table', 'button', 'label', 'nav', 'form', 'select', 'noscript', 'template']) {
    s = s.replace(new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`, 'gi'), '\n');
  }
  s = s.replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/dt|\/dd|\/section|\/article|\/summary|\/details|\/figcaption|\/blockquote)[^>]*>/gi, '\n');
  s = s.replace(/<[^>]+>/g, '');
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
  return s;
};

const sentencesOf = (text) => {
  const out = [];
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line) continue;
    for (const p of line.split(/(?<=。)/)) {
      const t = p.trim();
      if (!t) continue;
      if (t.endsWith('。') || t.length >= 20) out.push(t);
    }
  }
  return out;
};

const mask = (t) => t.replace(/[0-9０-９]+([.,][0-9]+)*/g, '#');

const pages = files.map((f) => {
  const name = f.replace(/\.html$/, '').replace(/__/g, '/');
  const [site, lang, ...rest] = name.split('/');
  const sents = sentencesOf(strip(fs.readFileSync(path.join(dir, f), 'utf8')));
  const uniq = [...new Map(sents.map((s) => [mask(s), s])).entries()];
  let group;
  if (rest.length === 0) group = '(トップ)';
  else if (rest.length === 1) group = rest[0];
  else group = `${rest[0]}/*${rest.length > 2 ? '/*' : ''}`;
  return { name, scope: `${site}/${lang}`, group, sents: uniq };
});

const count = new Map();
for (const p of pages) for (const [k] of p.sents) { const key = `${p.scope}\u0000${k}`; count.set(key, (count.get(key) || 0) + 1); }

for (const p of pages) {
  let total = 0, own = 0;
  for (const [k, s] of p.sents) { total += s.length; if (count.get(`${p.scope}\u0000${k}`) === 1) own += s.length; }
  p.total = total; p.own = own; p.sharedPct = total ? Math.round((1 - own / total) * 100) : null;
}

const groups = new Map();
for (const p of pages) { const k = `${p.scope}  ${p.group}`; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(p); }
const median = (a) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[Math.floor((b.length - 1) / 2)] : 0; };
const rows = [];
for (const [k, ps] of groups) {
  rows.push({ group: k, n: ps.length, medTotal: median(ps.map((p) => p.total)), medOwn: median(ps.map((p) => p.own)), medShared: median(ps.map((p) => p.sharedPct ?? 100)), own0: ps.filter((p) => p.own === 0).length, shared85: ps.filter((p) => (p.sharedPct ?? 100) >= 85).length });
}
rows.sort((a, b) => b.n - a.n);
console.log('範囲  種類\tページ数\t読み物の字数(中央値)\t固有の字数(中央値)\t共通の割合%(中央値)\t固有0字\t共通85%以上');
for (const r of rows) console.log(`${r.group}\t${r.n}\t${r.medTotal}\t${r.medOwn}\t${r.medShared}\t${r.own0}\t${r.shared85}`);
console.log(`\n全体: ${pages.length} ページ、固有0字 ${pages.filter((p) => p.own === 0).length}、共通85%以上 ${pages.filter((p) => (p.sharedPct ?? 100) >= 85).length}`);
for (const p of pages.filter((q) => (q.sharedPct ?? 100) >= 85)) console.log(`  ${p.name}\t読み物 ${p.total}\t固有 ${p.own}\t共通 ${p.sharedPct}%`);
fs.writeFileSync(path.join(dir, '..', 'unique_result.json'), JSON.stringify(pages.map(({ sents, ...r }) => r), null, 1));
