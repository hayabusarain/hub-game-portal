import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { TriangleAlert, ArrowRight, ArrowUpRight } from 'lucide-react';
import { toAnchorId } from '@/utils/glossary';

/**
 * トップに置く「最初の1試合で事故る5点」。
 *
 * 用語集（/glossary）の note にはタイトルごとの仕組みの差が1文で書かれているが、
 * 44語の中に埋もれていてトップからは辿れない。そこで初戦で判断が変わる5語だけを
 * 抜き出し、note をタイトルごとのセルに割って見せる。
 *
 * /guides/term-mapping（23項目）とは切り口を分けている。
 * あちらは「呼び名の全対応」、ここは「1試合目でやらかす点」。行を増やさないこと。
 *
 * 文言は messages の Home.firstMatch* から読む。ここで持つのは並び順とアンカーだけ。
 * サーバーコンポーネントのままにしておくこと（'use client' を付けると、
 * この文章がRSCペイロード側へ回って初期HTMLから消える）。
 */

// 表示順。messages の Home.firstMatchItems と Glossary.terms の両方でこのキーを使う
const TERM_KEYS = ['Ward', 'Recall', 'LastHit', 'Tower', 'Objective'] as const;

/**
 * タイトルごとのセル。key は messages のキー、列見出しは Home.firstMatchCol* から引く。
 * 色は他のタイトル別表示（最新データ表、最新パッチの注目）と揃える。
 */
const TITLE_CELLS = [
  { key: 'hok', label: 'firstMatchColHok', box: 'bg-amber-50/70 border-amber-100', text: 'text-amber-700' },
  { key: 'wr', label: 'firstMatchColWr', box: 'bg-cyan-50/70 border-cyan-100', text: 'text-cyan-700' },
  { key: 'mlbb', label: 'firstMatchColMlbb', box: 'bg-violet-50/70 border-violet-100', text: 'text-violet-700' },
] as const;

type FirstMatchItem = {
  label: string;
  pitfall: string;
  hok: string;
  wr: string;
  mlbb: string;
};

export default async function GlossaryHighlights() {
  const t = await getTranslations('Home');

  // messages 側の追加は統合担当がまとめて入れるため、キーが無い間も
  // トップページが壊れないように黙って描画をやめる（has で見てからraw を読む）
  if (!t.has('firstMatchItems')) return null;
  const raw = t.raw('firstMatchItems') as unknown;
  if (typeof raw !== 'object' || raw === null) return null;
  const itemsByKey = raw as Record<string, FirstMatchItem | undefined>;

  const items = TERM_KEYS.flatMap((key) => {
    const text = itemsByKey[key];
    // 5語のどれかが翻訳に無ければ、その1枚だけ落として残りを出す
    if (!text?.label) return [];
    return [{ key, anchor: toAnchorId(key), text }];
  });

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <TriangleAlert size={20} className="text-amber-500" /> {t('firstMatchTitle')}
        </h3>
        {/* 呼び名の全対応はガイド側の担当。ここから送って住み分けを見せる */}
        <Link
          href="/guides/term-mapping"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group shrink-0"
        >
          {t('firstMatchMappingLink')}{' '}
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <p className="text-xs text-slate-500 font-medium leading-relaxed -mt-1">{t('firstMatchLead')}</p>

      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={item.key}>
            <Link
              href={`/glossary#${item.anchor}`}
              className="group block bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all active:scale-[0.99]"
            >
              {/* 1セル目: つまずく場面。カードを縦に積むと表頭が付けられないので、
                  列見出しは読み上げ用に持たせ、タイトル別のセルは見えるラベルで示す */}
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-black text-slate-900 leading-snug flex items-center gap-2">
                  <span
                    className="shrink-0 w-5 h-5 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-black flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="sr-only">{t('firstMatchColConcept')}: </span>
                  {item.text.label}
                </h4>
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-slate-300 group-hover:text-amber-600 transition-colors"
                />
              </div>

              <p className="mt-1.5 text-xs text-slate-600 font-medium leading-relaxed">{item.text.pitfall}</p>

              {/* 残りのセル: 同じ場面が各タイトルでどう違うか。
                  色は他のタイトル別表示と揃える（HoK=amber / Wild Rift=cyan / MLBB=violet） */}
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {TITLE_CELLS.map((cell) => (
                  <div key={cell.key} className={`rounded-2xl border p-3 ${cell.box}`}>
                    <span className={`block text-[10px] font-black tracking-wide mb-1 ${cell.text}`}>
                      {t(cell.label)}
                    </span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.text[cell.key]}</p>
                  </div>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
