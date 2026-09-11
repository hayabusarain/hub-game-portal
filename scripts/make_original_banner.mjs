/**
 * 権利関係がまったく発生しない、当サイトの自作バナーを作る。
 *
 * 使い方: node scripts/make_original_banner.mjs mlbb [出力先]
 *
 * ■ 何を描いているか
 *
 * MOBA の地図そのもの。正方形を45度傾けた菱形に、3本のレーン、川、
 * 両端の本陣、レーン上のタワー、四隅のジャングルを置いている。
 * この構造は MOBA というジャンルの仕組みであって、誰かの著作物ではない。
 * ヒーローの絵・ロゴ・ゲーム内の画面はいっさい使っていない。座標はすべて
 * この台本が計算して SVG を書き出しており、素材の取り込みも無い。
 *
 * ■ 座標の作り方
 *
 * 地図の中では、左下(0,1)と右上(1,0)が本陣。ミッドはその対角線、
 * トップは (0,0) を経由する道、ボトムは (1,1) を経由する道。
 * 川はもう一方の対角線（(0,0)-(1,1)）。
 * これを45度回して縦を SQUASH 倍に潰すと、見慣れた横長の菱形になる。
 *
 * ■ カードの見え方
 *
 * カードは上半分しか見せない（make_game_banner.mjs の冒頭を読むこと）。
 * 菱形は上半分に収まる位置に置いてある。下側は切られる前提。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const OUT_W = 1800;
const OUT_H = 826;

/** 縦の潰し具合。1 だと真上から見た菱形、小さいほど寝かせた見え方になる */
const SQUASH = 0.52;
/**
 * 菱形の大きさ。横幅が SIZE * √2、高さが SIZE * √2 * SQUASH になる。
 * カードは上半分（826 のうち上 413）しか見せないので、その中に収める。
 * SIZE=520 なら 735×382 で、CY=205 のとき縦 14〜396 に収まる。
 */
const SIZE = 520;
/** 菱形の中心。右寄せにして、左はバッジと見出しのために空けておく */
const CX = 1270;
const CY = 205;

const TITLES = {
  mlbb: {
    out: 'public/images/games/mobile-legends.jpg',
    // カードのバッジや見出しと揃える（ポータルは MLBB を violet で通している）
    ground: ['#080a18', '#1b1147', '#3b1d6e'],
    glow: '#8b5cf6',
    lane: '#c4b5fd',
    node: '#f5f3ff',
    river: '#38bdf8',
  },
  hok: {
    out: 'public/images/games/honor-of-kings.jpg',
    ground: ['#140a05', '#3a1d0a', '#6b3410'],
    glow: '#f59e0b',
    lane: '#fcd34d',
    node: '#fffbeb',
    river: '#38bdf8',
  },
};

/**
 * 地図の中の座標を canvas の座標へ。45度回して縦を潰す。
 *
 * 回す向きに注意。x-y を横に取ると、本陣どうしを結ぶミッド（(0,1)-(1,0)）が
 * 横一文字になり、川（(0,0)-(1,1)）が縦になる。x+y を横に取ると逆さまになり、
 * ミッドが縦に立ってしまう（2026-09-11 に一度そうなった）。
 */
function project(x, y) {
  const rx = (x - y) / Math.SQRT2;
  const ry = ((x + y) / Math.SQRT2) * SQUASH;
  // 菱形の中心が (CX, CY) に来るよう、縦だけ中心ぶんずらす
  return [CX + rx * SIZE, CY + (ry - (Math.SQRT2 / 2) * SQUASH) * SIZE];
}
const pt = (x, y) => project(x, y).map((n) => n.toFixed(1)).join(',');

/** 2点のあいだを t の位置で分ける */
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

const BASE_A = [0, 1]; // 左下の本陣 → canvas では左
const BASE_B = [1, 0]; // 右上の本陣 → canvas では右
const CORNER_T = [0, 0]; // トップ側の角
const CORNER_B = [1, 1]; // ボトム側の角

/** レーン。角は丸めたいので、角の手前と先で切って二次曲線でつなぐ */
function lanePath(via) {
  if (!via) return `M${pt(...BASE_A)} L${pt(...BASE_B)}`;
  const r = 0.16;
  const inA = lerp(BASE_A, via, 1 - r);
  const outB = lerp(via, BASE_B, r);
  return `M${pt(...BASE_A)} L${pt(...inA)} Q${pt(...via)} ${pt(...outB)} L${pt(...BASE_B)}`;
}

