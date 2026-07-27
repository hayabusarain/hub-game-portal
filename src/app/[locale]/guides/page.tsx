import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";
import { BookOpen, ChevronRight, Flame, Sparkles, Swords, Target, Compass, BookA } from "lucide-react";
import HeaderNav from "@/components/HeaderNav";
import FooterNav from "@/components/FooterNav";
import MobaGlossary from "@/components/MobaGlossary";

export default function GuidesPage() {
  const t = useTranslations('GuidesPage');
  const tWhat = useTranslations('GuideWhatIsMoba');
  const tHok = useTranslations('GuideHOK');
  const tWr = useTranslations('GuideWildRift');
  const tComp = useTranslations('GuideCompare');

  const articles = [
    {
      slug: "what-is-moba",
      title: tWhat('title'),
      desc: tWhat('intro'),
      tag: "入門コラム",
      color: "bg-amber-500 text-slate-950",
      icon: Flame
    },
    {
      slug: "honor-of-kings",
      title: tHok('title'),
      desc: tHok('intro'),
      tag: "タイトル解説",
      color: "bg-amber-500 text-slate-950",
      icon: Compass
    },
    {
      slug: "wild-rift",
      title: tWr('title'),
      desc: tWr('intro'),
      tag: "タイトル解説",
      color: "bg-cyan-500 text-slate-950",
      icon: Target
    },
    {
      slug: "compare",
      title: tComp('title'),
      desc: tComp('intro'),
      tag: "ガチ比較",
      color: "bg-purple-500 text-white",
      icon: Swords
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <HeaderNav />

      <main className="flex-1 flex flex-col px-4 md:px-8 py-8 w-full max-w-5xl mx-auto gap-12">

        {/* Page Hero Header */}
        <section className="space-y-4 text-center max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-black text-amber-400 uppercase tracking-widest">
            <BookOpen size={14} />
            <span>MOBA STRATEGY & REVIEWS</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {t('title')}
          </h1>

          <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed bg-slate-900/60 border border-slate-800 p-6 rounded-3xl">
            {t('subtitle')}
          </p>
        </section>

        {/* Article Cards Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="text-amber-400" />
            {t('featured')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, i) => {
              const Icon = article.icon;
              return (
                <Link
                  key={i}
                  href={`/guides/${article.slug}`}
                  className="group bg-slate-900/80 border border-slate-800 p-6 rounded-3xl hover:border-amber-500/40 hover:bg-slate-900 transition-all shadow-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 text-[11px] font-black rounded-lg ${article.color}`}>
                        {article.tag}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                        <ChevronRight size={16} />
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {article.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs font-extrabold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <Icon size={14} />
                    <span>{t('readMore')}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Integrated Glossary Component */}
        <section className="pt-6 border-t border-slate-800">
          <MobaGlossary />
        </section>

      </main>

      <FooterNav />
    </div>
  );
}
