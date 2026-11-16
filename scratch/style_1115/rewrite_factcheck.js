export const meta = {
  name: 'rewrite-factcheck',
  description: 'ヒーロー解説の書き直しの1区切りで、事実が足されたり変わったりしていないかを読むだけで確かめる',
  phases: [{ title: '照合', detail: '前後の文とデータを突き合わせる（担当を分けて並べて回す）' }],
}

const A = args
const SOURCES = A.site === 'mlbb'
  ? `- 根拠にしてよいデータ: src/data/skills/ja.json（スキル本文。ゲーム内の表示の書き起こし）、src/data/hero_builds.json（バトルプランの装備）、src/data/items/ja.json（装備の効果文）、src/data/mlbb_heroes.json（公式のロール・レーン・4軸の評価）、相性の組み合わせ（src/data/hero_relations.json）。これ以外から来た事実は書いてはいけない決まり
- 対象は日本語だけ（英語は変えていない）`
  : `- 根拠にしてよいデータ: src/data/skills/ja.json と en.json（スキルの説明文と数値）、src/data/hok_items.json などの装備の効果文、src/data/hero_item_builds.json（ゲーム内の推奨セット装備）、src/data/hero_stats_camp.json（HoK Camp の統計。レーン・Tier・勝率など）、src/data/patches.json（パッチノート）。これ以外から来た事実（時刻、ほかのヒーローとの優劣、スキル本文に無い挙動、ビルドに無い装備）は書いてはいけない決まり
- ビルド解説（src/content/buildNotes.ts）は、装備の効果文だけで書く決まり（スキルには触れない）
- 立ち回りは、4節（序盤・中盤・終盤・集団戦）を3節（序盤・中盤以降・集団戦）に組み直している。終盤の節が無くなること自体は問題ではない。立ち回りでは、スキル説明にある数値を写さない決まり
- 対象は日本語と英語の両方。英語は、日本語と同じ内容になっているか、英語のスキル名が en.json の名前か、英文に日本語が混ざっていないかも見る
- 以前の文には、Web の情報を参考にして書いた記述（データに無い時刻や評価）があり、それを削るのは意図どおり。削ったことは問題にしない`

const BASE = `
# 背景
${A.site === 'mlbb' ? 'モバレ（Mobile Legends）' : 'HoK（Honor of Kings）'}の攻略サイトで、ヒーロー解説を書き直した（コミット ${A.commit}、まだ push していない）。
目的は文体をそろえること（1つの欄の中で敬体と常体を混ぜない、ぶつ切りの短文を理由でつなぐ、同じ事実を1ページに2回書かない）で、**事実を足すことも、変えることも認めていない**。
設計は C:/Users/81901/Desktop/hub-game-portal/docs/REWRITE_PLAN_2026-11-15.md。前の回の照合で見つかった型は C:/Users/81901/Desktop/hub-game-portal/scratch/rewrite_trial_1115/mlbb_r1_factcheck.json にある（見本として読む）。

# 材料（リポジトリは ${A.repo}）
- 前後の文: ${A.dir} の before.json と after.json（あれば）。無ければ git show ${A.commit} と、その親コミットの版を読み比べる
${SOURCES}
- 書き方の決まり: AGENTS.md

# やること
担当の体について、欄ごとに「前」と「後」を読み比べる。
1. **足された事実**: 「後」にあって「前」に無い主張（数値、スキルの挙動、相手ヒーローの名前、時間、強さの評価、推奨）を拾い、上のデータで裏づけられるかを確かめる。裏づけが無ければ挙げる。「定石です」「〜のが基本です」「〜が大切です」のような評価の付け足し、新しく足された理由（〜なので）や指示（〜してください）も、ここに入れる
2. **変わった事実**: 言い換えで意味が変わったもの（条件が落ちた、対象が変わった、「しにくい」が「しない」になるなど程度が強まった、因果や係り先が変わった、数値の単位や対象が変わった）。同じページのほかの欄と食い違うようになったものも挙げる
3. **消えた事実**: 「前」にあった主張が、同じ体のどの欄にも残っていないもの。同じページに重複していた分を1回にまとめたのは問題ではない
4. **日本語**: 主語と述語のねじれ（特に、名詞＋「です」で締めた文）、意味の通らない文、誇張の語（絶対・鉄則・正解・確殺・一瞬で・圧倒的・最強・定石など）、常体の文の混入、80字を超える文、同じ締め方（〜仕組みです・〜相手です・〜技です・〜形です）が1ページに2回以上
好みの問題は挙げない。本番に出すと困るものだけを挙げる。問題が無い体は ok に数える。

# 決まり
- 読むだけ。ファイルを書き換えない。git は show・log・diff だけ。ビルドもしない
- 見つけたことは、体の名前・欄・前の文・後の文を付けて書く。確かめられなかったことは「未確認」と書く
- 返す文はすべて日本語
`

const SCHEMA = {
  type: 'object',
  properties: {
    checked: { type: 'array', items: { type: 'string' }, description: '読み比べた体の名前' },
    ok_count: { type: 'number' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          hero: { type: 'string' },
          field: { type: 'string' },
          kind: { type: 'string', enum: ['足された事実', '変わった事実', '消えた事実', '日本語', '英語'] },
          before: { type: 'string' },
          after: { type: 'string' },
          problem: { type: 'string' },
          evidence: { type: 'string' },
          fix: { type: 'string' },
          severity: { type: 'string', enum: ['push を止める', '直したほうがよい', '軽微'] },
        },
        required: ['hero', 'field', 'kind', 'after', 'problem', 'fix', 'severity'],
      },
    },
    overall: { type: 'string', description: '全体の印象を2〜3文で' },
  },
  required: ['checked', 'ok_count', 'issues', 'overall'],
}

phase('照合')
const out = await parallel(A.parts.map((p, i) => () =>
  agent(`${BASE}\n# あなたの担当\n${p}`, { label: `照合:${A.site}:${i + 1}`, phase: '照合', schema: SCHEMA }).then((r) => ({ part: i + 1, ...r }))
))
return out.filter(Boolean)
