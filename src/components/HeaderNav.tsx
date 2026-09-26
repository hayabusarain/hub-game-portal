'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from "@/i18n/routing";
import { Gamepad2, Home, BookOpen, Swords, BookMarked } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function HeaderNav() {
  const t = useTranslations('Nav');
  const pathname = usePathname();

  const links = [
    { href: "/", label: t('home'), icon: Home },
    { href: "/guides", label: t('guides'), icon: BookOpen },
    { href: "/guides/compare", label: t('compare'), icon: Swords },
    { href: "/glossary", label: t('glossary'), icon: BookMarked },
  ];

  // 最長一致のリンクだけをアクティブにする
  // （/guides/compare 表示中に /guides まで同時にハイライトされるのを防ぐ）
  const activeHref = links
    .filter(link => pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <>
    {/* 夜の配色（2026-09-27）。以前は明るいページの上に置いた暗い帯（bg-slate-950）だった。
        色を写し替えると slate-950 は白に近くなるので、ページの地と同じ色の帯にして線で区切る */}
    <header className="px-4 md:px-8 py-3 bg-background/85 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Gamepad2 size={20} className="text-white" />
            </div>
            {/* サイトロゴは見出しではなくラベルなので span にする
                （各ページ本文の h1 と重複させないため） */}
            <span className="text-xl font-black tracking-wider text-slate-900">
              HUB<span className="text-amber-700">-GAME</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === activeHref;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black transition-all duration-200 ${
                    // 選択中は琥珀の線と淡い塗り。琥珀の塗りに暗い字だと、暗い地の中で1つだけ明るく浮く
                    isActive
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={15} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile nav bar */}
      <nav className="md:hidden flex items-center gap-1 pt-3 overflow-x-auto scrollbar-hide border-t border-slate-200 mt-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.href === activeHref;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon size={14} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>

    {/* layout.tsx のスキップリンク（href="#main"）の着地点。
        各ページの <main> は page.tsx 側にあり id を付けられないため、
        ヘッダーの直後に空の着地点を置いて、ナビのリンク群を飛ばせるようにする。
        sr-only なので絶対配置になり、ページのレイアウトには影響しない。 */}
    <div id="main" tabIndex={-1} className="sr-only" />
    </>
  );
}
