import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HeaderNav from "@/components/HeaderNav";
import FooterNav from "@/components/FooterNav";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumb, buildGraph } from '@/utils/jsonld';
import { getAlternates } from '@/utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return { title: t('disclaimer.title'), description: t('disclaimer.description'), alternates: getAlternates(locale, '/disclaimer') };
}

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Disclaimer');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  // 表示中のパンくずと同じ階層を構造化データにも出す
  const graph = buildGraph(
    buildBreadcrumb(locale, [
      { name: tBreadcrumb('home'), path: '/' },
      { name: t('title'), path: '/disclaimer' },
    ])
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-8 py-8">
        {/* パンくず（ホーム / 現在のページ） */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <li>
              <Link href="/" className="hover:text-slate-900 transition-colors">
                {tBreadcrumb('home')}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span aria-current="page" className="text-slate-700">{t('title')}</span>
            </li>
          </ol>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-6">
          {t('title')}
        </h1>

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

      <FooterNav />
    </div>
  );
}
