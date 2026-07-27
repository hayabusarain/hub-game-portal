import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HUB-GAME | 総合ゲーム攻略ポータル",
  description: "競技ゲーマーのための最強の戦略、ティアリスト、総合攻略ハブポータル。ワイルドリフトやその他の最新ゲーム攻略情報を網羅。",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HUB-GAME",
  },
  other: {
    'google-adsense-account': 'ca-pub-7201202773518258',
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as "en" | "ja")) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="w-full mx-auto min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
            {children}
          </div>
          <ServiceWorkerRegister />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
