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
  /** タイトル判定の重み。負なら Honor of Kings 寄り、正ならワイルドリフト寄り */
  title: number;
  /** 本人が直接そのロールを選んだ設問のときだけ設定する。同点時の優先に使う */
  lead?: Role;
  /** ロール判定の加点 */
  roles: Partial<Record<Role, number>>;
};

export type QuizQuestion = {
  /** メッセージのキー。フォームの input[name] にもそのまま使う */
  id: string;
  options: QuizOption[];
};

/**
 * 設問の設計
 *
 * - Q1〜Q3（テンポ／操作感／世界観）はタイトル判定用。重みは ±1 のみで、3問＝奇数なので
 *   合計が 0 になることがなく、Honor of Kings とワイルドリフトの引き分けは構造上起きない。
 *   このうち Q1・Q2 はプレイスタイルにも直結するため、ロール判定にも ±1 の補正として効かせる。
 *   Q3 は見た目の好みなのでロールには一切加点しない。
 * - Q4（立ち位置）・Q5（勝ち方）はロール判定用。選んだロールに +3、隣接するロールに +1。
 *   +1 の配り方は 5 ロールの置換にしてあり、どのロールも Q4・Q5 から 1 回ずつだけ +1 を受け取る。
 *   これで特定ロールに加点が偏らない。
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    options: [
      { id: 'q1a1', title: -1, roles: { jungle: 1, mid: 1 } },
      { id: 'q1a2', title: 1, roles: { adc: 1, top: 1 } }
    ]
  },
  {
    id: 'q2',
    options: [
      { id: 'q2a1', title: -1, roles: { top: 1, mid: 1 } },
      { id: 'q2a2', title: 1, roles: { support: 1, adc: 1 } }
    ]
  },
  {
    id: 'q3',
    options: [
      { id: 'q3a1', title: -1, roles: {} },
      { id: 'q3a2', title: 1, roles: {} }
    ]
  },
  {
    id: 'q4',
    options: [
      { id: 'q4a1', title: 0, lead: 'top', roles: { top: 3, jungle: 1 } },
      { id: 'q4a2', title: 0, lead: 'mid', roles: { mid: 3, top: 1 } },
      { id: 'q4a3', title: 0, lead: 'jungle', roles: { jungle: 3, support: 1 } },
      { id: 'q4a4', title: 0, lead: 'adc', roles: { adc: 3, mid: 1 } },
      { id: 'q4a5', title: 0, lead: 'support', roles: { support: 3, adc: 1 } }
    ]
  },
  {
    id: 'q5',
    options: [
      { id: 'q5a1', title: 0, lead: 'top', roles: { top: 3, mid: 1 } },
      { id: 'q5a2', title: 0, lead: 'jungle', roles: { jungle: 3, support: 1 } },
      { id: 'q5a3', title: 0, lead: 'mid', roles: { mid: 3, jungle: 1 } },
      { id: 'q5a4', title: 0, lead: 'adc', roles: { adc: 3, top: 1 } },
      { id: 'q5a5', title: 0, lead: 'support', roles: { support: 3, adc: 1 } }
    ]
  }
];

/** 同点がどうしても解けなかったときの最終的な優先順位 */
export const ROLE_ORDER: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];

export type QuizResult = { isHok: boolean; role: Role };

export function getResult(answers: number[]): QuizResult {
  let titleScore = 0;
  const roleScores: Record<Role, number> = { top: 0, jungle: 0, mid: 0, adc: 0, support: 0 };
  const leads: Role[] = [];

  answers.forEach((optionIndex, questionIndex) => {
    const option = QUESTIONS[questionIndex].options[optionIndex];
    titleScore += option.title;
    if (option.lead) leads.push(option.lead);
    (Object.keys(option.roles) as Role[]).forEach(role => {
      roleScores[role] += option.roles[role] ?? 0;
    });
  });

  // 同点のときは、本人がロールを直接選んでいる Q4 → Q5 の回答を優先する。
  // それでも決まらない場合だけ ROLE_ORDER で確定させる。
  const priority = [...leads, ...ROLE_ORDER];
  const max = Math.max(...ROLE_ORDER.map(role => roleScores[role]));
  const role = priority.find(candidate => roleScores[candidate] === max) ?? ROLE_ORDER[0];

  return { isHok: titleScore < 0, role };
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
