import { MetadataRoute } from 'next';

// PWA マニフェスト。Next.js の規約に従い app ルート直下に配置する。
// 単一ファイルのためロケール分岐ができないので、主言語である英語で記述する。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HUB-GAME Portal',
    short_name: 'HUB-GAME',
    description: 'A mobile MOBA portal with title comparisons, an aptitude quiz, and a glossary.',
    lang: 'en',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#f8fafc',
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
