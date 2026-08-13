import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

/**
 * SNS シェア用の OGP 画像を動的生成する。
 * このファイルを [locale] 直下に置くと、配下の全ページに継承される
 * （個別に差し替えたいページがあれば、そのディレクトリに同名ファイルを置く）。
 */

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'HUB-GAME';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });

  // 見出しは何のサイトかを示し、その下では扱っている2タイトルを具体的に見せる
  const headline = t('heading');
  const covers =
    locale === 'ja'
      ? 'ワイルドリフト × オナー・オブ・キングス'
      : 'Wild Rift  ×  Honor of Kings';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          // サイトのヘッダー・フッターと同じダークな地に、アクセントの琥珀色を差す
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e1b4b 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '18px',
              height: '64px',
              borderRadius: '9px',
              background: 'linear-gradient(180deg, #fbbf24 0%, #6366f1 100%)',
            }}
          />
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, color: '#ffffff', letterSpacing: '-1px' }}>
            HUB
            <span style={{ color: '#fbbf24' }}>-GAME</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: '36px',
            fontSize: 44,
            fontWeight: 700,
            color: '#e2e8f0',
            lineHeight: 1.3,
            maxWidth: '900px',
          }}
        >
          {headline}
        </div>

        <div style={{ display: 'flex', marginTop: '28px', fontSize: 30, color: '#fbbf24', fontWeight: 600 }}>
          {covers}
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', fontSize: 24, color: '#64748b' }}>
          hub-game.com
        </div>
      </div>
    ),
    size
  );
}
