/**
 * トップのゲームカードに使う帯（public/images/games/*.jpg）を作る。
 *
 * 使い方: node scripts/make_game_banner.mjs mlbb
 *
 * ■ なぜ 1800×826 なのか
 *
 * カードは横 768px の枠（max-w-3xl）に高さ 176px で置いてある。object-cover なので
 * 画像は幅で合わせて上端基準に切られ、**見えるのは上半分だけ**になる。
 * 高精細な画面では枠が 1536×352 の実ピクセルになるため、元画像が 1536px より
 * 細いと引き伸ばしになる。900px で作っていた3枚は、いずれも約1.7倍に伸びていた
 * （2026-09-11 に発覚。MLBB のカードが荒いという指摘から）。
 *
 * 1800px あれば 1536px へ縮小して表示されるので、伸びない。
 * 比率は 900×413 と同じにしてあり、カード側の見え方（上半分だけ）は変わらない。
 *
 * ■ 拡大率は 1.5 倍。上げないこと
 *
 * 公式が配っている絵は 750×721 が最大で、これより大きいものは無い
 * （2026-09-11 に公式 CMS API を引いて確認。painting 750×721、head_big 500×500、
 * あとは 100〜128px のアイコンだけ）。絵を大きく見せるには拡大するしかなく、
 * 拡大した分だけ甘くなる。表示時には 1536/1800 = 0.853 倍に縮むので、
 * 画面上の引き伸ばしは「拡大率 × 0.853」になる。
 *
 * 4段階を並べて比べた（2026-09-11）。
 *   1.2 倍 … 引き伸ばし 1.02 倍。いちばん鮮明だが、顔が小さく引きが弱い
 *   1.5 倍 … 引き伸ばし 1.28 倍。顔が読めて、まだ鮮明。**これを採用**
 *   1.8 倍 … 引き伸ばし 1.54 倍。顔は大きいが甘くなり始める
 *   2.1 倍 … 引き伸ばし 1.79 倍。900px 版と同じ甘さに戻り、顔も切れる
 *
 * 絵は canvas の右寄りに収まり、左は地のグラデーションになる。
 * カードは左下にバッジを重ねるので、左が空いているほうが読みやすい。
 *
 * ■ 権利
 *
 * 公式アートを自サイトに再ホストしている。Moonton の許諾は得ていない。
 * 経緯と削除要請時の手順は src/app/[locale]/page.tsx の SITE_CARDS のコメントにある。
 * **この台本で新しいタイトルを増やす前に、そこを読むこと。**
 * 公式 CDN は1回の実行で1枚しか叩かない。連続実行しないこと。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** 出来上がりの寸法。カード側の比率（900×413）と同じにしてある */
const OUT_W = 1800;
const OUT_H = 826;

const TITLES = {
  mlbb: {
    out: 'public/images/games/mobile-legends.jpg',
    // 公式サイト（mobilelegends.com）のヒーロー面が出している Kalea の painting。
    // 750×721、背景は黒。CMS API の data.painting から取れる
    source: 'https://akmweb.youngjoygame.com/web/gms/image/3a7693b9a565b4e1d67d57ae73eb5297.webp',
    scale: 1.5,
    /** 絵の右端を canvas の右端からどれだけ離すか */
    marginRight: 40,
    /** 縦の切り出し位置。カードは上半分しか見せないので、頭の上は落とさない */
    cropTop: 0,
    gradient: {
      from: '#0b1220',
      mid: '#12314a',
      to: '#0e6a72',
      /** 右上あたりに置く明るみ。絵の色（水色）に合わせている */
      glow: { cx: '66%', cy: '30%', color: '#14b8c4' },
    },
  },
};

function gradientSvg({ from, mid, to, glow }) {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${OUT_W}" height="${OUT_H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="55%" stop-color="${mid}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${glow.cx}" cy="${glow.cy}" r="55%">
      <stop offset="0%" stop-color="${glow.color}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${glow.color}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${OUT_W}" height="${OUT_H}" fill="url(#g)"/>
  <rect width="${OUT_W}" height="${OUT_H}" fill="url(#glow)"/>
</svg>`);
}

const key = process.argv[2];
const cfg = TITLES[key];
if (!cfg) {
  console.error(`使い方: node scripts/make_game_banner.mjs <${Object.keys(TITLES).join('|')}>`);
  process.exit(1);
}

const res = await fetch(cfg.source);
if (!res.ok) throw new Error(`素材を取得できません: ${res.status} ${cfg.source}`);
const src = Buffer.from(await res.arrayBuffer());
const meta = await sharp(src).metadata();
console.log(`素材 ${meta.width}x${meta.height} ${meta.format}`);

// 絵を拡大し、canvas の高さに切り揃える。拡大率の意味は冒頭のコメントを読むこと
const artW = Math.round(meta.width * cfg.scale);
const artH = Math.round(meta.height * cfg.scale);
const art = await sharp(src)
  .resize(artW, artH, { kernel: 'lanczos3' })
  .extract({
    left: 0,
    top: cfg.cropTop,
    width: artW,
    height: Math.min(OUT_H, artH - cfg.cropTop),
  })
  .toBuffer();
const artMeta = await sharp(art).metadata();
console.log(`絵 ${artMeta.width}x${artMeta.height}（拡大 ${cfg.scale} 倍）`);

// screen 合成で黒い背景を落とす。screen(a, 0) = a なので、素材の黒い部分は地がそのまま残る
const out = await sharp(gradientSvg(cfg.gradient))
  .composite([
    {
      input: art,
      left: OUT_W - artMeta.width - cfg.marginRight,
      top: 0,
      blend: 'screen',
    },
  ])
  .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
  .toBuffer();

const dest = path.join(ROOT, cfg.out);
await fs.writeFile(dest, out);
const final = await sharp(out).metadata();
console.log(`書き出し ${cfg.out} ${final.width}x${final.height} ${(out.length / 1024).toFixed(0)}KB`);
