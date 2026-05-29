import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="w-full max-w-3xl glass-panel p-8 sm:p-12 rounded-3xl relative">
        <Link href="/" className="text-zinc-400 hover:text-white mb-8 inline-flex items-center text-sm transition-colors">
          &larr; トップページへ戻る
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-glow text-white">プライバシーポリシー</h1>
        
        <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. 個人情報の収集について</h2>
            <p>
              当サイトでは、お問い合わせやサービス提供の過程で、ユーザーのお名前、メールアドレス等の個人情報を収集する場合があります。これらの個人情報は、適切に管理し、目的外の利用はいたしません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. アクセス解析ツールについて</h2>
            <p>
              当サイトでは、Googleによるアクセス解析ツール「Google Analytics」を利用しています。このGoogle Analyticsはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. 広告の配信について</h2>
            <p>
              当サイトは、第三者配信の広告サービスを利用する場合があります。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. 個人情報の第三者への開示</h2>
            <p>当サイトは、個人情報を適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>本人のご了解がある場合</li>
              <li>法令等への協力のため、開示が必要となる場合</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
