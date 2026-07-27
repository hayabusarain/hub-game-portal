import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';
import { ArrowLeft } from 'lucide-react';

export default function HonorOfKingsGuidePage() {
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
          <div className="text-xs font-medium text-amber-400">
            タイトルレビュー / 感想
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-snug">
            仕事終わりにサクッと遊べる怪作『Honor of Kings』を半年やり込んだ本音
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>投稿日: 2026年7月</span>
            <span>•</span>
            <span>執筆: モバイルゲーマー</span>
          </div>
        </header>

        {/* Article Body */}
        <article className="space-y-6 text-slate-300 leading-relaxed text-sm md:text-base font-normal">
          <p>
            PCのMOBAを長年遊んできた身からすると、「スマホでMOBAなんて画面狭いし操作も大雑把なんじゃないの？」という偏見がずっとあった。
          </p>

          <p>
            だが、世界で最も遊ばれているという『Honor of Kings（オナー・オブ・キングス / 王者栄耀）』のグローバル版がリリースされて触ってみたら、その考えはあっさりと覆された。仕事終わりの疲れた頭でも「あと1試合だけ...」と遊んでしまう絶妙なテンポ感について、正直な感想を書いてみる。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 1試合10〜15分。とにかく「ダレない」スピード感
          </h2>

          <p>
            何よりも驚いたのが試合展開の速さだ。
          </p>

          <p>
            PC系のMOBAだと、序盤は10分近く静かにミニオンを倒し合う忍耐の時間が続くことが多い。しかしHoKでは、試合開始から2分足らずでレベル4に到達し、全員の大技（アルティメットスキル）が解禁される。
          </p>

          <p>
            移動速度もファーム（ゴールド稼ぎ）のスピードも非常にテンポ良く調整されていて、開始早々からマップのどこかでバトルが起きている。ダレる時間が一切なく、12〜15分もあればタワーを押し切って試合が決着する。
          </p>

          <p>
            「30分以上拘束されるのは辛いけど、対戦のヒリヒリ感は味わいたい」という社会人ゲーマーの生活リズムに恐ろしいほど噛み合っている。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ スムーズすぎるスマホ操作とコンボの爽快感
          </h2>

          <p>
            スマホ画面での仮想パッド操作だが、入力の吸いつきとレスポンスが極めて良い。
          </p>

          <p>
            スキルエイム（狙い）の補正も自然で、思い通りの方向にスッとコンボが入る。特にアサシンやメイジ系のヒーローを触った時、移動スキルで一気に相手の裏に回り込んで高火力コンボを叩き込む感覚は、アクションゲームとしての爽快感がズバ抜けている。
          </p>

          <p>
            また、三国志や東洋神話（諸葛亮、孫悟空、貂蝉など）をモチーフにしたヒーローたちのグラフィックやスキルエフェクトも派手で、動かしているだけで純粋に気持ちがいい。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 気になるところ：大味な展開になりやすい
          </h2>

          <p>
            良いことばかり書くのもフェアじゃないので気になった点も。
          </p>

          <p>
            試合スピードが速くゴールドの入りが良いため、一度有利を作ったチームがそのまま雪だるま式（スノーボール）に押し切る展開が多い。じっくりと盤面をコントロールして耐え忍び、逆転するような重厚なマクロ戦を楽しみたい人には、少し大味に感じられるかもしれない。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 総評：こんな人におすすめ
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>1試合15分程度でサクサク対戦を楽しみたい人</li>
            <li>難しい操作に悩まされず、ド派手なスキルコンボで爽快感を味わいたい人</li>
            <li>友達とボイスチャットを繋いで気軽にフルパーティで遊びたい人</li>
          </ul>

          <p>
            敷居は低く設定されているので、MOBA未経験者が最初に触るタイトルとしても非常に完成度が高い。気になった方はぜひ一度触ってみてほしい。
          </p>

          <div className="pt-6 text-center">
            <a
              href="https://hok.hub-game.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              Honor of Kings HubでTier表やビルドを見る
            </a>
          </div>
        </article>
      </main>

      <FooterNav />
    </div>
  );
}
