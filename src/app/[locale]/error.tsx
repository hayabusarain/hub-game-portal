'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { RotateCcw, Home } from 'lucide-react';

/**
 * ロケール配下のエラーバウンダリ。
 * 素のエラー画面はサイトの体裁を持たないため、再読み込みと
 * ホームへの導線だけを備えた最小限の画面を出す。
 */
export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('Error');

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col items-center justify-center px-5 py-20 font-sans text-center gap-6">
      <div className="flex flex-col gap-3 max-w-md">
        <h1 className="text-2xl font-black text-slate-900">{t('title')}</h1>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">{t('body')}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          type="button"
          onClick={reset}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm py-3.5 px-5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <RotateCcw size={16} />
          {t('retry')}
        </button>
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 font-bold text-sm py-3.5 px-5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Home size={16} />
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
}
