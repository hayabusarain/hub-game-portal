import { Link } from "@/i18n/routing";
import { Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HeaderNav from "@/components/HeaderNav";
import FooterNav from "@/components/FooterNav";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumb, buildGraph } from '@/utils/jsonld';
import { getAlternates } from '@/utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return { title: t('contact.title'), description: t('contact.description'), alternates: getAlternates(locale, '/contact') };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  // 表示中のパンくずと同じ階層を構造化データにも出す
  const graph = buildGraph(
    buildBreadcrumb(locale, [
      { name: tBreadcrumb('home'), path: '/' },
      { name: t('title'), path: '/contact' },
    ])
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-8 py-8">
        {/* パンくず（ホーム / 現在のページ） */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <li>
              <Link href="/" className="hover:text-slate-900 transition-colors">
                {tBreadcrumb('home')}
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span aria-current="page" className="text-slate-700">{t('title')}</span>
            </li>
          </ol>
        </nav>

        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-6">
          {t('title')}
        </h1>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <p className="text-slate-600 text-sm mb-6 leading-relaxed font-medium">
            {t('text')}
          </p>

          <div className="flex flex-col gap-3">
            {/* メール窓口（主たる連絡先） */}
            <a
              href="mailto:contact@hub-game.com"
              className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:scale-[0.99] transition-all"
            >
              <div className="w-11 h-11 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <Mail size={20} />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-sm">{t('emailLabel')}</div>
                <div className="text-xs text-slate-500 font-medium">contact@hub-game.com</div>
              </div>
            </a>

            {/* X（旧Twitter）窓口 */}
            <a
              href="https://x.com/hub_gamecom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:scale-[0.99] transition-all"
            >
              <div className="w-11 h-11 shrink-0 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z"></path>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-sm">{t('xLabel')}</div>
                <div className="text-xs text-slate-500 font-medium">@hub_gamecom</div>
              </div>
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-500 font-medium whitespace-pre-wrap">
            {t('note')}
          </p>
        </div>
      </main>

      <FooterNav />
    </div>
  );
}
