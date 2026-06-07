import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('Terms');

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col font-sans">
      <header className="px-5 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">{t('title')}</h1>
        </div>
      </header>

      <main className="flex-1 p-5">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('introTitle')}</h2>
              <p>{t('introText')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('copyrightTitle')}</h2>
              <p>{t('copyrightText')}</p>
              <p className="mt-2 text-slate-400 text-xs">{t('copyrightNote')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('prohibitionsTitle')}</h2>
              <p>{t('prohibitionsText')}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {t.raw('prohibitionsList').map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('modificationsTitle')}</h2>
              <p>{t('modificationsText')}</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
