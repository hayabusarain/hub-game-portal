import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      
      {/* Background Decorative Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="w-full max-w-3xl glass-panel p-8 sm:p-12 rounded-3xl relative">
        <Link href="/" className="text-zinc-400 hover:text-white mb-8 inline-flex items-center text-sm transition-colors">
          &larr; トップページへ戻る
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-glow text-white">利用規約</h1>
        
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. はじめに</h2>
            <p>
              本利用規約（以下「本規約」）は、当サイト「HUB-GAME」（以下「当サイト」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. 著作権について</h2>
            <p>
              当サイトに掲載されている情報（テキスト、画像、データ等）に関する著作権は、当サイトまたは各権利所有者に帰属します。私的利用の範囲を超えて無断で使用、複製、転載することを禁じます。
            </p>
            <p className="mt-2 text-zinc-400 text-xs">
              ※ゲーム画像やキャラクター等の著作権はRiot Gamesおよび各パブリッシャーに帰属します。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. 禁止事項</h2>
            <p>ユーザーは、当サイトの利用にあたり、以下の行為をしてはなりません。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当サイト、他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. 規約の変更</h2>
            <p>
              当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
