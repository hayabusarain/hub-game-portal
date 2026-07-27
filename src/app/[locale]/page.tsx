import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";
import { ChevronRight, Gamepad2, ArrowRight, BookOpen } from "lucide-react";
import HeaderNav from "@/components/HeaderNav";
import FooterNav from "@/components/FooterNav";
import MobaDiagnosticQuiz from "@/components/MobaDiagnosticQuiz";

export default function Home() {
  const t = useTranslations('Home');
  const g = useTranslations('Guides');

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col font-sans">
      
      <HeaderNav />

      <main className="flex-1 flex flex-col px-5 pt-8 pb-12 w-full max-w-3xl mx-auto gap-10">
        
        {/* Hero Section */}
        <section className="flex flex-col gap-3">
          <div className="inline-flex px-3 py-1 bg-slate-200/50 rounded-full text-[10px] font-bold text-slate-600 w-fit tracking-wider">
            PORTAL
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-snug bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            {t('title')}
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1 whitespace-pre-wrap">
            {t('description')}
          </p>
        </section>

        {/* Diagnostic Quiz Section */}
        <section className="flex flex-col gap-4">
          <MobaDiagnosticQuiz />
        </section>

        {/* Guides & Articles Highlight */}
        <section className="flex flex-col gap-4 relative">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-500" /> Guides & Articles
            </h3>
            <Link href="/guides" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group">
              View All <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link href="/guides/compare" className="bg-gradient-to-br from-rose-500 to-pink-600 p-4 rounded-3xl text-white shadow-md hover:shadow-lg transition-all active:scale-95 group">
              <h4 className="font-bold text-sm mb-1 group-hover:underline">HoK vs WR 比較</h4>
              <p className="text-[10px] text-rose-100 font-medium">どっちのMOBAがおすすめ？</p>
            </Link>
            <Link href="/guides/what-is-moba" className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-3xl text-white shadow-md hover:shadow-lg transition-all active:scale-95 group">
              <h4 className="font-bold text-sm mb-1 group-hover:underline">MOBA入門</h4>
              <p className="text-[10px] text-emerald-100 font-medium">初心者向け基礎知識</p>
            </Link>
          </div>
        </section>

        {/* Game Cards List */}
        <section className="flex flex-col gap-5">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Gamepad2 size={20} className="text-indigo-500" /> Games
          </h3>
          
          {/* Wild Rift Card */}
          <Link href="https://wildrift.hub-game.com" target="_blank" rel="noopener noreferrer" className="group block relative bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-200/60 transition-all active:scale-[0.98] hover:shadow-xl hover:border-indigo-100">
            {/* Image Banner */}
            <div className="w-full h-44 relative bg-slate-100 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg')] bg-cover bg-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-5 left-5 flex gap-2">
                <span className="px-3 py-1.5 text-[10px] font-black bg-indigo-500/90 backdrop-blur-md text-white rounded-lg shadow-sm tracking-wider">
                  MOBA
                </span>
                <span className="px-3 py-1.5 text-[10px] font-black bg-emerald-500/90 backdrop-blur-md text-white rounded-lg shadow-sm tracking-wider">
                  稼働中
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
            {/* Image Banner */}
            <div className="w-full h-44 relative bg-slate-100 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/109/109-bigskin-1.jpg')] bg-cover bg-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-5 left-5 flex gap-2">
                <span className="px-3 py-1.5 text-[10px] font-black bg-indigo-500/90 backdrop-blur-md text-white rounded-lg shadow-sm tracking-wider">
                  MOBA
                </span>
                <span className="px-3 py-1.5 text-[10px] font-black bg-emerald-500/90 backdrop-blur-md text-white rounded-lg shadow-sm tracking-wider">
                  稼働中
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
      </main>

      <FooterNav />
    </div>
  );
}
