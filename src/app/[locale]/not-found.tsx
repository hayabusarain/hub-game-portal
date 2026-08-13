import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, BookOpen, BookMarked, Home } from 'lucide-react';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';

/**
 * 404 ページ。
 * 素の Next.js の 404 はサイトのCSSもナビも持たないため、
 * 共通ヘッダー・フッターと主要ページへの導線を付けて行き止まりにしないようにする。
 *
 * 注意: not-found.tsx は generateMetadata で params を受け取れないので、
 * ロケールは getTranslations() の暗黙のリクエストロケールに従う。
 */
export default async function NotFound() {
  const t = await getTranslations('NotFound');

  const links = [
    { href: '/', label: t('backHome'), icon: Home },
    { href: '/guides', label: t('browseGuides'), icon: BookOpen },
    { href: '/glossary', label: t('browseGlossary'), icon: BookMarked },
  ] as const;

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col font-sans">
      <HeaderNav />

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-20 w-full max-w-2xl mx-auto text-center gap-6">
        <p className="text-6xl font-black tracking-tight text-slate-300" aria-hidden="true">
          {t('code')}
        </p>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">{t('title')}</h1>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">{t('body')}</p>
        </div>

        <ul className="flex flex-col gap-3 w-full max-w-sm mt-2">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center gap-3 w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all active:scale-[0.99]"
              >
                <Icon size={18} className="text-indigo-500 shrink-0" />
                <span className="text-sm font-bold text-slate-800 text-left flex-1">{label}</span>
                <ArrowRight
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <FooterNav />
    </div>
  );
}
