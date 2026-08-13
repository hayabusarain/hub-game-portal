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
  return { title: t('privacy.title'), description: t('privacy.description'), alternates: getAlternates(locale, '/privacy') };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Privacy');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  // 表示中のパンくずと同じ階層を構造化データにも出す
  const graph = buildGraph(
    buildBreadcrumb(locale, [
      { name: tBreadcrumb('home'), path: '/' },
      { name: t('title'), path: '/privacy' },
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
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('collectionTitle')}</h2>
              <p>{t('collectionText')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('analyticsTitle')}</h2>
              <p>{t('analyticsText')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('adsTitle')}</h2>
              <p>{t('adsText')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('disclosureTitle')}</h2>
              <p>{t('disclosureText')}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {t.raw('disclosureList').map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      <FooterNav />
    </div>
  );
}
