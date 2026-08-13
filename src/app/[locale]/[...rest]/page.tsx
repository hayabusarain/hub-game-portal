import { notFound } from 'next/navigation';

// ロケール配下の未知のパスをすべて 404（not-found.tsx）へ流す catch-all。
// これが無いと未知のURLはロケールレイアウトを通らず、
// ナビ無しのルート側デフォルト404が表示されてしまう。
export default function CatchAllPage() {
  notFound();
}
