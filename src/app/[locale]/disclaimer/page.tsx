import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function DisclaimerPage() {
  const t = useTranslations('Disclaimer');

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
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('accuracyTitle')}</h2>
              <p>{t('accuracyText')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('liabilityTitle')}</h2>
              <p>{t('liabilityText')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('copyrightsTitle')}</h2>
              <p>{t('copyrightsText')}</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
