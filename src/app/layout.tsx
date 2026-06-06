import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl relative overflow-hidden flex flex-col">
          {children}
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
