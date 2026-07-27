import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';
import { ArrowLeft } from 'lucide-react';

export default function WildRiftGuidePage() {
  const tCommon = useTranslations('GuidesPage');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <HeaderNav />

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-10 space-y-8">
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
          <div className="text-xs font-medium text-cyan-400">
            タイトルレビュー / 感想
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-snug">
            妥協なき競技性。『ワイルドリフト』がスマホゲームの域を超えている理由
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>投稿日: 2026年7月</span>
            <span>•</span>
            <span>執筆: LoL経験者</span>
          </div>
        </header>

        {/* Article Body */}
        <article className="space-y-6 text-slate-300 leading-relaxed text-sm md:text-base font-normal">
          <p>
            PC版『League of Legends（LoL）』を何年も遊んできた人間にとって、モバイル版である『ワイルドリフト（Wild Rift）』の発表は楽しみ半分、不安半分だった。
          </p>

          <p>
            「スマホの小さな画面で、あの複雑なマクロやチャンピオンの繊細な操作を再現できるわけがない」そう思っていた。しかし実際にプレイしてみると、そこには妥協なく作られた本物の「サモナーズリフト」が広がっていた。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 「視界（ワード）」と「ミニオンのラストヒット」を削らなかった凄み
          </h2>

          <p>
            スマホ向けにカジュアルダウンされたゲームの多くは、暗闇を照らす「ワード（視界管理）」やミニオンにトドメを刺す「ラストヒット」といった要素を簡略化・排除する。
          </p>

          <p>
            だがワイリフは違った。マップ上の視界をどこで確保するか、敵ジャングラーが暗闇からいつ飛び出してくるかという心理戦がPC版と全く同じクオリティで存在する。
          </p>

          <p>
            ラストヒットに関しても、トドメを刺さなければ獲得ゴールドが大幅に減るため、レーン戦での1歩1歩の間合い管理やハラス（牽制）の重みがそのまま残っている。このシビアさこそが、他のモバイルゲームにはない奥深さを生んでいる。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 「ミクロの操作」で敵を返り討ちにした時の達成感
          </h2>

          <p>
            操作性の面でも、チャンピオンごとの難易度の高さが見事に維持されている。
          </p>

          <p>
            例えば、ヤスオの流れるようなステップや、ゼドの影を使った位置替えコンボ、リー・シンのキックインセクなど、プレイヤーの指先の技術（ミクロ）がダイレクトに結果へ反映される。
          </p>

          <p>
            体力が残りわずかのピンチから、相手の方向指定スキルを完璧なスキルドッジでかわし、フラッシュコンボで返り討ちにした瞬間の快感は、まさに「実力で勝った」と胸を張れる最高の瞬間だ。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 正直な難点：覚えることが多く、1試合も少し重め
          </h2>

          <p>
            本格的であることの裏返しとして、初心者へのハードルは高い。
          </p>

          <p>
            1試合のプレイ時間は15〜20分程度かかることが多く、途中で席を立つことは当然できない。また、アイテムの選択やチャンピオンのスキル効果、ドラゴンのバフ管理など、覚えるべき知識量が膨大だ。
          </p>

          <p>
            「気楽にポチポチ遊べるゲーム」を探している人には正解とは言えないかもしれない。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 総評：こんな人におすすめ
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>PCゲーム並みの本格的な戦術と頭脳戦をスマホでプレイしたい人</li>
            <li>プレイヤースキル（操作の精密さや判断力）を限界まで磨きたいガチ勢</li>
            <li>ランク戦（ソロラン）を本気で勝ち上がって自分の実力を証明したい人</li>
          </ul>

          <p>
            手軽さよりも「本物の競技性と達成感」を求めるなら、ワイルドリフトは間違いなく最高の選択肢になる。
          </p>

          <div className="pt-6 text-center">
            <a
              href="https://wildrift.hub-game.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              ワイルドリフトHubでチャンピオン攻略を見る
            </a>
          </div>
        </article>
      </main>

      <FooterNav />
    </div>
  );
}
