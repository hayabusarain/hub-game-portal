import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';
import { ArrowLeft } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { buildArticle, buildBreadcrumb, buildGraph } from '@/utils/jsonld';
import { ARTICLES, formatArticleDate } from '@/data/articles';
import { getAlternates } from '@/utils/seo';
import GlossaryTermLinks from '@/components/GlossaryTermLinks';

/**
 * HoK⇄ワイルドリフトの用語対応表と乗り換えガイド。
 *
 * 同じ概念が両タイトルで別の名前で呼ばれている（水晶⇄ネクサス、タイラント⇄ドラゴン等）。
 * 片方から乗り換える人が最初につまずくのはここなので、対応を一覧にし、
 * 名前だけでなく仕組みの違いを一行ずつ添える。単体の攻略サイトには置けない、
 * 2タイトルを扱うポータルにしか書けない記事。
 */

type MappingRow = { concept: string; hok: string; wr: string; note: string };
type MappingSection = { heading: string; intro: string; rows: MappingRow[] };

const meta = ARTICLES['term-mapping'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return { title: t('termMapping.title'), description: t('termMapping.description'), alternates: getAlternates(locale, meta.path) };
}

export default async function TermMappingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('GuidesPage');
  const t = await getTranslations('GuideTermMapping');
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

  const sections = t.raw('sections') as MappingSection[];
  const hokToWr = t.raw('switchGuide.hokToWr') as string[];
  const wrToHok = t.raw('switchGuide.wrToHok') as string[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col font-sans">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-10 space-y-10">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          {tCommon('backToGuides')}
        </Link>

        <header className="space-y-4 border-b border-slate-200 pb-8">
          <div className="text-xs font-medium text-amber-600">{tCommon('tagCompare')}</div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
            {t('title')}
          </h1>

          <p className="text-sm text-slate-600 font-medium leading-relaxed">{t('lead')}</p>

          {/* 呼び名はパッチで変わることがあるので、公開日と更新日を出す */}
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

        <article className="space-y-10 text-slate-700 leading-relaxed text-sm md:text-base font-normal">
          {sections.map((section, i) => (
            <section key={i} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-200">
                {section.heading}
              </h2>
              <p>{section.intro}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600">
                      <th className="py-3 px-3">{t('tableHeader.concept')}</th>
                      <th className="py-3 px-3 text-amber-700">{t('tableHeader.hok')}</th>
                      <th className="py-3 px-3 text-cyan-700">{t('tableHeader.wr')}</th>
                      <th className="py-3 px-3">{t('tableHeader.note')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {section.rows.map((row, j) => (
                      <tr key={j} className="align-top">
                        <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">{row.concept}</td>
                        <td className="py-3 px-3">{row.hok}</td>
                        <td className="py-3 px-3">{row.wr}</td>
                        <td className="py-3 px-3 text-slate-600 min-w-[14rem]">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-200">
              {t('switchGuide.heading')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white border-l-4 border-cyan-500 rounded-r-xl shadow-sm space-y-3">
                <h3 className="font-bold text-cyan-700">{tCommon('switchHokToWr')}</h3>
                {hokToWr.map((paragraph, i) => (
                  <p key={i} className="text-sm text-slate-700 leading-relaxed">{paragraph}</p>
                ))}
              </div>
              <div className="p-5 bg-white border-l-4 border-amber-500 rounded-r-xl shadow-sm space-y-3">
                <h3 className="font-bold text-amber-700">{tCommon('switchWrToHok')}</h3>
                {wrToHok.map((paragraph, i) => (
                  <p key={i} className="text-sm text-slate-700 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          </section>

          <p>{t('closing')}</p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <a
              href={`https://hok.hub-game.com/${locale}/guide`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              {t('ctaHok')}
            </a>
            <a
              href={`https://wildrift.hub-game.com/${locale}/guide`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              {t('ctaWr')}
            </a>
          </div>

          <GlossaryTermLinks termKeys={['Objective', 'Ward', 'Recall', 'Support', 'Jungler', 'Nexus', 'Build', 'Meta']} />
        </article>
      </main>

      <FooterNav />
    </div>
  );
}
