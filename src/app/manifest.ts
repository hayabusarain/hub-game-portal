import { MetadataRoute } from 'next';

// PWA マニフェスト。Next.js の規約に従い app ルート直下に配置する。
// 単一ファイルのためロケール分岐ができないので、主言語である英語で記述する。
//
// サイト統合（src/lib/siteOrigin.ts）の後も、範囲（scope）は既定の / のまま。ホーム画面に置いたポータルから
// 姉妹サイトの /hok などへ進むと、ポータルのアプリの窓の中で開く。ポータルは4サイトの入口なので、それでよいとした（2026-09-27）。
// 姉妹サイトはそれぞれ範囲を /hok/ などにした manifest を持つので、そちらのインストールは別に成り立つ
//
// 静的書き出しでもファイルとして出す（今の本番でも静的に生成されている）
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HUB-GAME Portal',
    short_name: 'HUB-GAME',
    description: 'A mobile MOBA portal with title comparisons and a glossary.',
    lang: 'en',
    start_url: '/',
    display: 'standalone',
    background_color: '#090c13',
    theme_color: '#090c13',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
