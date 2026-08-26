import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HeaderNav from "@/components/HeaderNav";
import FooterNav from "@/components/FooterNav";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumb, buildGraph } from '@/utils/jsonld';
import { getAlternates } from '@/utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return { title: t('about.title'), description: t('about.description'), alternates: getAlternates(locale, '/about') };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  // 表示中のパンくずと同じ階層を構造化データにも出す
  const graph = buildGraph(
    buildBreadcrumb(locale, [
      { name: tBreadcrumb('home'), path: '/' },
      { name: t('title'), path: '/about' },
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
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('siteTitle')}</h2>
              <p>{t('siteText')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('operatorTitle')}</h2>
              <p>{t('operatorText')}</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('policyTitle')}</h2>
              <p>{t('policyText')}</p>
            </section>

            {/* 数値をどう確かめているかを具体的に書く。掲載方針の裏付けになる部分 */}
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('methodTitle')}</h2>
              <ul className="list-disc pl-5 space-y-2">
                {(t.raw('methodList') as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">{t('contactTitle')}</h2>
              <p>{t('contactText')}</p>
              {/* お問い合わせページへの導線 */}
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {t('contactTitle')}
                <ArrowRight size={14} />
              </Link>
            </section>
          </div>
        </div>
      </main>

      <FooterNav />
    </div>
  );
}
