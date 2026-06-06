import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col font-sans">
      <header className="px-5 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">お問い合わせ</h1>
        </div>
      </header>

      <main className="flex-1 p-5">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 text-center flex flex-col items-center">
          <p className="text-slate-600 text-sm mb-8 leading-relaxed font-medium">
            当サイトに関するご質問、情報提供、または削除依頼等は、公式X（旧Twitter）アカウントのダイレクトメッセージ（DM）にて受け付けております。
          </p>

          <a 
            href="https://x.com/hub_gamecom" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl active:scale-95 transition-all shadow-md"
          >
            {/* X (Twitter) Logo SVG */}
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z"></path>
            </svg>
            @hub_gamecom へ DMを送る
          </a>

          <p className="mt-6 text-xs text-slate-400 font-medium">
            ※返信にはお時間をいただく場合がございます。<br/>あらかじめご了承ください。
          </p>
        </div>
      </main>
    </div>
  );
}
