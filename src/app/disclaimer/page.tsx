import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="w-full max-w-3xl glass-panel p-8 sm:p-12 rounded-3xl relative">
        <Link href="/" className="text-zinc-400 hover:text-white mb-8 inline-flex items-center text-sm transition-colors">
          &larr; トップページへ戻る
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-glow text-white">免責事項</h1>
        
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. 情報の正確性について</h2>
            <p>
              当サイトのコンテンツや情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、必ずしも正確性・信頼性等を保証するものではありません。ゲームのパッチ更新等により、情報が古くなっている場合もございます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. 損害等の責任について</h2>
            <p>
              当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
              また、当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. 著作権等の帰属</h2>
            <p>
              当サイトは非公式のファンサイトです。当サイトで掲載しているゲームの画像や動画、キャラクター名等の著作権・肖像権等は、Riot Games, Inc. または各権利所有者に帰属します。
              権利を侵害する目的は一切ございません。記事の内容や掲載画像等に問題がございましたら、各権利所有者様本人がお問い合わせ窓口よりご連絡ください。確認後、迅速に対応させていただきます。
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
