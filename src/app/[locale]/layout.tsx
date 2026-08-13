import { Geist } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import JsonLd from '@/components/JsonLd';
import { buildGraph, buildOrganization, buildWebSite } from '@/utils/jsonld';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * NextIntlClientProvider に渡す名前空間の一覧。
 *
 * ここに渡したメッセージは RSC ペイロードとして全ページのHTMLに丸ごと埋め込まれる。
 * 全件（19名前空間・394件）を渡すと、トップページのHTMLにも用語集44語の定義文や
 * 利用規約の禁止事項まで載ってしまうため、クライアントコンポーネントが
 * 実際に読む名前空間だけに絞る。
 *
 * 一覧は src 配下の 'use client' を grep して機械的に抽出したもの:
 * - 'Nav'      : src/components/HeaderNav.tsx         useTranslations('Nav')
 * - 'Quiz'     : src/components/MobaDiagnosticQuiz.tsx useTranslations('Quiz')
 * - 'Glossary' : src/components/MobaGlossary.tsx       useTranslations('Glossary')
 *                （ラベル類のみ。用語データ本体の terms は容量が大きいので
 *                  用語集ページから props で渡し、下の絞り込みで除外している）
 * - 'Error'    : src/app/[locale]/error.tsx            useTranslations('Error')
 *
 * src/components/LanguageSwitcher.tsx は useLocale だけでメッセージを読まないため不要。
 * FooterNav はサーバーコンポーネントに変えたので、ここではなく getTranslations で読む。
 *
 * サーバーコンポーネントの getTranslations はこの props とは無関係に
 * src/i18n/request.ts のメッセージを直接読むため、この絞り込みの影響を受けない。
 */
const CLIENT_NAMESPACES = ['Nav', 'Quiz', 'Glossary', 'Error'] as const;

// ロケールごとにメタデータを生成する（Next 16 では params は Promise）
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    metadataBase: new URL('https://hub-game.com'),
    title: { default: t('home.title'), template: '%s | HUB-GAME' },
    description: t('home.description'),
    openGraph: {
      siteName: 'HUB-GAME',
      type: 'website',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      url: `https://hub-game.com/${locale}`,
    },
    // OGP画像は opengraph-image.tsx が自動で付くので、カード種別だけ大きい方を指定する
    twitter: { card: 'summary_large_image' },
    appleWebApp: { capable: true, statusBarStyle: 'default', title: 'HUB-GAME' },
    other: { 'google-adsense-account': 'ca-pub-7201202773518258' },
  };
}

// 対応ロケールを静的生成の対象にする
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // 受け取ったロケールが有効か検証する
  if (!routing.locales.includes(locale as "en" | "ja")) {
    notFound();
  }

  // 静的レンダリングを有効にするため、リクエストのロケールを確定させる
  setRequestLocale(locale);

  // クライアントコンポーネントが使う名前空間だけを取り出してクライアントへ渡す
  const allMessages = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES
      .filter((namespace) => namespace in allMessages)
      .map((namespace) => {
        // Glossary.terms（44語の定義文・約12KB）は用語集ページが props で渡すので、
        // 全ページに配る分からは外す。ラベル類だけを残す。
        if (namespace === 'Glossary') {
          const glossary = allMessages[namespace] as Record<string, unknown>;
          const labels = Object.fromEntries(
            Object.entries(glossary).filter(([key]) => key !== 'terms')
          );
          return [namespace, labels];
        }
        return [namespace, allMessages[namespace]];
      })
  );

  // 運営者とサイトの情報は全ページ共通なのでレイアウトで1回だけ出す。
  // sameAs に姉妹サイトを並べ、同一運営であることを検索エンジンに示す。
  const t = await getTranslations({ locale, namespace: 'Meta' });
  const tNav = await getTranslations({ locale, namespace: 'Nav' });
  const siteGraph = buildGraph(buildOrganization(), buildWebSite(locale, t('home.description')));

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {/* ヘッダーのナビ（デスクトップ用とモバイル用で重複描画され最大10リンク）を
            Tab で通過せずに本文へ入れるようにする。飛び先の #main は HeaderNav が
            <header> の直後に置いている（page.tsx が担当外のため）。
            通常は視覚的に隠し、フォーカスされたときだけ左上に浮かせて出す。
            sticky ヘッダー（z-50）に隠れないよう z-index を上に取る。 */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-xl focus:bg-slate-950 focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:shadow-xl focus:outline-2 focus:outline-offset-2 focus:outline-amber-400"
        >
          {tNav('skipToContent')}
        </a>
        <JsonLd data={siteGraph} />
        <NextIntlClientProvider messages={clientMessages}>
          <div className="w-full mx-auto min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
