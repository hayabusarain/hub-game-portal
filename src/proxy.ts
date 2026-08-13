import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // API・内部パス・ドット付きの静的ファイル（robots.txt や sitemap.xml など）を除く
  // すべてのパスにミドルウェアを適用する（next-intl ドキュメント推奨の包括形）
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
