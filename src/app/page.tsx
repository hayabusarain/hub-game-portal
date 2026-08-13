import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default function RootPage() {
  // デフォルトロケールは routing.ts で一元管理する
  redirect('/' + routing.defaultLocale);
}
