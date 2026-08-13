/**
 * 用語集のアンカーID生成。
 *
 * 表示側（クライアントコンポーネントの MobaGlossary）と
 * 構造化データ側（サーバーコンポーネントの glossary/page.tsx）の両方から使う。
 * 'use client' のファイルに置くとサーバーから呼び出せないため、ここに切り出している。
 * 片方だけ変えるとJSON-LDの @id が実際のカードの id とずれるので、必ずこの関数を共有すること。
 */

// messages のキー（CamelCase）をアンカー用のスラッグへ変換する
// 例: LastHit -> last-hit / FogOfWar -> fog-of-war / KDA -> kda
export function toAnchorId(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}
