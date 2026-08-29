import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Gamepad2, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import HeaderNav from "@/components/HeaderNav";
import FooterNav from "@/components/FooterNav";
import QuizForm from "@/components/QuizForm";
import GlossaryHighlights from "@/components/GlossaryHighlights";
import TitleSnapshot from "@/components/TitleSnapshot";
import { getAlternates } from '@/utils/seo';
import { getLatestHighlights, buildHighlightUrl, SITE_LABELS } from '@/data/highlights';
import { getLiveHighlights } from '@/lib/sisterSites';

// 姉妹サイトの最新情報を取り込むため、静的生成のまま30分ごとに作り直す
export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  // トップページはlayoutのtitle.templateを適用せず、絶対タイトルを使う
  return { title: { absolute: t('home.title') }, description: t('home.description'), alternates: getAlternates(locale, '/') };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const tQuiz = await getTranslations('Quiz');

  // 姉妹サイトのパッチ情報は各サイトの /api/latest から取得し、
  // 取得できた分を手動ピックより前に出す（落ちていても手動分だけで成立する）
  const livePicks = await getLiveHighlights();
  const picks = [...livePicks, ...getLatestHighlights(4)].slice(0, 4);

  // 一番新しいピックの日付を、そのまま「最終更新」として見せる
  const latestDate = picks.reduce((newest, p) => (p.date > newest ? p.date : newest), picks[0].date);
  const updatedLabel = new Intl.DateTimeFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${latestDate}T00:00:00Z`));

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col font-sans">
      
      <HeaderNav />

      <main className="flex-1 flex flex-col px-5 pt-8 pb-12 w-full max-w-3xl mx-auto gap-10">
        
        {/* Hero Section */}
        <section className="flex flex-col gap-3">
          <div className="inline-flex px-3 py-1 bg-slate-200/50 rounded-full text-[10px] font-bold text-slate-600 w-fit tracking-wider">
            {t('badge')}
          </div>
          {/* ページ唯一の h1。ブランド名はヘッダーのロゴが担うので、
              ここは何のサイトかが伝わる説明的な見出しにする */}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            {t('heading')}
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1 whitespace-pre-wrap">
            {t('description')}
          </p>
        </section>

        {/* Game Cards List */}
        <section className="flex flex-col gap-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Gamepad2 size={20} className="text-indigo-500" /> {t('gamesSectionTitle')}
          </h3>
          
          {/* Wild Rift Card */}
          <Link href="https://wildrift.hub-game.com" target="_blank" rel="noopener noreferrer" className="group block relative bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-200/60 transition-all active:scale-[0.98] hover:shadow-xl hover:border-indigo-100">
            {/* バナー: 公式アートは外部CDNへ直リンクせず自サイトにホストする（相手の都合で壊れないように） */}
            <div className="w-full h-44 relative overflow-hidden bg-slate-200">
              <Image
                src="/images/games/wild-rift.jpg"
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                priority
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-5 flex gap-2">
                <span className="px-3 py-1.5 text-[10px] font-black bg-indigo-500/90 backdrop-blur-md text-white rounded-lg shadow-sm tracking-wider">
                  MOBA
                </span>
                <span className="px-3 py-1.5 text-[10px] font-black bg-emerald-500/90 backdrop-blur-md text-white rounded-lg shadow-sm tracking-wider">
                  {t('activeBadge')}
                </span>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{t('wildRiftTitle')}</h3>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors shrink-0">
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t('wildRiftDesc')}
              </p>
            </div>
          </Link>

          {/* Honor of Kings Card */}
          <Link href="https://hok.hub-game.com" target="_blank" rel="noopener noreferrer" className="group block relative bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-200/60 transition-all active:scale-[0.98] hover:shadow-xl hover:border-indigo-100">
            {/* バナー: 公式アートは外部CDNへ直リンクせず自サイトにホストする（相手の都合で壊れないように） */}
            <div className="w-full h-44 relative overflow-hidden bg-slate-200">
              <Image
                src="/images/games/honor-of-kings.jpg"
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-5 flex gap-2">
                <span className="px-3 py-1.5 text-[10px] font-black bg-indigo-500/90 backdrop-blur-md text-white rounded-lg shadow-sm tracking-wider">
                  MOBA
                </span>
                <span className="px-3 py-1.5 text-[10px] font-black bg-emerald-500/90 backdrop-blur-md text-white rounded-lg shadow-sm tracking-wider">
                  {t('activeBadge')}
                </span>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{t('hokTitle')}</h3>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors shrink-0">
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t('hokDesc')}
              </p>
            </div>
          </Link>

        </section>

        {/* 2タイトルの現在地: 数字はHoK側の /api/latest から取り込む。取れなければ表ごと出ない */}
        <TitleSnapshot locale={locale} />

        {/* 今週の注目: 姉妹サイトの新着ピックアップ（src/data/highlights.ts を毎週更新する） */}
        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-3">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" /> {t('picksTitle')}
            </h3>
            <span className="text-[10px] font-bold text-slate-500 shrink-0">
              {t('picksUpdatedLabel')} {updatedLabel}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed -mt-1">
            {t('picksLead')}
          </p>

          <ul className="flex flex-col gap-3">
            {picks.map((pick) => {
              const text = locale === 'ja' ? pick.ja : pick.en;
              return (
                <li key={pick.id}>
                  <a
                    href={buildHighlightUrl(pick, locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-1.5 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all active:scale-[0.99]"
                  >
                    <span
                      className={`w-fit px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide ${
                        pick.site === 'hok'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {SITE_LABELS[pick.site]}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {text.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {text.body}
                    </p>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Diagnostic Quiz Section
            設問と選択肢をサーバー側で描くので、JSが無くても読めてそのまま送信できる。
            送信先は /[locale]/diagnosis。結果は1つのURLに集約している */}
        <section className="flex flex-col gap-4">
          <QuizForm locale={locale} />
          <Link
            href="/diagnosis"
            className="self-center text-xs font-bold text-indigo-600 transition-colors hover:text-indigo-800"
          >
            {tQuiz('howItWorks')}
          </Link>
        </section>

        {/* 用語集の note から、初戦で判断が変わる5語だけを抜いたブロック。
            呼び名の全対応は /guides/term-mapping が持つので、ここは行を増やさない */}
        <GlossaryHighlights />

        {/* Guides & Articles Highlight */}
        <section className="flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-500" /> {t('guidesSectionTitle')}
            </h3>
            <Link href="/guides" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group">
              {t('viewAll')} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link href="/guides/compare" className="bg-gradient-to-br from-rose-500 to-pink-600 p-4 rounded-3xl text-white shadow-md hover:shadow-lg transition-all active:scale-95 group">
              <h4 className="font-bold text-sm mb-1 group-hover:underline">{t('compareCardTitle')}</h4>
              <p className="text-[10px] text-rose-100 font-medium">{t('compareCardDesc')}</p>
            </Link>
            <Link href="/guides/what-is-moba" className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-3xl text-white shadow-md hover:shadow-lg transition-all active:scale-95 group">
              <h4 className="font-bold text-sm mb-1 group-hover:underline">{t('mobaCardTitle')}</h4>
              <p className="text-[10px] text-emerald-100 font-medium">{t('mobaCardDesc')}</p>
            </Link>
          </div>
        </section>
      </main>

      <FooterNav />
    </div>
  );
}
