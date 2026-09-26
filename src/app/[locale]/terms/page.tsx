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
  return { title: t('terms.title'), description: t('terms.description'), alternates: getAlternates(locale, '/terms') };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Terms');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  // 表示中のパンくずと同じ階層を構造化データにも出す
  const graph = buildGraph(
    buildBreadcrumb(locale, [
      { name: tBreadcrumb('home'), path: '/' },
      { name: t('title'), path: '/terms' },
    ])
  );

  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col font-sans">
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
              <span aria-hidden="true" className="text-slate-400">/</span>
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
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('introTitle')}</h2>
              <p>{t('introText')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('copyrightTitle')}</h2>
              <p>{t('copyrightText')}</p>
              <p className="mt-2 text-slate-500 text-xs">{t('copyrightNote')}</p>
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

      <FooterNav />
    </div>
  );
}
