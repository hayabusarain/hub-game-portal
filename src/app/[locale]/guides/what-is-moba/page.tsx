import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import JsonLd from '@/components/JsonLd';
import { buildArticle, buildBreadcrumb, buildGraph } from '@/utils/jsonld';
import { ARTICLES, formatArticleDate } from '@/data/articles';
import { getAlternates } from '@/utils/seo';
import GlossaryTermLinks from '@/components/GlossaryTermLinks';

const meta = ARTICLES['what-is-moba'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return { title: t('whatIsMoba.title'), description: t('whatIsMoba.description'), alternates: getAlternates(locale, '/guides/what-is-moba') };
}

export default async function WhatIsMobaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('GuidesPage');
  const t = await getTranslations('GuideWhatIsMoba');
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

  // 連続する通常段落は配列キーからまとめて描画する
  const leadParagraphs = t.raw('leadParagraphs') as string[];
  const section1Setup = t.raw('section1Setup') as string[];
  const section1Payoff = t.raw('section1Payoff') as string[];
  const section3Paragraphs = t.raw('section3Paragraphs') as string[];
  const roles = t.raw('roles') as { name: string; description: string }[];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col font-sans">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-10 space-y-8">
        {/* Simple navigation */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          {tCommon('backToGuides')}
        </Link>

        {/* Real essay header */}
        <header className="space-y-4 border-b border-slate-200 pb-8">
          <div className="text-xs font-medium text-amber-600">
            {t('category')}
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
            {t('pageTitle')}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            {/* 日付は articles.ts を唯一の情報源にし、機械可読な dateTime も持たせる */}
            <time dateTime={meta.published}>{formatArticleDate(meta.published, locale)}</time>
            <span>•</span>
            <span>{t('author')}</span>
          </div>
        </header>

        {/* Authentic Essay Content */}
        <article className="space-y-6 text-slate-700 leading-relaxed text-sm md:text-base font-normal">
          {leadParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          <p className="font-semibold text-slate-900 pl-4 border-l-2 border-amber-500 py-1">
            {t('pullQuote')}
          </p>

          <p>{t('leadOutro')}</p>

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('section1Heading')}
          </h2>

          {section1Setup.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          <p>
            {t.rich('section1Highlight', {
              strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
            })}
          </p>

          {section1Payoff.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('section2Heading')}
          </h2>

          <p>{t('section2Intro')}</p>

          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            {roles.map((role, i) => (
              <li key={i}><strong>{role.name}</strong> {role.description}</li>
            ))}
          </ul>

          <p>{t('section2Outro')}</p>

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('section3Heading')}
          </h2>

          {section3Paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          <div className="pt-6 text-center">
            <Link
              href="/guides/compare"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              {t('ctaCompare')}
            </Link>
          </div>
        
          <GlossaryTermLinks termKeys={['Minion', 'LastHit', 'Gank', 'Ace', 'Bush', 'Carry', 'Support', 'Jungler', 'Macro', 'Farm']} />
        </article>
      </main>

      <FooterNav />
    </div>
  );
}
