import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="w-full max-w-xl glass-panel p-8 sm:p-12 rounded-3xl relative text-center">
        <div className="mb-6">
          <Link href="/" className="text-zinc-400 hover:text-white inline-flex items-center text-sm transition-colors">
            &larr; トップページへ戻る
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-glow text-white">お問い合わせ</h1>
        
        <p className="text-zinc-300 text-sm mb-8 leading-relaxed">
          当サイトに関するご質問、情報提供、または削除依頼等は、公式X（旧Twitter）アカウントのダイレクトメッセージ（DM）にて受け付けております。
        </p>

        <a 
          href="https://twitter.com/WildRiftHub_" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 w-full bg-white text-black font-bold py-4 px-6 rounded-2xl hover:bg-zinc-200 transition-colors"
        >
          {/* X (Twitter) Logo SVG */}
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z"></path>
          </svg>
          @WildRiftHub_ へ DMを送る
        </a>

        <p className="mt-8 text-xs text-zinc-500">
          ※返信にはお時間をいただく場合がございます。あらかじめご了承ください。
        </p>
      </main>
    </div>
  );
}
