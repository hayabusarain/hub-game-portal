// 掲載文の文体を測る（読むだけ）。1つの文字列（1つの欄）を1段落として、
// 「。」で文に分け、文末が敬体（です・ます系）か、それ以外（常体・体言止め）かを数える。
import fs from 'node:fs';
import path from 'node:path';

const JA = /[぀-ヿ一-鿿]/;
const POLITE = /(です|ます|ません|でした|ました|ましょう|でしょう|ください|ですね|ますね)$/;
const strip = (s) => s.replace(/[）」』\s]+$/g, '');

const stringsOfTs = (src) => {
  const out = [];
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(src))) {
    const s = m[1] ?? m[2] ?? m[3];
    if (s && JA.test(s)) out.push(s);
  }
  return out;
};
const stringsOfJson = (v, out = []) => {
  if (typeof v === 'string') { if (JA.test(v)) out.push(v); }
  else if (v && typeof v === 'object') for (const x of Object.values(v)) stringsOfJson(x, out);
  return out;
};

const analyse = (label, strs) => {
  let fields = 0, mixed = 0, sents = 0, polite = 0, pairs = 0, flips = 0, len = 0, short = 0, allPolite = 0, allPlain = 0;
  const samples = [];
  for (const s of strs) {
    const ss = s.split(/(?<=。)/).map((x) => x.trim()).filter((x) => x.endsWith('。') && x.length > 4);
    if (ss.length < 2) continue;
    fields++;
    const kinds = ss.map((x) => POLITE.test(strip(x.slice(0, -1))));
    sents += ss.length;
    polite += kinds.filter(Boolean).length;
    for (const x of ss) { len += x.length; if (x.length <= 25) short++; }
    let f = 0;
    for (let i = 1; i < kinds.length; i++) { pairs++; if (kinds[i] !== kinds[i - 1]) { flips++; f++; } }
    const p = kinds.filter(Boolean).length;
    if (p === kinds.length) allPolite++;
    else if (p === 0) allPlain++;
    else { mixed++; if (ss.length >= 4 && f >= ss.length - 1 && samples.length < 1) samples.push(ss.join('')); }
  }
  if (!fields) { console.log(`${label}\t2文以上の欄なし`); return; }
  console.log(`${label}\t欄 ${fields}\t混在 ${mixed}（${Math.round((mixed / fields) * 100)}%）\t敬体だけ ${allPolite}\t常体だけ ${allPlain}\t文 ${sents}\t敬体の文 ${Math.round((polite / sents) * 100)}%\t隣で切り替わる ${Math.round((flips / pairs) * 100)}%\t平均 ${(len / sents).toFixed(1)}字\t25字以下 ${Math.round((short / sents) * 100)}%`);
  for (const x of samples) console.log('   例: ' + x.slice(0, 160));
};

const [, , root, ...files] = process.argv;
for (const f of files) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) { console.log(f + '\t無い'); continue; }
  const list = fs.statSync(p).isDirectory()
    ? fs.readdirSync(p).filter((x) => /\.(ts|json)$/.test(x)).map((x) => path.join(p, x))
    : [p];
  let strs = [];
  for (const q of list) {
    const src = fs.readFileSync(q, 'utf8');
    strs = strs.concat(q.endsWith('.json') ? stringsOfJson(JSON.parse(src)) : stringsOfTs(src));
  }
  analyse(f, strs);
}
