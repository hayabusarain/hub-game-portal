import type { HighlightSite } from '@/data/highlights';

/**
 * 適性診断の設問データと判定ロジック。
 *
 * サーバーコンポーネント（トップページのフォーム、/[locale]/diagnosis の結果）と
 * クライアントの上乗せ（MobaDiagnosticQuiz）の両方から読むため、
 * 'use client' を付けない純粋なモジュールにしてある。
 * ここには JSX も next-intl も入れない。表示文言は messages の Quiz 名前空間が持ち、
 * このファイルはそのキー（id）だけを持つ。
 */

export type Role = 'top' | 'jungle' | 'mid' | 'adc' | 'support';

export type QuizOption = {
  /** メッセージのキー */
  id: string;
  /** この選択肢が推すタイトル。ロール設問（Q4・Q5）では null */
  site: HighlightSite | null;
  /** 本人が直接そのロールを選んだ設問のときだけ設定する。同点時の優先に使う */
  lead?: Role;
  /** ロール判定の加点 */
  roles: Partial<Record<Role, number>>;
};

export type QuizQuestion = {
  /** メッセージのキー。フォームの input[name] にもそのまま使う */
  id: string;
  /** タイトル判定での重み。ロール設問は 0 */
  weight: number;
  options: QuizOption[];
};

/**
 * 設問の設計
 *
 * - Q1〜Q3（テンポ／操作と準備／世界観）はタイトル判定用。3タイトルなので選択肢も3つずつあり、
 *   選んだ選択肢が推すタイトルへ、その設問の重みをまるごと加える。
 *   重みは Q1 が 3、Q2 と Q3 が 2。**この配分だと最高得点が必ず1タイトルに決まる。**
 *   3・2・2 を3タイトルへ分ける形は5通りしかなく、どれも最大値がひとつだけになる
 *   （3/2/2、5/2/0、3/4/0、7/0/0、5/0/2）。引き分けは構造上起きない。
 *   Q1 を突出させていないのは、Q1 で選ばなかったタイトルでも Q2 と Q3 が揃えば勝てるようにするため。
 * - Q1・Q2 はプレイスタイルにも直結するため、ロール判定にも1点ずつの補正として効かせる。
 *   Q3 は絵柄の好みなのでロールには一切加点しない。
 * - Q4（立ち位置）・Q5（勝ち方）はロール判定用。選んだロールに +3、隣接するロールに +1。
 *   +1 の配り方は 5 ロールの置換にしてあり、どのロールも Q4・Q5 から 1 回ずつだけ +1 を受け取る。
 *   これで特定ロールに加点が偏らない。
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    weight: 3,
    options: [
      { id: 'q1a1', site: 'hok', roles: { jungle: 1, mid: 1 } },
      { id: 'q1a2', site: 'wildrift', roles: { top: 1, support: 1 } },
      { id: 'q1a3', site: 'mlbb', roles: { adc: 1, jungle: 1 } }
    ]
  },
  {
    id: 'q2',
    weight: 2,
    options: [
      { id: 'q2a1', site: 'hok', roles: { mid: 1, adc: 1 } },
      { id: 'q2a2', site: 'wildrift', roles: { support: 1, top: 1 } },
      { id: 'q2a3', site: 'mlbb', roles: { top: 1, mid: 1 } }
    ]
  },
  {
    id: 'q3',
    weight: 2,
    options: [
      { id: 'q3a1', site: 'hok', roles: {} },
      { id: 'q3a2', site: 'wildrift', roles: {} },
      { id: 'q3a3', site: 'mlbb', roles: {} }
    ]
  },
  {
    id: 'q4',
    weight: 0,
    options: [
      { id: 'q4a1', site: null, lead: 'top', roles: { top: 3, jungle: 1 } },
      { id: 'q4a2', site: null, lead: 'mid', roles: { mid: 3, top: 1 } },
      { id: 'q4a3', site: null, lead: 'jungle', roles: { jungle: 3, support: 1 } },
      { id: 'q4a4', site: null, lead: 'adc', roles: { adc: 3, mid: 1 } },
      { id: 'q4a5', site: null, lead: 'support', roles: { support: 3, adc: 1 } }
    ]
  },
  {
    id: 'q5',
    weight: 0,
    options: [
      { id: 'q5a1', site: null, lead: 'top', roles: { top: 3, mid: 1 } },
      { id: 'q5a2', site: null, lead: 'jungle', roles: { jungle: 3, support: 1 } },
      { id: 'q5a3', site: null, lead: 'mid', roles: { mid: 3, jungle: 1 } },
      { id: 'q5a4', site: null, lead: 'adc', roles: { adc: 3, top: 1 } },
      { id: 'q5a5', site: null, lead: 'support', roles: { support: 3, adc: 1 } }
    ]
  }
];

/** 同点がどうしても解けなかったときの最終的な優先順位 */
export const ROLE_ORDER: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];