/** レーン上のタワー。両陣営3基ずつ */
function towers(via) {
  const path = via ? [BASE_A, via, BASE_B] : [BASE_A, BASE_B];
  const at = (t) => {
    // 折れ線上を t（0〜1）で進む
    if (path.length === 2) return lerp(path[0], path[1], t);
    return t < 0.5 ? lerp(path[0], path[1], t * 2) : lerp(path[1], path[2], (t - 0.5) * 2);
  };
  return [0.18, 0.3, 0.42, 0.58, 0.7, 0.82].map((t) => at(t));
}

function svg(c) {
  const lanes = [null, CORNER_T, CORNER_B];
  const laneMarkup = lanes
    .map(
      (via) => `
    <path d="${lanePath(via)}" fill="none" stroke="${c.lane}" stroke-opacity="0.85"
          stroke-width="3.5" stroke-linecap="round" filter="url(#soft)"/>
    <path d="${lanePath(via)}" fill="none" stroke="${c.lane}" stroke-opacity="0.5"
          stroke-width="1.2" stroke-linecap="round"/>`,
    )
    .join('');

  const towerMarkup = lanes
    .flatMap((via) => towers(via))
    .map(([x, y]) => {
      const [px, py] = project(x, y);
      return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.5" fill="${c.node}" fill-opacity="0.9"/>`;
    })
    .join('');

  // ジャングル。レーンから外れた4区画に散らす
  const camps = [
    [0.26, 0.26], [0.4, 0.16], [0.16, 0.4],
    [0.74, 0.74], [0.6, 0.84], [0.84, 0.6],
    [0.3, 0.62], [0.62, 0.3],
  ]
    .map(([x, y]) => {
      const [px, py] = project(x, y);
      return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.6" fill="${c.lane}" fill-opacity="0.45"/>`;
    })
    .join('');

  const riverBand = `M${pt(0, 0)} L${pt(0.5 - 0.038, 0.5 + 0.038)} L${pt(1, 1)} L${pt(0.5 + 0.038, 0.5 - 0.038)} Z`;

  const baseMark = ([x, y]) => {
    const [px, py] = project(x, y);
    const s = 26;
    return `
    <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="64" fill="url(#base)"/>
    <path d="M${px},${py - s * SQUASH} L${px + s},${py} L${px},${py + s * SQUASH} L${px - s},${py} Z"
          fill="none" stroke="${c.node}" stroke-opacity="0.95" stroke-width="2.6"/>
    <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="6" fill="${c.node}"/>`;
  };

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${OUT_W}" height="${OUT_H}">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.ground[0]}"/>
      <stop offset="55%" stop-color="${c.ground[1]}"/>
      <stop offset="100%" stop-color="${c.ground[2]}"/>
    </linearGradient>
    <radialGradient id="halo" cx="${((CX / OUT_W) * 100).toFixed(0)}%" cy="${((CY / OUT_H) * 100).toFixed(0)}%" r="60%">
      <stop offset="0%" stop-color="${c.glow}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${c.glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="base" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.glow}" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="${c.glow}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <filter id="hazy" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="${c.lane}" fill-opacity="0.07"/>
    </pattern>
  </defs>

  <rect width="${OUT_W}" height="${OUT_H}" fill="url(#ground)"/>
  <rect width="${OUT_W}" height="${OUT_H}" fill="url(#dots)"/>
  <rect width="${OUT_W}" height="${OUT_H}" fill="url(#halo)"/>

  <!-- 地図の枠 -->
  <path d="M${pt(0, 0)} L${pt(1, 0)} L${pt(1, 1)} L${pt(0, 1)} Z"
        fill="${c.glow}" fill-opacity="0.06" stroke="${c.lane}" stroke-opacity="0.28" stroke-width="1.6"/>

  <!-- 川 -->
  <path d="${riverBand}" fill="${c.river}" fill-opacity="0.2" filter="url(#hazy)"/>
  <path d="${riverBand}" fill="${c.river}" fill-opacity="0.12"/>

  ${laneMarkup}
  ${camps}
  ${towerMarkup}
  ${baseMark(BASE_A)}
  ${baseMark(BASE_B)}
</svg>`);
}

const key = process.argv[2];
const cfg = TITLES[key];
if (!cfg) {
  console.error(`使い方: node scripts/make_original_banner.mjs <${Object.keys(TITLES).join('|')}> [出力先]`);
  process.exit(1);
}
const dest = process.argv[3] ? path.resolve(process.argv[3]) : path.join(ROOT, cfg.out);

const out = await sharp(svg(cfg))
  .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toBuffer();
await fs.writeFile(dest, out);
console.log(`書き出し ${dest} ${OUT_W}x${OUT_H} ${(out.length / 1024).toFixed(0)}KB`);
