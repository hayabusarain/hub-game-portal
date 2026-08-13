# HUB-GAME Portal

スマホMOBAの攻略ポータル [hub-game.com](https://hub-game.com) のソースコードです。
ワイルドリフトとオナー・オブ・キングスの比較記事・適性診断・用語集を掲載し、姉妹サイト
[wildrift.hub-game.com](https://wildrift.hub-game.com) / [hok.hub-game.com](https://hok.hub-game.com)
への入口となるハブサイトです。

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
