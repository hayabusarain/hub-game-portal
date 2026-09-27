/**
 * サイト統合（2026-09-27 運営者了承）の切り替え日から、旧サブドメインの /sw.js に返すスクリプト。
 * 計画は HoK の docs/CONSOLIDATION_PLAN.md（2章と5章の手順0・7）。
 *
 * 切り替え日に hok.hub-game.com などは Single Redirects で hub-game.com/hok へ 301 する。ただし /sw.js だけは転送から外し、ここへ送る。
 * Service Worker のスクリプトは転送を受け付けないので、/sw.js まで転送すると、訪問者の端末に残った旧 Service Worker が
 * 更新も解除もできないまま残り続ける（次の訪問で旧サイトのキャッシュからページを出しうる）。
 *
 * ブラウザは旧サブドメインのページを開くたびに /sw.js を取り直し、中身が変わっていれば入れ替える。
 * ここが返す CLEANUP_SW に入れ替わると、登録を外し、キャッシュを消し、開いている窓を読み直す。
 * 登録が外れたあとの読み直しはネットワークへ行き、301 で新しい URL に着く。
 *
 * 対象は Service Worker を登録していた HoK（キャッシュ hok-hub-cache-）と MLBB（mlbb-hub-cache-）。
 * Wild Rift は Service Worker を使ったことが無いので対象外（git の履歴にも無い）。
 * 旧サブドメインのオリジンはもう中身を配らないので、そこにあるキャッシュはすべて旧サイトの残り物。接頭辞で絞らず全部消す。
 *
 * 残す期間は 301 と同じく最低1年。ルートは wrangler.jsonc（このフォルダ）の冒頭のコメント。
 */
const CLEANUP_SW = `// 旧サブドメインに残った Service Worker を外す（hub-game.com へのサイト統合、2026-09-27〜）
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window' });
    await Promise.all(windows.map((client) => client.navigate(client.url).catch(() => null)));
  })());
});
`;

const legacySw = {
  async fetch(request) {
    const url = new URL(request.url);
    // ルートは /sw.js だけに付けるが、念のためほかのパスには何も返さない
    if (url.pathname !== '/sw.js') return new Response('Not Found', { status: 404 });
    return new Response(request.method === 'HEAD' ? null : CLEANUP_SW, {
      headers: {
        'Content-Type': 'text/javascript; charset=utf-8',
        // ブラウザは Service Worker のスクリプトを HTTP のキャッシュを通さずに取り直すが、途中のキャッシュにも持たせない
        'Cache-Control': 'no-cache',
      },
    });
  },
};

// 変数に入れてから出す（名前の無い default export は lint の import/no-anonymous-default-export が警告する）
export default legacySw;
