import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';
import { ArrowLeft } from 'lucide-react';

export default function WhatIsMobaPage() {
  const tCommon = useTranslations('GuidesPage');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <HeaderNav />

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-10 space-y-8">
        {/* Simple navigation */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          {tCommon('backToGuides')}
        </Link>

        {/* Real essay header */}
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <div className="text-xs font-medium text-amber-400">
            コラム / 雑記
          </div>

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-snug">
            MOBAっていう底なし沼にハマって5年が経った話
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>投稿日: 2026年7月</span>
            <span>•</span>
            <span>執筆: 一ゲーマー</span>
          </div>
        </header>

        {/* Authentic Essay Content */}
        <article className="space-y-6 text-slate-300 leading-relaxed text-sm md:text-base font-normal">
          <p>
            最初に言っておくと、MOBA（マルチプレイヤーオンラインバトルアリーナ）は万人に「面白いからやってみなよ！」と気軽にお勧めできるゲームじゃない。
          </p>

          <p>
            自分が初めてこのジャンルに触れた日のことは、今でもよく覚えている。フレンドに誘われて軽い気持ちでインストールしたものの、画面上で何が起きているのかサッパリ分からない。どこから飛んできたのか分からないスキルを食らって一瞬で画面がモノクロになり、味方からは「頼むからおとなしくタワーの下にいてくれ」とチャットが飛んできた。
          </p>

          <p>
            正直、その日は「なんだこの理不尽なクソゲーは」と思って即アンインストールした。
          </p>

          <p className="font-semibold text-white pl-4 border-l-2 border-amber-500 py-1">
            なのに、数日後にふと「あの時、あっちの草むらを通らなければ助かったんじゃないか？」と頭をよぎり、気づけば再ダウンロードボタンを押していた。
          </p>

          <p>
            それが全ての始まりだった。今では通算のプレイ時間が2,000時間を超えている。なぜこんなにも人の時間を吸い尽くすのか、自分の体験をもとに少し整理してみたい。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 1試合20分、完璧な快感は「10試合に1回」しか来ない
          </h2>

          <p>
            MOBAというゲームは、1試合の中で味方5人・敵5人が入り乱れて争う。最初は全員レベル1から始まり、ミニオンを倒してお金を稼ぎ、装備を買って強くなっていく。
          </p>

          <p>
            正解の立ち回りなんて場面ごとに変わるし、味方との意思疎通が噛み合わなくて惨敗することもザラだ。10試合やって8試合くらいは「悔しい」「なんであそこ寄ってくれなかったんだ」と腹を立てて画面を閉じることになる。
          </p>

          <p>
            でも、残り1〜2試合で**「奇跡的な瞬間」**が訪れる。
          </p>

          <p>
            敗色濃厚だった終盤の暗闇で、集団戦のタイミングが奇跡的に合致して、相手の主要アタッカーを狙い通り一瞬で落とし、そのまま相手チームを全員全滅（ACE）させて逆転勝ちした瞬間。
          </p>

          <p>
            あの時の指の震えと脳内で弾ける快感は、他のどんなアクションゲームやFPSでも味わったことがない。あの1回の味を知ってしまうと、残りの8試合の負けやストレスが全部「前振り」に変わってしまう。これがこのジャンルの一番恐ろしいところだと思う。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 5つの役割、自分に合った居場所が見つかる
          </h2>

          <p>
            サッカーにフォワードやゴールキーパーがあるように、MOBAにも5つの役割（ロール）がある。
          </p>

          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong>TOP（トップ）:</strong> マップの端っこで延々と対面と殴り合う職人ゾーン。タイマンが好きで我慢強いやつが向いている。</li>
            <li><strong>MID（ミッド）:</strong> マップの中心で花形アサシンや魔法使いを動かす。目立ちたがり屋やプレッシャーに強いやつ向け。</li>
            <li><strong>JUNGLE（ジャングル）:</strong> レーンに出ず、森のモンスターを狩りながら不意打ちを狙う。マップ全体を見る参謀タイプ。</li>
            <li><strong>ADC（マークスマン）:</strong> 序盤は最弱だが、終盤はお金を稼ぎ切って通常攻撃だけで敵をなぎ倒すメインアタッカー。</li>
            <li><strong>SUPPORT（サポート）:</strong> 味方に回復やシールドを送り、視界を確保する。地味に見えて集団戦のきっかけを作るキーマン。</li>
          </ul>

          <p>
            最初は「自分には反射神経がないから無理だ」と思っていても、参謀役に回ったりサポートに特化したりすることで、チームの勝利に決定的な貢献ができる。自分の性格や得意分野にハマる役割が必ず見つかるのも魅力の一つだ。
          </p>

          <h2 className="text-xl font-bold text-white pt-6 border-t border-slate-800">
            ■ 最後に：これから遊ぶ人へ
          </h2>

          <p>
            もしこれからMOBAを遊んでみようと思っているなら、最初は「味方のチャットをオフにする」か「友達と一緒に遊ぶ」ことを強くおすすめする。覚えることが多すぎて最初は間違いなくボコボコにされるからだ。
          </p>

          <p>
            でも、最初の壁を乗り越えて、自分の思い通りのコンボで敵を倒せた時、あなたはきっと「あ、これやばいゲームだ」と気づくはず。
          </p>

          <div className="pt-6 text-center">
            <Link
              href="/guides/compare"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              【比較】Honor of Kingsとワイルドリフト、どっちが合いそう？
            </Link>
          </div>
        </article>
      </main>

      <FooterNav />
    </div>
  );
}
