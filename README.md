# HUB-GAME Portal

スマホMOBAの攻略ポータル [hub-game.com](https://hub-game.com) のソースコードです。
オナー・オブ・キングス、ワイルドリフト、モバイル・レジェンドの比較記事・用語集を掲載し、姉妹サイト
[hok.hub-game.com](https://hok.hub-game.com) / [wildrift.hub-game.com](https://wildrift.hub-game.com) /
[mlbb.hub-game.com](https://mlbb.hub-game.com) への入口となるハブサイトです。
適性診断は 2026-09-27 に廃止した（旧 URL の `/ja/diagnosis` と `/en/diagnosis` は各言語のトップへ 301）。

## 技術構成

- [Next.js 16](https://nextjs.org)（App Router）
- [next-intl 4](https://next-intl.dev)（日英2言語対応）
- [Tailwind CSS 4](https://tailwindcss.com)
- React 19

## 開発コマンド

```bash
npm run dev    # 開発サーバーを起動（http://localhost:3000）
npm run build  # 本番ビルド
npm run lint   # ESLint によるチェック
```

## サイト統合（2026-09-27 運営者了承）

4サイトを hub-game.com の1つにまとめ、Cloudflare（Workers の静的アセット）へ移す予定。
ポータルはドメイン直下、姉妹サイトは `/hok`・`/mlbb`・`/wildrift` の下に入る。計画は HoK のリポジトリの `docs/CONSOLIDATION_PLAN.md`。

統合後の形は、ビルド時の環境変数 `NEXT_PUBLIC_SITE_ORIGIN=https://hub-game.com` で切り替わる（`src/lib/siteOrigin.ts`）。
無ければ今の Vercel 向けのまま。統合後のビルドは静的書き出し（`out/`）で、`src/proxy.ts` は動かない。
`/` のブラウザの言語による振り分けは `worker/entry.js`（hub-game-rules から配られる）、
転送とヘッダーは `src/app/%5Fredirects`・`%5Fheaders` が書き出す `_redirects`・`_headers` が受け持つ。
手元の確認の手順は `wrangler.jsonc` の冒頭にある（`next start` は静的書き出しでは使えない）。

## ディレクトリ構成の要点

```
src/
  app/
    [locale]/        # ロケール別ページ（ja / en）。レイアウトとメタデータもここで生成
    page.tsx         # ルートアクセスをデフォルトロケール（ja）へリダイレクト
    sitemap.ts       # サイトマップ生成
    manifest.ts      # PWA マニフェスト
  i18n/
    routing.ts       # 対応ロケールとデフォルトロケールの定義（一元管理）
  proxy.ts           # next-intl ミドルウェア（ロケール判定・リダイレクト）
messages/
  ja.json            # 日本語の翻訳メッセージ
  en.json            # 英語の翻訳メッセージ
```

## 翻訳の追加手順

1. `messages/ja.json` と `messages/en.json` の両方に同じキーを追加する（片方だけの追加は不可）。
2. サーバーコンポーネントでは `getTranslations`（`next-intl/server`）、
   クライアントコンポーネントでは `useTranslations`（`next-intl`）でキーを参照する。
3. 新しいロケールを増やす場合は `src/i18n/routing.ts` の `locales` に追加し、
   `messages/` に対応する JSON ファイルを用意する。
