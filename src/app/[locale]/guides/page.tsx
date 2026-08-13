import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from "@/i18n/routing";
import { BookMarked, BookOpen, ChevronRight, Flame, Sparkles, Swords, Target, Compass } from "lucide-react";
import HeaderNav from "@/components/HeaderNav";
import FooterNav from "@/components/FooterNav";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumb, buildGraph } from '@/utils/jsonld';
import { getAlternates } from '@/utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return { title: t('guides.title'), description: t('guides.description'), alternates: getAlternates(locale, '/guides') };
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('GuidesPage');
  const tWhat = await getTranslations('GuideWhatIsMoba');
  const tHok = await getTranslations('GuideHOK');
  const tWr = await getTranslations('GuideWildRift');
  const tComp = await getTranslations('GuideCompare');
  const tGlossary = await getTranslations('Glossary');
  const tNav = await getTranslations('Nav');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  // 視覚的なパンくずは置かず、階層は構造化データだけで検索エンジンに伝える
  const graph = buildGraph(
    buildBreadcrumb(locale, [
      { name: tBreadcrumb('home'), path: '/' },
      { name: tNav('guides'), path: '/guides' },
    ])
  );

  const articles = [
    {
      slug: "what-is-moba",
      title: tWhat('title'),
      desc: tWhat('intro'),
      tag: t('tagIntro'),
      color: "bg-amber-500 text-slate-950",
      icon: Flame
    },
    {
      slug: "honor-of-kings",
      title: tHok('title'),
      desc: tHok('intro'),
      tag: t('tagReview'),
      color: "bg-amber-500 text-slate-950",
      icon: Compass
    },
    {
      slug: "wild-rift",
      title: tWr('title'),
      desc: tWr('intro'),
      tag: t('tagReview'),
      color: "bg-cyan-500 text-slate-950",
      icon: Target
    },
    {
      slug: "compare",
      title: tComp('title'),
      desc: tComp('intro'),
      tag: t('tagCompare'),
      color: "bg-purple-500 text-white",
      icon: Swords
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="flex-1 flex flex-col px-4 md:px-8 py-8 w-full max-w-5xl mx-auto gap-12">

        {/* Page Hero Header */}
        <section className="space-y-4 text-center max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-black text-amber-600 uppercase tracking-widest">
            <BookOpen size={14} />
            <span>{t('eyebrow')}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {t('title')}
          </h1>

          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed bg-white border border-slate-200 p-6 rounded-3xl">
            {t('subtitle')}
          </p>
        </section>

        {/* Article Cards Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="text-amber-600" />
            {t('featured')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, i) => {
              const Icon = article.icon;
              return (
                <Link
                  key={i}
                  href={`/guides/${article.slug}`}
                  className="group bg-white border border-slate-200 p-6 rounded-3xl hover:border-amber-400 hover:bg-slate-100 transition-all shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 text-[11px] font-black rounded-lg ${article.color}`}>
                        {article.tag}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                        <ChevronRight size={16} />
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {article.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform">
                    <Icon size={14} />
                    <span>{t('readMore')}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 用語集は /glossary の独立ページへ移した（内容の重複を避けるため）。
            旧 /guides#glossary へのリンクが残っていても届くよう id は維持する。 */}
        <section id="glossary" className="pt-6 border-t border-slate-200 scroll-mt-24">
          <Link
            href="/glossary"
            className="group bg-white border border-slate-200 p-6 rounded-3xl hover:border-amber-400 hover:bg-slate-100 transition-all shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 text-[11px] font-black rounded-lg bg-indigo-500 text-white">
                  {t('glossaryCta')}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <ChevronRight size={16} />
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                {tGlossary('title')}
              </h2>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {t('glossaryCtaDesc')}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform">
              <BookMarked size={14} />
              <span>{t('readMore')}</span>
            </div>
          </Link>
        </section>

      </main>

      <FooterNav />
    </div>
  );
}
