# MLBB からの申し送り：屋号を「Mobare Hub」に変えた

2026-10-03 に MLBB のサイト（`C:/Users/81901/Desktop/モバレサイト`）のセッションが書いた。**コミットしていない。** 扱いはこのリポジトリのセッションで決めてください。

## 何が変わったか

MLBB のサイトの屋号を **「MLBB Hub」から「Mobare Hub」**（読みは「モバレハブ」）に変えた。2026-10-03 に本番へ出している（MLBB のコミット d529ec2）。

- 理由: 「MLBB Hub」は海外の Facebook ページ・YouTube チャンネル・Telegram チャンネルが使っていて、Google の検索候補の「mlbb hub」もそちらを指していた。日本の読者がいちばん使う呼び名「モバレ」をヘボン式でローマ字にした
- **URL は変えていない。** https://hub-game.com/mlbb/ja のまま
- 表記は英字の「Mobare Hub」（Honor of Kings Hub・Wild Rift Hub と同じ形）。日本語の本文で初めて出すところは「Mobare Hub（モバレハブ）」と読みを添えるとよい
- MLBB 側のトップの表題は「【モバレ】モバイルレジェンドの攻略データ・Tier表 | Mobare Hub（モバレハブ）」

## このリポジトリで直すところ（2026-10-03 に読んで数えた）

- `messages/ja.json` の 23 か所と `messages/en.json` の 22 か所。どれも記事の出典リンクの名前で、「MLBB Hub: レーン別Tier表」「MLBB Hub: tier lists by lane」の形。頭の「MLBB Hub」を「Mobare Hub」にする
- `AGENTS.md:144` の「姉妹サイト3つ（HoK Hub・MLBB Hub・Wild Rift Hub）」
- `src/app/[locale]/guides/mobile-legends/page.tsx:17-18, 137`、`src/app/[locale]/guides/term-mapping/page.tsx:32`、`src/app/[locale]/page.tsx:59` はコメント。直すなら同じ置き換えでよい

直さなくてよいもの:
- `src/data/highlights.ts` の `SITE_LABELS.mlbb` は「Mobile Legends」（ゲーム名）なので、そのままでよい
- `docs/ADSENSE_REVIEW_LOG.md` と `docs/HANDOFF_TO_MLBB_2026-09-08.md` は過去の記録なので、当時の名前のままでよい
- 姉妹サイトの更新の取り込み（/api/latest から作る最新データ表）は、URL が変わっていないので影響しない見込み

## 確かめ方

`git grep -n "MLBB Hub"` で、上の「直さなくてよいもの」以外が0件になればよい。
