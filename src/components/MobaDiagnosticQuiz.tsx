'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Swords,
  Wand2,
  Compass,
  Crosshair,
  HeartHandshake,
  type LucideIcon
} from "lucide-react";

const SITE_URL = 'https://hub-game.com';

type Role = 'top' | 'jungle' | 'mid' | 'adc' | 'support';

type QuizOption = {
  /** メッセージのキー */
  id: string;
  /** タイトル判定の重み。負なら Honor of Kings 寄り、正ならワイルドリフト寄り */
  title: number;
  /** 本人が直接そのロールを選んだ設問のときだけ設定する。同点時の優先に使う */
  lead?: Role;
  /** ロール判定の加点 */
  roles: Partial<Record<Role, number>>;
};

type QuizQuestion = {
  /** メッセージのキー */
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
const QUESTIONS: QuizQuestion[] = [
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
const ROLE_ORDER: Role[] = ['top', 'jungle', 'mid', 'adc', 'support'];

const ROLE_ICONS: Record<Role, LucideIcon> = {
  top: Swords,
  jungle: Compass,
  mid: Wand2,
  adc: Crosshair,
  support: HeartHandshake
};

type QuizResult = { isHok: boolean; role: Role };

function getResult(answers: number[]): QuizResult {
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

export default function MobaDiagnosticQuiz() {
  const t = useTranslations('Quiz');
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);

  // 設問が切り替わっても、回答ボタンは同じDOM要素が使い回されて中身だけ差し替わる。
  // そのままではスクリーンリーダーに次の設問が読み上げられないため、
  // 新しい設問の見出しへフォーカスを移して読み上げさせる。
  useEffect(() => {
    if (started && answers.length < QUESTIONS.length) {
      questionHeadingRef.current?.focus();
    }
  }, [started, answers.length]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => [...prev, optionIndex]);
  };

  const reset = () => {
    setAnswers([]);
    setStarted(false);
  };

  if (!started) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2 shadow-inner">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-800">{t('title')}</h3>
          <p className="text-sm text-slate-600 font-medium">{t('subtitle')}</p>
          <button
            onClick={() => setStarted(true)}
            className="mt-2 w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {t('start')} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (answers.length < QUESTIONS.length) {
    const current = answers.length;
    const question = QUESTIONS[current];
    const progress = ((current + 1) / QUESTIONS.length) * 100;

    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div
            role="progressbar"
            aria-label={t('title')}
            aria-valuenow={current + 1}
            aria-valuemin={1}
            aria-valuemax={QUESTIONS.length}
            className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs font-black text-slate-400">{current + 1} / {QUESTIONS.length}</span>
        </div>

        {/* 設問が切り替わったときにフォーカスを受け取れるよう tabIndex={-1} を付ける */}
        <h3
          ref={questionHeadingRef}
          tabIndex={-1}
          className="text-lg font-black text-slate-800 mb-6 text-center leading-snug"
        >
          {t(question.id)}
        </h3>

        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(i)}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-700 font-bold text-sm text-left hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all active:scale-[0.98] flex items-center justify-between gap-3 group"
            >
              <span className="leading-snug">{t(option.id)}</span>
              <div className="w-5 h-5 shrink-0 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 flex items-center justify-center transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 scale-0 group-hover:scale-100 transition-transform"></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 結果
  const { isHok, role } = getResult(answers);
  const RoleIcon = ROLE_ICONS[role];
  const gameName = isHok ? t('gameHok') : t('gameWr');
  const roleName = t(`role_${role}`);
  const accent = isHok
    ? 'from-amber-400 to-orange-500'
    : 'from-indigo-500 to-blue-600';

  const shareText = t('shareText', { game: gameName, role: roleName });
  const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(SITE_URL)}`;

  return (
    <div className="bg-white rounded-3xl p-1 overflow-hidden border border-slate-200 shadow-xl shadow-indigo-100/50">
      <div className={`p-6 rounded-[22px] bg-gradient-to-br ${isHok ? 'from-amber-50 to-orange-50' : 'from-indigo-50 to-blue-50'} flex flex-col items-center text-center gap-5 relative`}>

        <div className={`absolute top-0 right-0 w-40 h-40 rounded-full mix-blend-overlay filter blur-3xl opacity-60 ${isHok ? 'bg-amber-400' : 'bg-indigo-400'}`}></div>

        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative z-10 bg-gradient-to-br ${accent} text-white`}>
          <CheckCircle2 size={32} />
        </div>

        <div className="relative z-10">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 mb-1.5">
            {t('resultTitleLabel')}
          </p>
          <h3 className="text-xl font-black text-slate-900 mb-2">
            {isHok ? t('resultHok') : t('resultWr')}
          </h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            {isHok ? t('resultHokDesc') : t('resultWrDesc')}
          </p>
        </div>

        <div className="relative z-10 w-full rounded-2xl bg-white/80 border border-white p-5 text-left shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${accent}`}>
              <RoleIcon size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">
                {t('resultRoleLabel')}
              </p>
              <p className="text-base font-black text-slate-900 leading-tight">{roleName}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            {t(`role_${role}_desc`)}
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 relative z-10">
          <Link
            href={isHok ? "/guides/honor-of-kings" : "/guides/wild-rift"}
            className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {t('readGuide')} <ArrowRight size={16} />
          </Link>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-sm shadow-sm hover:border-slate-900 hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z"></path>
            </svg>
            {t('share')}
          </a>

          <button
            onClick={reset}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 py-2 flex items-center justify-center gap-1"
          >
            <RotateCcw size={14} /> {t('retake')}
          </button>
        </div>
      </div>
    </div>
  );
}
