'use client';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, BookA, Link2, ArrowUpRight } from "lucide-react";
// アンカーIDの生成はサーバー側（JSON-LD）とも共有するため utils に置いている
import { toAnchorId } from "@/utils/glossary";

// 用語データの型。note と links は glossary/page.tsx が messages から組み立てて渡す
// （links の href はロケール付きの完全な URL）
type GlossaryTerm = {
  term: string;
  cat: string;
  def: string;
  note?: string;
  links?: { label: string; href: string }[];
};

// カテゴリごとのバッジ色（ライト背景でも文字が読める濃さに揃える）
const CAT_STYLES: Record<string, string> = {
  basic: 'bg-amber-50 text-amber-700 border-amber-200',
  map: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  combat: 'bg-rose-50 text-rose-700 border-rose-200',
  macro: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

/**
 * 用語データはサーバー側（glossary/page.tsx）から props で受け取る。
 *
 * ここで t.raw('terms') を読むと、44語の定義文（約12KB）が
 * NextIntlClientProvider 経由で全ページのHTMLに埋め込まれてしまうため、
 * 用語集ページだけが送るように外出ししている。
 */
export default function MobaGlossary({ terms: termRecord }: { terms: Record<string, GlossaryTerm> }) {
  const t = useTranslations('Glossary');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // アンカーリンクのため、値だけでなくキーも保持する
  const terms = useMemo(() => Object.entries(termRecord), [termRecord]);

  const categories = [
    { id: 'all', label: t('all') },
    { id: 'basic', label: t('basic') },
    { id: 'map', label: t('map') },
    { id: 'combat', label: t('combat') },
    { id: 'macro', label: t('macro') },
  ];

  const catLabels: Record<string, string> = {
    basic: t('basic'),
    map: t('map'),
    combat: t('combat'),
    macro: t('macro'),
  };

  const needle = query.trim().toLowerCase();
  const filtered = terms.filter(([, item]) => {
    const matchSearch =
      needle === '' ||
      item.term.toLowerCase().includes(needle) ||
      item.def.toLowerCase().includes(needle) ||
      (item.note ?? '').toLowerCase().includes(needle);
    const matchCat = filter === 'all' || item.cat === filter;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col gap-5">

      {/* Search & Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label={t('searchPlaceholder')}
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              aria-pressed={filter === c.id}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                filter === c.id
                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 語数が多いので、絞り込み結果の件数を出す */}
        <p aria-live="polite" className="text-xs font-bold text-slate-600">
          {t('count', { count: filtered.length })}
        </p>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(([key, item]) => {
            const anchorId = toAnchorId(key);
            return (
              <article
                key={key}
                id={anchorId}
                // sticky ヘッダーに隠れないようアンカー位置を下げる
                className="group scroll-mt-24 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-black text-slate-900 leading-snug flex items-center gap-2">
                    <BookA size={16} className="text-amber-600 shrink-0" />
                    {item.term}
                  </h2>
                  <a
                    href={`#${anchorId}`}
                    aria-label={item.term}
                    className="mt-0.5 text-slate-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-amber-600 transition-all"
                  >
                    <Link2 size={14} />
                  </a>
                </div>

                <span
                  className={`inline-block mb-2 px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${
                    CAT_STYLES[item.cat] ?? 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {catLabels[item.cat] ?? item.cat}
                </span>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {item.def}
                </p>

                {/* 2タイトルで呼び名や仕組みが違う語には、その差を定義の下に添える */}
                {item.note && (
                  <p className="mt-2 text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="font-black text-amber-700">{t('crossNote')}</span>
                    <span className="mx-1.5 text-slate-300" aria-hidden="true">|</span>
                    {item.note}
                  </p>
                )}

                {/* 姉妹サイトの該当ページ。用語集を攻略サイト群への入口として機能させる */}
                {item.links && item.links.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{t('seeAlso')}</span>
                    {item.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-amber-400 hover:text-amber-700 transition-colors"
                      >
                        {link.label}
                        <ArrowUpRight size={11} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-500">{t('noResults')}</p>
        </div>
      )}

    </div>
  );
}
