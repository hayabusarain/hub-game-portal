import { useTranslations } from 'next-intl';

import { Link } from "@/i18n/routing";
import { ChevronRight, Gamepad2, ArrowRight } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations('Home');

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col font-sans">
      
      {/* App Header */}
      <header className="px-5 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Gamepad2 size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-800">
              {t('title')}
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 pt-8 pb-12 w-full gap-8">
        
        {/* Hero Section */}
        <section className="flex flex-col gap-3">
          <div className="inline-flex px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 w-fit tracking-wider">
            PORTAL
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
            {t('title')}
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1 whitespace-pre-wrap">
            {t('description')}
          </p>
        </section>

        {/* Game Cards List */}
        <section className="flex flex-col gap-5">
          
          {/* Wild Rift Card */}
          <Link href="https://wildrift.hub-game.com" target="_blank" rel="noopener noreferrer" className="group block relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 transition-all active:scale-[0.98] hover:shadow-md">
            {/* Image Banner */}
            <div className="w-full h-40 relative bg-slate-100 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
              
              <div className="absolute bottom-4 left-5 flex gap-2">
                <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm">
                  MOBA
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">
                  稼働中
                </span>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-slate-900">{t('wildRiftTitle')}</h3>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t('wildRiftDesc')}
              </p>
            </div>
          </Link>

          {/* Honor of Kings Card */}
          <Link href="https://hok.hub-game.com" target="_blank" rel="noopener noreferrer" className="group block relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 transition-all active:scale-[0.98] hover:shadow-md">
            {/* Image Banner */}
            <div className="w-full h-40 relative bg-slate-100 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/109/109-bigskin-1.jpg')] bg-cover bg-top transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
              
              <div className="absolute bottom-4 left-5 flex gap-2">
                <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm">
                  MOBA
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">
                  稼働中
                </span>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black text-slate-900">{t('hokTitle')}</h3>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t('hokDesc')}
              </p>
            </div>
          </Link>

          {/* Coming Soon Card 2 (Mobile Legends) */}
          <div className="relative bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm opacity-80">
            <div className="w-full h-28 relative bg-slate-200 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 py-1.5 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-bold tracking-widest rounded-full">COMING SOON</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-700">{t('mlbbTitle')}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium whitespace-pre-wrap">
                {t('mlbbDesc')}
              </p>
            </div>
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-5 py-8">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/terms" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between p-3 rounded-xl bg-slate-50 active:bg-slate-100 transition-colors">
              {useTranslations('Terms')('title')} <ChevronRight size={14} className="text-slate-400" />
            </Link>
            <Link href="/privacy" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between p-3 rounded-xl bg-slate-50 active:bg-slate-100 transition-colors">
              {useTranslations('Privacy')('title')} <ChevronRight size={14} className="text-slate-400" />
            </Link>
            <Link href="/disclaimer" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between p-3 rounded-xl bg-slate-50 active:bg-slate-100 transition-colors">
              {useTranslations('Disclaimer')('title')} <ChevronRight size={14} className="text-slate-400" />
            </Link>
            <Link href="/contact" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-between p-3 rounded-xl bg-slate-50 active:bg-slate-100 transition-colors">
              {useTranslations('Contact')('title')} <ChevronRight size={14} className="text-slate-400" />
            </Link>
          </div>
          
          <div className="text-center space-y-3 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              {t('disclaimerText')}
            </p>
            <p className="text-[10px] text-slate-400 font-bold">
              © {new Date().getFullYear()} HUB-GAME. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
