import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';
import MobaDiagnosticQuiz from '@/components/MobaDiagnosticQuiz';
import { ArrowLeft } from 'lucide-react';

export default function CompareGuidePage() {
  const tCommon = useTranslations('GuidesPage');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <HeaderNav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-10 space-y-10">
        {/* Navigation */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          {tCommon('backToGuides')}
        </Link>

        {/* Header */}
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <div className="text-xs font-medium text-amber-400">
            比較レビュー / 考察
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-snug">
            【ガチ本音比較】Honor of Kingsとワイルドリフト、結局どっちを遊ぶべき？
          </h1>

          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            スマホMOBAの2大巨頭『Honor of Kings（HoK）』と『ワイルドリフト（Wild Rift）』。「ぶっちゃけどっちから始めればいいの？」という疑問に、両方をやり込んだいちプレイヤー目線で正直に答えてみる。
          </p>
        </header>

        {/* Article Body */}
        <article className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base font-normal">
          
          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase">サクッと爆速対戦</span>
              <h2 className="text-lg font-bold text-white">Honor of Kings</h2>
              <p className="text-xs text-slate-300">
                1試合10〜15分。テンポが良く、序盤から集団戦がバチバチ起きる。爽快感重視で、短時間でストレス解消したい人やMOBA初心者に最適。
              </p>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase">本格マクロ＆競技性</span>
              <h2 className="text-lg font-bold text-white">Wild Rift</h2>
              <p className="text-xs text-slate-300">
                1試合15〜20分。ワードによる視界心理戦、シビアなラストヒット、精密な操作。PCゲーライクな奥深い戦略性と達成感を求めるガチ勢向け。
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white pt-4 border-t border-slate-800">
            ■ 1. 決定的な違いは「試合のテンポ」と「視界の概念」
          </h2>

          <p>
            一番大きな違いは**「試合時間とテンポ」**、そして**「ワード（視界管理）があるかどうか」**だ。
          </p>

          <p>
            <strong>Honor of Kings:</strong> ワードによる視界奪い合いがなく、マップ上の敵の位置が比較的クリア。移動やファーム速度が速く、開始2〜3分で大集団戦が始まる。「細かい準備抜きで、とにかくガンガン戦いたい」という爽快感を追求している。
          </p>

          <p>
            <strong>ワイルドリフト:</strong> 暗闇（フォグ・オブ・ウォー）が存在し、ワードを置いて視界を確保する戦術が必須。「どこから敵が襲ってくるか分からない緊張感」と、敵の裏をかくマクロの面白さがある。
          </p>

          <h2 className="text-xl font-bold text-white pt-4 border-t border-slate-800">
            ■ 2. アイテム購入とリコールの仕様
          </h2>

          <p>
            <strong>Honor of Kings:</strong> リコールしなくてもフィールドのどこでもアイテムが購入可能です。そのため、体力が瀕死にならない限りリコールする必要がなく、非常にスピーディで途切れない試合展開が楽しめます。
          </p>

          <p>
            <strong>ワイルドリフト:</strong> アイテムを購入するためには、必ず本陣（泉）までリコールして戻る必要があります。レーン戦の有利不利を考え、いつリコールしてアイテムを更新するかのタイミングを図るなど、深い戦略性が求められます。
          </p>

          <h2 className="text-xl font-bold text-white pt-4 border-t border-slate-800">
            ■ 3. 比較表（プレイヤー目線）
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3">項目</th>
                  <th className="py-3 px-3 text-amber-400">Honor of Kings</th>
                  <th className="py-3 px-3 text-cyan-400">Wild Rift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">1試合の時間</td>
                  <td className="py-3 px-3">10〜15分（爆速）</td>
                  <td className="py-3 px-3">15〜20分+（じっくり）</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">覚える知識量</td>
                  <td className="py-3 px-3">比較的少なめ・直感的</td>
                  <td className="py-3 px-3">膨大（アイテム・視界・ルーン）</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">操作感</td>
                  <td className="py-3 px-3">スマホ特化でスムーズ</td>
                  <td className="py-3 px-3">精密でスキル天井が高い</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">アイテム購入</td>
                  <td className="py-3 px-3">どこでも可能（展開が早い）</td>
                  <td className="py-3 px-3">本陣でのみ可能（戦略必須）</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">デザイン・世界観</td>
                  <td className="py-3 px-3">東洋神話・英雄・華やか</td>
                  <td className="py-3 px-3">西洋ダークファンタジー・LoL</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-white pt-4 border-t border-slate-800">
            ■ 4. 結論：あなたへのおすすめ
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-900/60 border-l-4 border-amber-500 rounded-r-xl">
              <h3 className="font-bold text-amber-300 mb-1">▶ 『Honor of Kings』がおすすめの人</h3>
              <p className="text-xs text-slate-300">
                ・1試合15分程度でサクサク遊びたい社会人ゲーマー<br/>
                ・難しい座学なしで、派手なコンボとキルの爽快感を味わいたい人<br/>
                ・MOBA初心者で、まずはジャンルの基本を楽しく学びたい人
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border-l-4 border-cyan-500 rounded-r-xl">
              <h3 className="font-bold text-cyan-300 mb-1">▶ 『ワイルドリフト』がおすすめの人</h3>
              <p className="text-xs text-slate-300">
                ・PCゲーム並みの本格的な戦術・頭脳戦を求めている人<br/>
                ・精密なスキルドッジや視界管理で「プレイヤースキルの差」を見せつけたいガチ勢<br/>
                ・LoLの世界観やチャンピオンデザインが好きな人
              </p>
            </div>
          </div>

          {/* Diagnostic Quiz section */}
          <div className="pt-8 border-t border-slate-800">
            <MobaDiagnosticQuiz />
          </div>

        </article>
      </main>

      <FooterNav />
    </div>
  );
}
