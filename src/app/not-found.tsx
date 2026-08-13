import Link from 'next/link';
import { routing } from '@/i18n/routing';
import './globals.css';

/**
 * ロケール配下に入らないパス（例: /foo.txt）向けの 404。
 *
 * ほとんどのリクエストは proxy が /en か /ja へ振り分けるため、
 * 通常は [locale]/not-found.tsx の方が使われる。こちらは保険。
 * ルートレイアウト（src/app/layout.tsx）は children をそのまま返すだけで
 * <html>/<body> を持たないので、このページが自前で持つ必要がある。
 */
export default function RootNotFound() {
  const home = `/${routing.defaultLocale}`;

  return (
    <html lang={routing.defaultLocale}>
      <body className="antialiased">
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 px-5 text-center font-sans">
          <p className="text-6xl font-black tracking-tight text-slate-300" aria-hidden="true">
            404
          </p>
          <div className="flex flex-col gap-3 max-w-md">
            <h1 className="text-2xl font-black text-slate-900">Page not found</h1>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              The page you were looking for may have moved or been removed.
            </p>
          </div>
          <Link
            href={home}
            className="inline-flex items-center justify-center bg-slate-900 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Back to HUB-GAME
          </Link>
        </main>
      </body>
    </html>
  );
}
