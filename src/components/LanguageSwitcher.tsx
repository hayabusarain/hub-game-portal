"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'ja' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50 border border-slate-200 active:scale-95 transition-all w-10 h-10 group"
      aria-label="Toggle Language"
    >
      <div className="flex text-xs font-black">
        <span className={`${locale === 'ja' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>A</span>
        <span className={`${locale === 'ja' ? 'text-slate-400 group-hover:text-slate-600' : 'text-indigo-600'}`}>/</span>
        <span className={`${locale === 'en' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>あ</span>
      </div>
      <span className="text-[8px] font-bold text-slate-500 mt-0.5 tracking-wider">
        {locale === 'en' ? 'EN' : 'JA'}
      </span>
    </button>
  );
}
