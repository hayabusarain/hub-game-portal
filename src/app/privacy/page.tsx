import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col font-sans">
      <header className="px-5 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">プライバシーポリシー</h1>
        </div>
      </header>

      <main className="flex-1 p-5">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. 個人情報の収集について</h2>
              <p>
                当サイトでは、お問い合わせやサービス提供の過程で、ユーザーのお名前、メールアドレス等の個人情報を収集する場合があります。これらの個人情報は、適切に管理し、目的外の利用はいたしません。
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. アクセス解析ツールについて</h2>
              <p>
                当サイトでは、Googleによるアクセス解析ツール「Google Analytics」を利用しています。このGoogle Analyticsはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. 広告の配信について</h2>
              <p>
                当サイトは、第三者配信の広告サービスを利用する場合があります。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. 個人情報の第三者への開示</h2>
              <p>当サイトは、個人情報を適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>本人のご了解がある場合</li>
                <li>法令等への協力のため、開示が必要となる場合</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
