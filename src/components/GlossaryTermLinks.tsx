import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { BookMarked } from 'lucide-react';
import { toAnchorId } from '@/utils/glossary';

/**
 * 記事の末尾に置く「この記事に出てきた用語」ブロック。
 *
 * 本文中の語をリンク化すると翻訳文にマークアップを混ぜることになり
 * 保守が重くなるため、記事の最後にまとめて用語集へ送る形にしている。
 * 用語名は Glossary.terms から引くので、このコンポーネントに文言は持たせない。
 *
 * termKeys には messages の Glossary.terms のキーを渡す（例: 'Gank', 'LastHit'）。
 */
export default async function GlossaryTermLinks({ termKeys }: { termKeys: string[] }) {
  const tGlossary = await getTranslations('Glossary');
  const tGuides = await getTranslations('GuidesPage');

  const terms = tGlossary.raw('terms') as Record<string, { term: string }>;

  // messages に無いキーを渡してしまった場合は黙って落とす（記事の表示を壊さない）
  const items = termKeys
    .filter((key) => terms[key])
    .map((key) => ({ key, label: terms[key].term, anchor: toAnchorId(key) }));

  if (items.length === 0) return null;

  return (
    <aside className="mt-10 pt-6 border-t border-slate-200">
      <h2 className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3">
        <BookMarked size={16} className="text-amber-600" />
        {tGuides('relatedTerms')}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              href={`/glossary#${item.anchor}`}
              className="inline-flex px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-amber-400 hover:text-amber-700 transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
