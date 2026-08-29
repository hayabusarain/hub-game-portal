import { getLocale, getTranslations } from 'next-intl/server';
import { Sparkles, ArrowRight } from 'lucide-react';
import { routing, getPathname } from '@/i18n/routing';
import { QUESTIONS } from '@/lib/quiz';
import MobaDiagnosticQuiz from '@/components/MobaDiagnosticQuiz';

type AppLocale = (typeof routing.locales)[number];

type Props = {
  /** 省略時は現在のリクエストのロケールを使う */
  locale?: string;
  /** 設問順の選択済みインデックス。/diagnosis で回答をやり直すときに選択状態を戻す */
  selected?: (number | null)[];
  /** 見出しと説明を出すか。ページの h1 が同じ役割を果たすときは false にする */
  showIntro?: boolean;
};

/**
 * 適性診断のフォーム本体。サーバーコンポーネントなので、
 * 5問の設問文と全選択肢が初期HTMLにそのまま入る（JS が無くても読めて、送信もできる）。
 *
 * 送信は GET で /{locale}/diagnosis へ飛ばす。回答は q1〜q5 のクエリに載り、
 * 結果ページはそれを読んで判定する。結果は 1 URL に集約し、10通りを別ページにはしない。
 *
 * MobaDiagnosticQuiz はこのフォームを包むだけのクライアント側の上乗せで、
 * フォームを差し替えたり隠したりはしない。
 */
export default async function QuizForm({ locale, selected, showIntro = true }: Props) {
  const t = await getTranslations('Quiz');
  const activeLocale = (locale ?? (await getLocale())) as AppLocale;
  const action = getPathname({ href: '/diagnosis', locale: activeLocale });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 shadow-sm sm:p-6">
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-200 opacity-50 mix-blend-multiply blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-200 opacity-50 mix-blend-multiply blur-3xl animate-blob animation-delay-2000" />

      <div className="relative z-10">
        {showIntro && (
          <div className="mb-5 flex flex-col items-center gap-2 text-center">
            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-inner">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800">{t('title')}</h3>
            <p className="text-sm font-medium leading-relaxed text-slate-600">{t('subtitle')}</p>
          </div>
        )}

        <MobaDiagnosticQuiz>
          <form method="GET" action={action} className="flex flex-col gap-4">
            {QUESTIONS.map((question, questionIndex) => (
              // 枠線は border ではなく ring（box-shadow）で描く。border があると legend が
              // その上に載る仕様で、設問が2行に折り返したときに枠が大きく途切れて見えるため
              <fieldset
                key={question.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
              >
                <legend className="text-sm font-black leading-snug text-slate-800">
                  <span className="text-indigo-500">Q{questionIndex + 1}.</span> {t(question.id)}
                </legend>

                <div className="mt-3 flex flex-col gap-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-100 bg-slate-50 p-3 text-sm font-bold leading-snug text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-700 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-500"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={optionIndex}
                        defaultChecked={selected?.[questionIndex] === optionIndex}
                        className="h-4 w-4 shrink-0 accent-indigo-600"
                      />
                      <span>{t(option.id)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              {t('submit')} <ArrowRight size={16} />
            </button>
          </form>
        </MobaDiagnosticQuiz>
      </div>
    </div>
  );
}
