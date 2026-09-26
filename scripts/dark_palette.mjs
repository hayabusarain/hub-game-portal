/**
 * ポータルの夜の配色を作り、文字と地の組み合わせのコントラスト比を検算する（2026-09-27）。
 *
 * 姉妹サイト3つ（HoK Hub・MLBB Hub・Wild Rift Hub）は 2026-09-24〜26 に夜の配色へ作り直した。
 * 方法は3サイトと同じで、部品のクラス名は変えずに「明るい地＋濃い文字」だった段を
 * 「暗い地＋明るい文字」へ写し替える（globals.css の @theme）。
 *   bg-white      … カードの地（暗い）。text-white は「濃い地の上の文字」なので暗い色になる
 *   slate-50〜300 … 暗い面と線。500 が補足、700 が本文、900 が見出し
 *   amber         … ポータルの差し色（琥珀）。文字は amber-700
 *
 * 地の色は3サイトの間を取った「青みの墨」。HoK は墨 #0e0c09、MLBB は夜の紺 #0a1122、
 * Wild Rift は #0b0d22。ポータルは3タイトルの入口なので、どれか1つの色には寄せない。
 *
 * 使い方: node scripts/dark_palette.mjs [--css]
 * 色を足すときも値を手で書かず、ここで作って検算する。
 */

// ---- 色の計算（OKLCH → sRGB、WCAG のコントラスト比） ----
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function oklchToLinearRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
/** 色域に入るまで彩度を下げて sRGB の hex にする */
function oklch(L, C, h) {
  let c = C;
  let rgb = oklchToLinearRgb(L, c, h);
  while (rgb.some((v) => v < -0.0005 || v > 1.0005) && c > 0) {
    c = Math.max(0, c - 0.002);
    rgb = oklchToLinearRgb(L, c, h);
  }
  return '#' + rgb.map((v) => Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, v))))) * 255).toString(16).padStart(2, '0')).join('');
}
const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const lum = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// ---- 地の色（青みの墨） ----
const GROUND = { page: { L: 0.155, c: 0.016, h: 268 }, card: { L: 0.205, c: 0.02, h: 268 }, neutralC: 0.012, neutralH: 265 };

// 各系統の色相（Tailwind 4 の既定色の色相に合わせる）と、彩度の強さ
const FAMILIES = {
  amber: { h: 72, k: 1.05 },
  yellow: { h: 95, k: 1.0 },
  orange: { h: 50, k: 1.0 },
  red: { h: 25, k: 1.0 },
  rose: { h: 12, k: 1.0 },
  pink: { h: 355, k: 1.0 },
  purple: { h: 305, k: 0.95 },
  violet: { h: 292, k: 0.95 },
  indigo: { h: 277, k: 0.95 },
  blue: { h: 258, k: 0.95 },
  sky: { h: 235, k: 0.9 },
  cyan: { h: 215, k: 0.9 },
  teal: { h: 182, k: 0.85 },
  emerald: { h: 162, k: 0.9 },
  green: { h: 150, k: 0.9 },
};
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function build() {
  const card = oklch(GROUND.card.L, GROUND.card.c, GROUND.card.h);
  const page = oklch(GROUND.page.L, GROUND.page.c, GROUND.page.h);
  const Lc = GROUND.card.L;
  // 石（slate）: 面と線は地の色味、文字はほぼ無彩色
  const slateL = { 50: Lc + 0.035, 100: Lc + 0.065, 200: Lc + 0.12, 300: Lc + 0.2, 400: 0.66, 500: 0.745, 600: 0.815, 700: 0.88, 800: 0.93, 900: 0.965, 950: 0.985 };
  const slate = Object.fromEntries(SHADES.map((s) => [s, oklch(slateL[s], s <= 300 ? GROUND.neutralC * 1.3 : s <= 600 ? GROUND.neutralC : GROUND.neutralC * 0.6, GROUND.neutralH)]));
  // 有彩色: 50〜200 は地に寄せた暗い面、400〜500 は塗り、600 以上は文字
  const L = { 50: Lc + 0.04, 100: Lc + 0.075, 200: Lc + 0.135, 300: 0.43, 400: 0.6, 500: 0.7, 600: 0.775, 700: 0.84, 800: 0.9, 900: 0.945, 950: 0.975 };
  const C = { 50: 0.035, 100: 0.045, 200: 0.07, 300: 0.09, 400: 0.13, 500: 0.15, 600: 0.14, 700: 0.11, 800: 0.075, 900: 0.04, 950: 0.02 };
  const fam = {};
  for (const [name, { h, k }] of Object.entries(FAMILIES)) {
    fam[name] = Object.fromEntries(SHADES.map((s) => [s, oklch(L[s], C[s] * k, h)]));
  }
  return { page, card, foreground: slate[800], slate, ...fam };
}

/** 文字として使う組み合わせを検算する。下限は文字 4.5、線と図形 3 */
export function check(p) {
  const out = [];
  const need = (label, fg, bg, min) => {
    const r = ratio(fg, bg);
    out.push({ label, r: +r.toFixed(2), min, ok: r >= min });
  };
  for (const s of [500, 600, 700, 800, 900]) {
    need(`slate-${s} / カード`, p.slate[s], p.card, 4.5);
    need(`slate-${s} / ページ`, p.slate[s], p.page, 4.5);
  }
  need('slate-500 / slate-100（チップの地）', p.slate[500], p.slate[100], 4.5);
  need('slate-600 / slate-100', p.slate[600], p.slate[100], 4.5);
  need('slate-400 / カード（アイコン）', p.slate[400], p.card, 3);
  need('slate-300 / カード（強い線）', p.slate[300], p.card, 1.6);
  for (const f of Object.keys(FAMILIES)) {
    for (const s of [600, 700, 800]) need(`${f}-${s} / カード`, p[f][s], p.card, 4.5);
    need(`${f}-700 / ${f}-50（バッジ）`, p[f][700], p[f][50], 4.5);
    need(`${f}-600 / ${f}-100`, p[f][600], p[f][100], 4.5);
    // 明るい配色で「白文字＋500の塗り」だった組は、写し替えると「カード色の文字＋500の塗り」になる
    need(`カード色の文字 / ${f}-500（塗り）`, p.card, p[f][500], 4.5);
  }
  need('リンク amber-700 / ページ', p.amber[700], p.page, 4.5);
  return out;
}

export function css(p) {
  const lines = [`  --color-white: ${p.card};`];
  for (const f of ['slate', ...Object.keys(FAMILIES)]) {
    for (const s of SHADES) lines.push(`  --color-${f}-${s}: ${p[f][s]};`);
  }
  return lines.join('\n');
}

if (process.argv[1]?.endsWith('dark_palette.mjs')) {
  const p = build();
  const res = check(p);
  const bad = res.filter((r) => !r.ok);
  console.log(`ページ ${p.page} / カード ${p.card} / 本文 ${p.slate[700]} / 見出し ${p.slate[900]} / 琥珀 ${p.amber[700]}`);
  console.log(`検算 ${res.length} 組、下限割れ ${bad.length}`);
  for (const r of bad) console.log(`  ✗ ${r.label} ${r.r}（下限 ${r.min}）`);
  const worst = [...res].sort((a, b) => a.r / a.min - b.r / b.min).slice(0, 4);
  console.log('余裕の小さい組: ' + worst.map((r) => `${r.label} ${r.r}`).join(' / '));
  if (process.argv.includes('--css')) console.log(css(p));
}
