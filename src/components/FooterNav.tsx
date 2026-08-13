import { getTranslations } from 'next-intl/server';
import { Link } from "@/i18n/routing";
import { ChevronRight, Gamepad2 } from "lucide-react";

// 表示するのはテキストとリンクだけで状態もイベントハンドラも持たないため、
// サーバーコンポーネントとして描画し、翻訳メッセージをクライアントへ送らない
export default async function FooterNav() {
  const t = await getTranslations();
  const footerT = await getTranslations('Footer');

  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 px-6 py-10 relative overflow-hidden text-slate-400">
      <div className="flex flex-col gap-8 relative z-10 max-w-6xl mx-auto w-full">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Gamepad2 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white">HUB-GAME</h2>
            <p className="text-xs text-slate-400 font-medium">{footerT('tagline')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{footerT('quickLinks')}</h3>
            <Link href="/guides" className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" /> {t('Nav.guides')}
            </Link>
            <Link href="/guides/compare" className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" /> {t('Nav.compare')}
            </Link>
            <Link href="/terms" className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" /> {t('Terms.title')}
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{footerT('games')}</h3>
            <a href="https://hok.hub-game.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" /> Honor of Kings
            </a>
            <a href="https://wildrift.hub-game.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" /> Wild Rift
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{footerT('policy')}</h3>
            <Link href="/about" className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" /> {t('About.title')}
            </Link>
            <Link href="/privacy" className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" /> {t('Privacy.title')}
            </Link>
            <Link href="/disclaimer" className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" /> {t('Disclaimer.title')}
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" /> {t('Contact.title')}
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 pt-6 border-t border-slate-800">
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            {t('Home.disclaimerText')}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-bold">
              {footerT('rights')}
            </p>
            <div className="flex gap-2">
              {/* X（旧Twitter）公式アカウントへの外部リンク */}
              <a
                href="https://x.com/hub_gamecom"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
