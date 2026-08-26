import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from "@/i18n/routing";
import { BookMarked, ChevronRight } from "lucide-react";
import HeaderNav from "@/components/HeaderNav";
import FooterNav from "@/components/FooterNav";
import MobaGlossary from "@/components/MobaGlossary";
import JsonLd from "@/components/JsonLd";
import { toAnchorId } from '@/utils/glossary';
import { buildBreadcrumb, buildDefinedTermSet, buildGraph } from '@/utils/jsonld';
import { getAlternates } from '@/utils/seo';
import { SITE_ORIGINS, type HighlightSite } from '@/data/highlights';

// messages/{locale}.json の Glossary.terms に対応する用語データの型。
// note は2タイトルでの違いの注記、links は姉妹サイトの該当ページ（どちらも任意）
type GlossaryTermEntry = {
  term: string;
  cat: string;
  def: string;
  note?: string;
  links?: { site: HighlightSite; path: string; label: string }[];
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return { title: t('glossary.title'), description: t('glossary.description'), alternates: getAlternates(locale, '/glossary') };
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Glossary');
  const tNav = await getTranslations('Nav');
  const tGuides = await getTranslations('GuidesPage');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  // 用語データはここで読み、MobaGlossary へ props で渡す。
  // クライアント側で読むと44語の定義文が全ページのHTMLに載ってしまうため
  // （layout の NextIntlClientProvider は Glossary.terms を除いて渡している）。
  const termRecord = t.raw('terms') as Record<string, GlossaryTermEntry>;

  // 姉妹サイトへのリンクは、サーバー側でロケール付きの完全な URL に組み立ててから渡す。
  // クライアント側にオリジン表を持たせず、messages には site と path だけを書けばよい
  const termsForClient = Object.fromEntries(
    Object.entries(termRecord).map(([key, item]) => [
      key,
      {
        term: item.term,
        cat: item.cat,
        def: item.def,
        ...(item.note ? { note: item.note } : {}),
        ...(item.links?.length
          ? { links: item.links.map((l) => ({ label: l.label, href: `${SITE_ORIGINS[l.site]}/${locale}${l.path}` })) }
          : {}),
      },
    ])
  );

  // アンカーIDの生成は表示側（MobaGlossary）と同じ関数を使い、
  // 構造化データの @id が実際のカードの id と必ず一致するようにする
  const terms = Object.entries(termRecord).map(([key, item]) => ({
    anchor: toAnchorId(key),
    term: item.term,
    definition: item.def,
  }));

  const graph = buildGraph(
    buildBreadcrumb(locale, [
      { name: tBreadcrumb('home'), path: '/' },
      { name: tNav('glossary'), path: '/glossary' },
    ]),
    buildDefinedTermSet(locale, t('title'), t('description'), terms)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="flex-1 flex flex-col px-4 md:px-8 py-8 w-full max-w-5xl mx-auto gap-10">

        {/* Page Hero Header */}
        <section className="space-y-4 text-center max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-black text-amber-600 uppercase tracking-widest">
            <BookMarked size={14} />
            <span>{t('eyebrow')}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {t('title')}
          </h1>

          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed bg-white border border-slate-200 p-6 rounded-3xl text-left">
            {t('pageLead')}
          </p>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {t('description')}
          </p>
        </section>

        {/* 検索・カテゴリ絞り込み付きの用語リスト（各カードに id を振ってアンカー可能にしている） */}
        <section>
          <MobaGlossary terms={termsForClient} />
        </section>

        {/* 記事一覧への導線 */}
        <section className="pt-2">
          <Link
            href="/guides"
            className="group flex items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-3xl hover:border-amber-400 hover:bg-slate-100 transition-all"
          >
            <span className="text-sm font-black text-slate-900">{tNav('guides')}</span>
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform">
              {tGuides('readMore')}
              <ChevronRight size={14} />
            </span>
          </Link>
        </section>

      </main>

      <FooterNav />
    </div>
  );
}
