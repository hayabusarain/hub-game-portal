const fs = require('fs');
const path = require('path');

const jaPath = path.join(__dirname, 'messages', 'ja.json');
const enPath = path.join(__dirname, 'messages', 'en.json');

const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const newJa = {
  Header: {
    home: "ホーム",
    guides: "ガイド",
    compare: "比較",
    quiz: "診断",
    glossary: "用語集"
  },
  Footer: {
    quickLinks: "クイックリンク",
    games: "ゲーム",
    rights: "© 2026 HUB-GAME. All rights reserved."
  },
  Guides: {
    title: "MOBAガイド＆記事",
    subtitle: "初心者から上級者まで役立つ攻略情報",
    searchPlaceholder: "記事を検索...",
    readMore: "続きを読む",
    backToGuides: "ガイド一覧へ戻る",
    relatedArticles: "関連記事"
  },
  Quiz: {
    title: "MOBA適性診断",
    subtitle: "あなたにぴったりのMOBAを見つけよう",
    start: "診断を開始する",
    q1: "1試合のプレイ時間は？",
    q1a1: "15分程度のサクッと派",
    q1a2: "20分以上のガッツリ派",
    q2: "キャラクターの操作感は？",
    q2a1: "直感的で爽快感重視",
    q2a2: "奥深く精密な操作がしたい",
    q3: "グラフィックの好みは？",
    q3a1: "東洋ファンタジー・美麗系",
    q3a2: "西洋ファンタジー・重厚系",
    resultHok: "あなたには「Honor of Kings」がおすすめ！",
    resultHokDesc: "テンポが良く爽快感抜群。東洋的な世界観が好きなあなたにぴったりです。",
    resultWr: "あなたには「ワイルドリフト」がおすすめ！",
    resultWrDesc: "奥深い戦略性と精密な操作。PCライクな本格MOBAをスマホで楽しみたいあなたへ。",
    playNow: "今すぐプレイ",
    readGuide: "初心者ガイドを読む"
  },
  Glossary: {
    title: "MOBA用語辞典",
    searchPlaceholder: "用語を検索...",
    all: "すべて",
    basic: "基本",
    map: "マップ",
    combat: "戦闘",
    macro: "マクロ"
  }
};

const newEn = {
  Header: {
    home: "Home",
    guides: "Guides",
    compare: "Compare",
    quiz: "Quiz",
    glossary: "Glossary"
  },
  Footer: {
    quickLinks: "Quick Links",
    games: "Games",
    rights: "© 2026 HUB-GAME. All rights reserved."
  },
  Guides: {
    title: "MOBA Guides & Articles",
    subtitle: "Strategy guides from beginner to advanced",
    searchPlaceholder: "Search articles...",
    readMore: "Read More",
    backToGuides: "Back to Guides",
    relatedArticles: "Related Articles"
  },
  Quiz: {
    title: "MOBA Diagnostic Quiz",
    subtitle: "Find the perfect MOBA for you",
    start: "Start Quiz",
    q1: "Match duration?",
    q1a1: "Quick 15 mins",
    q1a2: "Deep 20+ mins",
    q2: "Gameplay feel?",
    q2a1: "Intuitive & fast-paced",
    q2a2: "Deep & precise",
    q3: "Art style?",
    q3a1: "Eastern Fantasy",
    q3a2: "Western Fantasy",
    resultHok: "Honor of Kings is perfect for you!",
    resultHokDesc: "Fast-paced and exciting with beautiful Eastern aesthetics.",
    resultWr: "Wild Rift is perfect for you!",
    resultWrDesc: "Deep strategy and precise mechanics. PC-like MOBA experience on mobile.",
    playNow: "Play Now",
    readGuide: "Read Guide"
  },
  Glossary: {
    title: "MOBA Glossary",
    searchPlaceholder: "Search terms...",
    all: "All",
    basic: "Basic",
    map: "Map",
    combat: "Combat",
    macro: "Macro"
  }
};

Object.assign(ja, newJa);
Object.assign(en, newEn);

fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));

console.log("i18n updated");
