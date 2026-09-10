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
import { SITE_ORIGINS, liveSitesFor } from '@/data/highlights';

/**
 * Mobile Legends: Bang Bang のタイトルレビュー。
 *
 * 記事そのものは日英とも出す。ゲームの話であって、当方のサイトの話ではない。
 * ただし末尾の「MLBB Hub を見る」ボタンだけは、その言語で公開しているときにしか出さない。
 * MLBB Hub は日本語のみで公開しているので、英語の読者を読めないサイトへ送らないため。
 */

const meta = ARTICLES['mobile-legends'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    title: t('mobileLegends.title'),
    description: t('mobileLegends.description'),
    alternates: getAlternates(locale, meta.path),
  };
}

export default async function MobileLegendsGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('GuidesPage');
  const t = await getTranslations('GuideMLBB');
  const tNav = await getTranslations('Nav');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  const hasSite = liveSitesFor(locale).includes('mlbb');

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col font-sans">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-10 space-y-8">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          {tCommon('backToGuides')}
        </Link>

        <header className="space-y-4 border-b border-slate-200 pb-8">
          <div className="text-xs font-medium text-violet-600">{t('category')}</div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
            {t('heading')}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {/* 日付は articles.ts を唯一の情報源にし、機械可読な dateTime も持たせる */}
            <time dateTime={meta.published}>{formatArticleDate(meta.published, locale)}</time>
            {meta.updated !== meta.published && (
              <>
                <span>•</span>
                <span>{tCommon('updatedLabel')} <time dateTime={meta.updated}>{formatArticleDate(meta.updated, locale)}</time></span>
              </>
            )}
            <span>•</span>
            <span>{t('author')}</span>
          </div>
        </header>

        <article className="space-y-6 text-slate-700 leading-relaxed text-sm md:text-base font-normal">
          {(t.raw('lead') as string[]).map((text, i) => (
            <p key={`lead-${i}`}>{text}</p>
          ))}

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('section1Heading')}
          </h2>
          {(t.raw('section1Body') as string[]).map((text, i) => (
            <p key={`s1-${i}`}>{text}</p>
          ))}

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('section2Heading')}
          </h2>
          {(t.raw('section2Body') as string[]).map((text, i) => (
            <p key={`s2-${i}`}>{text}</p>
          ))}

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('section3Heading')}
          </h2>
          {(t.raw('section3Body') as string[]).map((text, i) => (
            <p key={`s3-${i}`}>{text}</p>
          ))}

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('section4Heading')}
          </h2>
          {(t.raw('verdictParagraphs') as string[]).map((text, i) => (
            <p key={`verdict-p-${i}`}>{text}</p>
          ))}

          <h3 className="text-base font-bold text-slate-900 pt-2">{t('verdictDataHeading')}</h3>

          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            {(t.raw('recommendedFor') as string[]).map((item, i) => (
              <li key={`rec-${i}`}>{item}</li>
            ))}
          </ul>

          <p>{t('conclusion')}</p>

          {/* MLBB Hub は日本語のみ。英語では姉妹サイトへ送れないので、代わりに
              3タイトルの比較記事へ送る。ここを空にすると英語版だけ行き止まりになる */}
          <div className="pt-6 text-center">
            {hasSite ? (
              <a
                href={SITE_ORIGINS.mlbb}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
              >
                {t('ctaLabel')}
              </a>
            ) : (
              <Link
                href="/guides/compare"
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
              >
                {t('compareCtaLabel')}
              </Link>
            )}
          </div>

          <GlossaryTermLinks termKeys={['Objective', 'LastHit', 'Farm', 'Jungler', 'Support', 'Build', 'Scaling', 'Meta']} />
        </article>
      </main>

      <FooterNav />
    </div>
  );
}
