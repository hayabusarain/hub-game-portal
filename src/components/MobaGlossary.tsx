'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, BookA } from "lucide-react";

export default function MobaGlossary() {
  const t = useTranslations('Glossary');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const terms = [
    { term: "ガンク (Gank)", cat: "combat", desc: "他のレーンから急襲して、数的優位を作って敵を倒すこと。" },
    { term: "レーニング (Laning)", cat: "basic", desc: "序盤に自分のレーンでミニオンを倒し、経験値とゴールドを稼ぐフェーズ。" },
    { term: "ジャングル (Jungle)", cat: "map", desc: "レーンとレーンの間にある森のエリア。中立モンスターが生息している。" },
    { term: "マクロ (Macro)", cat: "macro", desc: "マップ全体の状況把握や、オブジェクト管理など大局的な戦略のこと。" },
    { term: "ピール (Peel)", cat: "combat", desc: "味方のキャリー（火力役）を敵の攻撃から守ること。" },
  ];

  const categories = [
    { id: 'all', label: t('all') },
    { id: 'basic', label: t('basic') },
    { id: 'map', label: t('map') },
    { id: 'combat', label: t('combat') },
    { id: 'macro', label: t('macro') },
  ];

  const filtered = terms.filter(item => {
    const matchSearch = item.term.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase());
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
            type="text" 
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === c.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <BookA size={16} className="text-indigo-500" />
                <h4 className="font-bold text-slate-800">{item.term}</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-bold text-slate-400">用語が見つかりません</p>
          </div>
        )}
      </div>

    </div>
  );
}
