import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col font-sans">
      <header className="px-5 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">利用規約</h1>
        </div>
      </header>

      <main className="flex-1 p-5">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. はじめに</h2>
              <p>
                本利用規約（以下「本規約」）は、当サイト「HUB-GAME」（以下「当サイト」）が提供するサービス（以下「本サービス」）の利用条件を定めるものです。ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. 著作権について</h2>
              <p>
                当サイトに掲載されている情報（テキスト、画像、データ等）に関する著作権は、当サイトまたは各権利所有者に帰属します。私的利用の範囲を超えて無断で使用、複製、転載することを禁じます。
              </p>
              <p className="mt-2 text-slate-400 text-xs">
                ※ゲーム画像やキャラクター等の著作権はRiot Gamesおよび各パブリッシャーに帰属します。
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. 禁止事項</h2>
              <p>ユーザーは、当サイトの利用にあたり、以下の行為をしてはなりません。</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当サイト、他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. 規約の変更</h2>
              <p>
                当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
