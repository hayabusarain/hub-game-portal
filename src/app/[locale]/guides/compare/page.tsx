import { Fragment, type ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';
import MobaDiagnosticQuiz from '@/components/MobaDiagnosticQuiz';
import { ArrowLeft } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { buildArticle, buildBreadcrumb, buildGraph } from '@/utils/jsonld';
import { ARTICLES, formatArticleDate } from '@/data/articles';
import { getAlternates } from '@/utils/seo';
import GlossaryTermLinks from '@/components/GlossaryTermLinks';

type TableRow = { axis: string; hok: string; wr: string };

const meta = ARTICLES.compare;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return { title: t('compare.title'), description: t('compare.description'), alternates: getAlternates(locale, '/guides/compare') };
}

export default async function CompareGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('GuidesPage');
  const t = await getTranslations('GuideCompare');
  const tNav = await getTranslations('Nav');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  const graph = buildGraph(
    buildBreadcrumb(locale, [
      { name: tBreadcrumb('home'), path: '/' },
      { name: tNav('guides'), path: '/guides' },
      { name: t('title'), path: meta.path },
    ]),
    buildArticle({
      locale,
      path: meta.path,
      headline: t('title'),
      description: t('intro'),
      datePublished: meta.published,
      dateModified: meta.updated,
    })
  );

  const tableRows = t.raw('tableRows') as TableRow[];
  const hokPoints = t.raw('recommendHok.points') as string[];
  const wrPoints = t.raw('recommendWr.points') as string[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col font-sans">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-10 space-y-10">
        {/* Navigation */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          {tCommon('backToGuides')}
        </Link>

        {/* Header */}
        <header className="space-y-4 border-b border-slate-200 pb-8">
          <div className="text-xs font-medium text-amber-600">
            {t('category')}
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
            {t('heading')}
          </h1>

          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            {t('lead')}
          </p>

          {/* 比較表の数値はパッチで動くので、公開日と更新日を画面にも出す */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>{tCommon('publishedLabel')} <time dateTime={meta.published}>{formatArticleDate(meta.published, locale)}</time></span>
            {meta.updated !== meta.published && (
              <>
                <span>•</span>
                <span>{tCommon('updatedLabel')} <time dateTime={meta.updated}>{formatArticleDate(meta.updated, locale)}</time></span>
              </>
            )}
          </div>
        </header>

        {/* Article Body */}
        <article className="space-y-8 text-slate-700 leading-relaxed text-sm md:text-base font-normal">

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
              <span className="text-xs font-bold text-amber-600 uppercase">{t('cards.hok.label')}</span>
              <h2 className="text-lg font-bold text-slate-900">{t('cards.hok.name')}</h2>
              <p className="text-xs text-slate-600">
                {t('cards.hok.body')}
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
              <span className="text-xs font-bold text-cyan-600 uppercase">{t('cards.wr.label')}</span>
              <h2 className="text-lg font-bold text-slate-900">{t('cards.wr.name')}</h2>
              <p className="text-xs text-slate-600">
                {t('cards.wr.body')}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-200">
            {t('section1.heading')}
          </h2>

          <p>
            {t.rich('section1.intro', {
              strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
            })}
          </p>

          <p>
            <strong>{t('section1.hokLabel')}</strong> {t('section1.hokBody')}
          </p>

          <p>
            <strong>{t('section1.wrLabel')}</strong> {t('section1.wrBody')}
          </p>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-200">
            {t('section2.heading')}
          </h2>

          <p>
            <strong>{t('section2.hokLabel')}</strong> {t('section2.hokBody')}
          </p>

          <p>
            <strong>{t('section2.wrLabel')}</strong> {t('section2.wrBody')}
          </p>

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-200">
            {t('section3.heading')}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600">
                  <th className="py-3 px-3">{t('tableHeader.axis')}</th>
                  <th className="py-3 px-3 text-amber-700">{t('tableHeader.hok')}</th>
                  <th className="py-3 px-3 text-cyan-700">{t('tableHeader.wr')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {tableRows.map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 px-3 font-semibold text-slate-900">{row.axis}</td>
                    <td className="py-3 px-3">{row.hok}</td>
                    <td className="py-3 px-3">{row.wr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 表のデータ行の検証時点と出典 */}
          {t.has('tableFootnote') && (
            <p className="text-xs text-slate-500 leading-relaxed">{t('tableFootnote')}</p>
          )}

          <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-200">
            {t('section4.heading')}
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-white border-l-4 border-amber-500 rounded-r-xl shadow-sm">
              <h3 className="font-bold text-amber-700 mb-1">{t('recommendHok.heading')}</h3>
              <p className="text-xs text-slate-600">
                {hokPoints.map((point, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {point}
                  </Fragment>
                ))}
              </p>
            </div>

            <div className="p-4 bg-white border-l-4 border-cyan-500 rounded-r-xl shadow-sm">
              <h3 className="font-bold text-cyan-700 mb-1">{t('recommendWr.heading')}</h3>
              <p className="text-xs text-slate-600">
                {wrPoints.map((point, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {point}
                  </Fragment>
                ))}
              </p>
            </div>
          </div>

          {/* Diagnostic Quiz section */}
          <div className="pt-8 border-t border-slate-200">
            <MobaDiagnosticQuiz />
          </div>

        
          <GlossaryTermLinks termKeys={['Ward', 'Recall', 'Fountain', 'LastHit', 'Farm', 'Objective', 'Engage', 'Meta']} />
        </article>
      </main>

      <FooterNav />
    </div>
  );
}
