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

const meta = ARTICLES['honor-of-kings'];

/** 案内リンクの行き先。ロケールは URL の先頭に付ける（Honor of Kings Hub も /ja と /en を持つ） */
const HOK_PATHS: Record<string, string> = {
  hero: '/guide/beginner-heroes',
  faq: '/faq',
  tier: '/tier-list',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return { title: t('hok.title'), description: t('hok.description'), alternates: getAlternates(locale, '/guides/honor-of-kings') };
}

export default async function HonorOfKingsGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tCommon = await getTranslations('GuidesPage');
  const t = await getTranslations('GuideHOK');
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

  return (
    <div className="min-h-screen bg-background text-slate-700 flex flex-col font-sans">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-10 space-y-8">
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

        {/* Article Body */}
        <article className="space-y-6 text-slate-700 leading-relaxed text-sm md:text-base font-normal">
          {(t.raw('leadParagraphs') as string[]).map((text, i) => (
            <p key={`lead-${i}`}>{text}</p>
          ))}

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('tempoHeading')}
          </h2>

          {(t.raw('tempoParagraphs') as string[]).map((text, i) => (
            <p key={`tempo-${i}`}>{text}</p>
          ))}

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('controlsHeading')}
          </h2>

          {(t.raw('controlsParagraphs') as string[]).map((text, i) => (
            <p key={`controls-${i}`}>{text}</p>
          ))}

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('downsideHeading')}
          </h2>

          {(t.raw('downsideParagraphs') as string[]).map((text, i) => (
            <p key={`downside-${i}`}>{text}</p>
          ))}

          <h2 className="text-xl font-bold text-slate-900 pt-6 border-t border-slate-200">
            {t('verdictHeading')}
          </h2>

          {/* 見出しが「こんな人におすすめ」と約束しているので、まず地の文で結論を出す。
              数字はその裏づけとして下に置き、見出しで数字だと分かるようにする */}
          {(t.raw('verdictParagraphs') as string[]).map((text, i) => (
            <p key={`verdict-p-${i}`}>{text}</p>
          ))}

          <h3 className="text-base font-bold text-slate-900 pt-2">
            {t('verdictDataHeading')}
          </h3>

          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            {(t.raw('verdictList') as string[]).map((item, i) => (
              <li key={`verdict-${i}`}>{item}</li>
            ))}
          </ul>

          <p>
            {t('closing')}
          </p>

          {/* 読み終えた人が次に知りたいことへ直接送る。トップに落として探させない。
              パスは Honor of Kings Hub の実在ページで、日英とも同じ構成（2026-09-21 に確認） */}
          <aside className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">{t('related.heading')}</h2>
            <ul className="mt-3 space-y-3">
              {(t.raw('related.items') as { key: string; title: string; desc: string }[]).map((item) => (
                <li key={item.key}>
                  <a
                    href={`https://hok.hub-game.com/${locale}${HOK_PATHS[item.key] ?? ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-amber-700 underline underline-offset-2 hover:text-amber-800"
                  >
                    {item.title}
                  </a>
                  <span className="block text-sm text-slate-600">{item.desc}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="pt-6 text-center">
            <a
              href="https://hok.hub-game.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-sm transition-all"
            >
              {t('cta')}
            </a>
          </div>
        
          <GlossaryTermLinks termKeys={['Snowball', 'Farm', 'Assassin', 'Mage', 'Burst', 'Objective', 'Macro', 'Tower']} />
        </article>
      </main>

      <FooterNav />
    </div>
  );
}