/**
 * タイトルを見る順。得点が並ぶことは構造上起きないが、
 * find に順序を与えて結果が呼ぶたびに変わらないようにしておく。
 */
const SITE_ORDER: HighlightSite[] = ['hok', 'wildrift', 'mlbb'];

export type QuizResult = { site: HighlightSite; role: Role };

export function getResult(answers: number[]): QuizResult {
  const siteScores: Record<HighlightSite, number> = { hok: 0, wildrift: 0, mlbb: 0 };
  const roleScores: Record<Role, number> = { top: 0, jungle: 0, mid: 0, adc: 0, support: 0 };
  const leads: Role[] = [];

  answers.forEach((optionIndex, questionIndex) => {
    const question = QUESTIONS[questionIndex];
    const option = question.options[optionIndex];
    if (option.site) siteScores[option.site] += question.weight;
    if (option.lead) leads.push(option.lead);
    (Object.keys(option.roles) as Role[]).forEach(role => {
      roleScores[role] += option.roles[role] ?? 0;
    });
  });

  const topScore = Math.max(...SITE_ORDER.map(candidate => siteScores[candidate]));
  const site = SITE_ORDER.find(candidate => siteScores[candidate] === topScore) ?? SITE_ORDER[0];

  // 結果は、本人が直接選んだロール（Q4 と Q5）のどちらかにする。
  //
  // 得点だけで決めると、選んでいないロールが勝つことがある。Q1・Q2 の補正で2点、
  // Q4・Q5 の隣接ボーナスで2点、合わせて4点まで積めるのに対し、直接選んだロールは
  // 3点から始まるため。実際に q1=1,q2=1,q4=ミッド,q5=ADC で「TOP」が返っていた
  // （2026-09-10 に675通りを全列挙して発見）。
  //
  // Q1・Q2 の補正と隣接ボーナスは、Q4 と Q5 が食い違ったときにどちらを採るかを
  // 決めるために使う。同点なら、自分でポジションを選んだ Q4 を優先する。
  const candidates = leads.length > 0 ? leads : ROLE_ORDER;
  const max = Math.max(...candidates.map(role => roleScores[role]));
  const role = candidates.find(candidate => roleScores[candidate] === max) ?? ROLE_ORDER[0];

  return { site, role };
}

/** URL のクエリから受け取った回答。値は選択肢のインデックス、未回答・不正な値は null */
export type ParsedAnswers = {
  /** 設問順に並んだ選択肢インデックス。フォームの再表示（選択状態の復元）にも使う */
  selected: (number | null)[];
  /** 5問すべてが有効な値で埋まっているか。true のときだけ getResult に渡せる */
  complete: boolean;
  /** q1〜q5 のパラメータが1つでも付いていたか。素で開かれた場合と区別する */
  hasInput: boolean;
};

/**
 * searchParams を回答の配列に直す。
 * 範囲外の数値・数値でない文字列・同じキーの重複指定はすべて未回答として捨てる。
 * 手で URL を書き換えられても例外を投げないこと（結果ページを 500 にしない）を優先する。
 */
export function parseAnswers(
  params: Record<string, string | string[] | undefined>
): ParsedAnswers {
  let hasInput = false;

  const selected = QUESTIONS.map((question) => {
    const raw = params[question.id];
    // 同じキーが複数回付いたときは先頭だけ見る
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value !== 'string' || value.trim() === '') return null;

    hasInput = true;
    // '1.5' や '1abc' を parseInt が拾ってしまうため、整数の文字列だけを通す
    if (!/^\d+$/.test(value.trim())) return null;
    const index = Number(value.trim());
    return index < question.options.length ? index : null;
  });

  return {
    selected,
    complete: selected.every((value): value is number => value !== null),
    hasInput
  };
}
