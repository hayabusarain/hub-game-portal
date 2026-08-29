'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { QUESTIONS } from '@/lib/quiz';

/**
 * 適性診断フォームへの、JS が動くときだけの上乗せ。
 *
 * フォーム本体（children）はサーバー側で描かれた5問ぶんの HTML をそのまま流す。
 * ここで差し替えたり隠したりはしない。JS が無ければ素の GET フォームとして成立し、
 * JS があれば回答数の表示・未回答のままの送信を止める・リセットが足される。
 *
 * children に ref は付けられないので、包んだ要素から form を引いて
 * change / submit をネイティブのリスナーで拾う。
 */

const TOTAL = QUESTIONS.length;

/** 回答済みの設問数を DOM から数える。state を経由しないので送信時も最新の値になる */
function countAnswered(form: HTMLFormElement): number {
  return QUESTIONS.filter((question) =>
    form.querySelector(`input[name="${question.id}"]:checked`)
  ).length;
}

/** 最初の未回答の設問の、先頭の選択肢を返す */
function firstUnanswered(form: HTMLFormElement): HTMLInputElement | null {
  for (const question of QUESTIONS) {
    if (!form.querySelector(`input[name="${question.id}"]:checked`)) {
      return form.querySelector<HTMLInputElement>(`input[name="${question.id}"]`);
    }
  }
  return null;
}

// children はフォーム本体（QuizForm がサーバー側で描いたもの）。
// 省略可にしてあるのは、包む相手がまだ無い状態でも型エラーにしないため
export default function MobaDiagnosticQuiz({ children }: { children?: ReactNode }) {
  const t = useTranslations('Quiz');
  const wrapRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  // ハイドレーション前と後で描画を揃えるため、上乗せぶんはマウント後にだけ出す。
  // JS が切られている環境に「0 / 5」の止まったバーを見せないためでもある
  const [enhanced, setEnhanced] = useState(false);
  const [answered, setAnswered] = useState(0);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const form = wrapRef.current?.querySelector('form');
    if (!form) return;
    formRef.current = form;
    setEnhanced(true);
    // /diagnosis から戻ってきたときは選択済みの状態で描かれるので、初回にも数える
    setAnswered(countAnswered(form));

    const onChange = () => {
      setAnswered(countAnswered(form));
      setMissing(false);
    };

    const onSubmit = (event: SubmitEvent) => {
      if (countAnswered(form) === TOTAL) return;
      // 未回答のまま送ると結果ページで「回答が足りません」に着地する。
      // JS があるなら移動せずその場で埋めてもらう
      event.preventDefault();
      setMissing(true);
      const target = firstUnanswered(form);
      if (!target) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
    };

    form.addEventListener('change', onChange);
    form.addEventListener('submit', onSubmit);
    return () => {
      form.removeEventListener('change', onChange);
      form.removeEventListener('submit', onSubmit);
    };
  }, []);

  const reset = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    // form.reset() だと defaultChecked（やり直し時の選択状態）に戻ってしまうため、明示的に外す
    form.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((input) => {
      input.checked = false;
    });
    setAnswered(0);
    setMissing(false);
    form.querySelector<HTMLInputElement>(`input[name="${QUESTIONS[0].id}"]`)?.focus();
  }, []);

  return (
    <div ref={wrapRef}>
      {enhanced && (
        <div className="mb-4 flex items-center gap-3">
          <div
            role="progressbar"
            aria-label={t('title')}
            aria-valuenow={answered}
            aria-valuemin={0}
            aria-valuemax={TOTAL}
            className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${(answered / TOTAL) * 100}%` }}
            />
          </div>
          <span aria-live="polite" className="shrink-0 text-xs font-black text-slate-500">
            {t('answered', { answered, total: TOTAL })}
          </span>
        </div>
      )}

      {children}

      {enhanced && missing && (
        <p
          role="alert"
          className="mt-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold leading-relaxed text-amber-800"
        >
          {t('incomplete')}
        </p>
      )}

      {enhanced && answered > 0 && (
        <button
          type="button"
          onClick={reset}
          className="mt-2 flex w-full items-center justify-center gap-1 py-2 text-xs font-bold text-slate-500 transition-colors hover:text-slate-900"
        >
          <RotateCcw size={14} /> {t('reset')}
        </button>
      )}
    </div>
  );
}
