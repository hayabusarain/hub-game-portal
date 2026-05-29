import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <main className="flex flex-col gap-16 items-center text-center w-full max-w-6xl flex-grow">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-6 pt-10">
          <div className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-semibold tracking-widest mb-4 text-purple-400">
            HUB-GAMEへようこそ
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-glow">
            HUB<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 text-glow-accent">-</span>GAME
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mt-4">競技シーンで活躍するゲーマーのために、最先端の戦略やティアリスト、総合的な攻略情報が揃うポータルです。好きなゲームで自分の実力を試してみましょう。</p>
        </section>

        {/* Game Grid */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Wild Rift Card */}
          <Link href="https://wildrift.hub-game.com" target="_blank" rel="noopener noreferrer" className="group relative rounded-2xl overflow-hidden glass-panel flex flex-col h-[400px] transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-indigo-900/30 group-hover:bg-indigo-600/20 transition-colors duration-500 z-10 mix-blend-overlay" />
            
            {/* Background Image Placeholder (Uses a beautiful abstract gradient if no image) */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 to-indigo-950 transition-transform duration-700 group-hover:scale-110">
               {/* ジンクスのスプラッシュアート (Data Dragon API) */}
               <div className="absolute inset-0 opacity-40 bg-[url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg')] bg-cover bg-center mix-blend-luminosity" />
            </div>

            <div className="relative z-20 mt-auto p-8 flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-bold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                  MOBA
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                  公開中
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                ワイルドリフト
              </h2>
              <p className="text-sm text-zinc-300 line-clamp-2">
                最新のティアリスト、チャンピオンガイド、最適ビルドでリフトを支配せよ。
              </p>
              <div className="mt-4 flex items-center text-sm font-semibold text-white">
                ポータルへ入る 
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Coming Soon Card 1 */}
          <div className="group relative rounded-2xl overflow-hidden glass-panel flex flex-col h-[400px] opacity-70">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950">
               {/* 抽象的なパーティクル/ノイズ画像 */}
               <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale" />
            </div>

            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <div className="px-6 py-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full font-bold tracking-widest text-zinc-300">
                COMING SOON
              </div>
            </div>

            <div className="relative z-20 mt-auto p-8 flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-bold bg-zinc-500/20 text-zinc-400 rounded-full border border-zinc-500/30">
                  ???
                </span>
              </div>
              <h2 className="text-3xl font-bold text-zinc-400">
                新規プロジェクト
              </h2>
              <p className="text-sm text-zinc-500 line-clamp-2">
                新しいゲームの攻略サイトを現在開発中です。続報をお待ちください。
              </p>
            </div>
          </div>

          {/* Coming Soon Card 2 */}
          <div className="group relative rounded-2xl overflow-hidden glass-panel flex flex-col h-[400px] opacity-70">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
            
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950">
               {/* 抽象的なパーティクル/ノイズ画像 */}
               <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center grayscale" />
            </div>

            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <div className="px-6 py-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full font-bold tracking-widest text-zinc-300">
                COMING SOON
              </div>
            </div>

            <div className="relative z-20 mt-auto p-8 flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-bold bg-zinc-500/20 text-zinc-400 rounded-full border border-zinc-500/30">
                  ???
                </span>
              </div>
              <h2 className="text-3xl font-bold text-zinc-400">
                新規プロジェクト
              </h2>
              <p className="text-sm text-zinc-500 line-clamp-2">
                新しいゲームの攻略サイトを現在開発中です。続報をお待ちください。
              </p>
            </div>
          </div>

        </section>
      </main>

      <footer className="mt-20 w-full border-t border-white/10 pt-8 pb-4 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-zinc-400">
          <Link href="/terms" className="hover:text-white transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
          <Link href="/disclaimer" className="hover:text-white transition-colors">免責事項</Link>
          <Link href="/contact" className="hover:text-white transition-colors">お問い合わせ</Link>
        </div>
        <div className="text-xs text-zinc-600 text-center mt-2">
          © {new Date().getFullYear()} HUB-GAME. All rights reserved.<br />
          当サイトは非公式のファンサイトであり、Riot Gamesやその他のパブリッシャーとは一切関係ありません。
        </div>
      </footer>
    </div>
  );
}
