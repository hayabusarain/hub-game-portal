import { SITE_LABELS } from '@/data/highlights';
import { getXPostDrafts } from '@/lib/xPosts';
import XPostList from '@/components/XPostList';

/**
 * 運営者用の画面。姉妹サイトの更新から X の投稿下書きを作って並べる。
 *
 * 読者向けのページではないので、ロケールを付けない（/studio のまま）。
 * src/proxy.ts の matcher から外してあり、sitemap にも入れない。
 * 誰でも開けるが、出しているのは各サイトが公開している /api/latest の値だけで、
 * 秘密は無い。検索に出したくないだけなので noindex と robots の Disallow で足りる。
 */

export const metadata = {
  title: 'X 投稿の下書き | hub-game.com',
  robots: { index: false, follow: false },
};

/** /api/latest 側と同じ30分。開くたびに姉妹サイトを叩かない */
export const revalidate = 1800;

export default async function StudioPage() {
  const drafts = await getXPostDrafts();

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">X 投稿の下書き</h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
          3サイトの <code className="rounded bg-slate-200 px-1">/api/latest</code> から、パッチ・統計・掲載データの更新を読んで文面にしています。
          数字はサイト側のデータそのままなので、直したいときはサイト側を直してください。
          投稿画面を開くと、その下書きは投稿済みとして印が付きます（この端末のブラウザにだけ残ります）。
        </p>

        <div className="mt-6">
          <XPostList drafts={drafts} siteLabels={SITE_LABELS} />
        </div>

        <p className="mt-8 border-t border-slate-200 pt-4 text-xs font-medium leading-relaxed text-slate-500">
          投稿は自動では行いません。文面と数字を見てから、X の画面で投稿してください。
          長さは X の数え方（日本語1文字＝2、URL＝23）で出しています。
        </p>
      </main>
    </div>
  );
}
