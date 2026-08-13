import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://hub-game.com';

/**
 * ページごとの canonical と hreflang を生成する。
 * head 内に <link rel="alternate" hreflang="..."> を出力させるため、
 * 各ページの generateMetadata から実パスを渡して呼ぶ。
 */
export function getAlternates(locale: string, pathname: string): Metadata['alternates'] {
  // 動的セグメントを展開せずに渡すと、全ページが同一の実在しないURLへ
  // 正規化される事故になるため開発時に検知する
  if (process.env.NODE_ENV !== 'production' && pathname.includes('[')) {
    throw new Error(`getAlternates に未展開の動的パスが渡されました: ${pathname}`);
  }

  const path = pathname === '/' ? '' : pathname.startsWith('/') ? pathname : `/${pathname}`;

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${BASE_URL}/${l}${path}`;
  }
  // 言語を判定できない訪問者向けの既定は主言語（en）
  languages['x-default'] = `${BASE_URL}/${routing.defaultLocale}${path}`;

  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages,
  };
}
