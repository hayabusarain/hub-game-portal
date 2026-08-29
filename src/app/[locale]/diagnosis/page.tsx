import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Swords,
  Wand2,
  Compass,
  Crosshair,
  HeartHandshake,
  type LucideIcon
} from 'lucide-react';
import HeaderNav from '@/components/HeaderNav';
import FooterNav from '@/components/FooterNav';
import JsonLd from '@/components/JsonLd';
import QuizForm from '@/components/QuizForm';
import { QUESTIONS, getResult, parseAnswers, type Role } from '@/lib/quiz';
import { getAlternates } from '@/utils/seo';
import { buildBreadcrumb, buildGraph } from '@/utils/jsonld';

const SITE_URL = 'https://hub-game.com';

const ROLE_ICONS: Record<Role, LucideIcon> = {
  top: Swords,
  jungle: Compass,
  mid: Wand2,
  adc: Crosshair,
  support: HeartHandshake
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  // 結果は q1〜q5 のクエリで表す。canonical はクエリ無しの1本に寄せ、
  // 200通りの組み合わせが別ページとして拾われないようにする
  return {
    title: t('diagnosis.title'),
    description: t('diagnosis.description'),
    alternates: getAlternates(locale, '/diagnosis')
  };
}

export default async function DiagnosisPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = await searchParams;
  const t = await getTranslations('Quiz');
  const tNav = await getTranslations('Nav');
  const tBreadcrumb = await getTranslations('Breadcrumb');

  // 手で URL を書き換えられても落とさない。範囲外や数値でない値は未回答として扱う
  const { selected, complete, hasInput } = parseAnswers(query);
  const answers = complete ? (selected as number[]) : null;
  const result = answers ? getResult(answers) : null;

  const graph = buildGraph(
    buildBreadcrumb(locale, [
      { name: tBreadcrumb('home'), path: '/' },
      { name: t('title'), path: '/diagnosis' }
    ])
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <JsonLd data={graph} />
      <HeaderNav />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 pt-8 pb-12">
        <section className="flex flex-col gap-3">
          <h1 className="text-3xl font-black leading-snug tracking-tight text-slate-900">
            {t('title')}
          </h1>
          <p className="text-sm font-medium leading-relaxed text-slate-600">{t('subtitle')}</p>
          <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium leading-relaxed text-slate-600">
            {t('pageLead')}
          </p>
        </section>

        {result && answers ? (
          <>
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-1 shadow-xl shadow-indigo-100/50">
              <div
                className={`flex flex-col items-center gap-5 rounded-[22px] p-6 text-center ${
                  result.isHok
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50'
                    : 'bg-gradient-to-br from-indigo-50 to-blue-50'
                }`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg ${
                    result.isHok ? 'from-amber-400 to-orange-500' : 'from-indigo-500 to-blue-600'
                  }`}
                >
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <p className="mb-1.5 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    {t('resultTitleLabel')}
                  </p>
                  <h2 className="mb-2 text-xl font-black text-slate-900">
                    {result.isHok ? t('resultHok') : t('resultWr')}
                  </h2>
                  <p className="text-sm font-medium leading-relaxed text-slate-600">
                    {result.isHok ? t('resultHokDesc') : t('resultWrDesc')}
                  </p>
                </div>

                {(() => {
                  // ロール名も説明文もタイトルごとに別物。レーン名（クラッシュ／ファーム／ローム）が違ううえ、
                  // ワイルドリフト前提の文面をそのまま出すと「HoK のロームがワードを置く」ことになる
                  const game = result.isHok ? 'hok' : 'wr';
                  const roleName = t(`role_${game}_${result.role}`);
                  const RoleIcon = ROLE_ICONS[result.role];
                  const gameName = result.isHok ? t('gameHok') : t('gameWr');
                  const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(
                    t('shareText', { game: gameName, role: roleName })
                  )}&url=${encodeURIComponent(`${SITE_URL}/${locale}/diagnosis`)}`;

                  return (
                    <>
                      <div className="w-full rounded-2xl border border-white bg-white/80 p-5 text-left shadow-sm">
                        <div className="mb-3 flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${
                              result.isHok
                                ? 'from-amber-400 to-orange-500'
                                : 'from-indigo-500 to-blue-600'
                            }`}
                          >
                            <RoleIcon size={22} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                              {t('resultRoleLabel')}
                            </p>
                            <h3 className="text-base leading-tight font-black text-slate-900">
                              {roleName}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-slate-600">
                          {t(`role_${game}_${result.role}_desc`)}
                        </p>
                      </div>

                      <div className="flex w-full flex-col gap-3">
                        <Link
                          href={result.isHok ? '/guides/honor-of-kings' : '/guides/wild-rift'}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
                        >
                          {t('readGuide')} <ArrowRight size={16} />
                        </Link>

                        <a
                          href={shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-900 shadow-sm transition-all hover:border-slate-900 hover:shadow-md active:scale-95"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z"></path>
                          </svg>
                          {t('share')}
                        </a>

                        <Link
                          href="/guides/compare"
                          className="py-1 text-xs font-bold text-indigo-600 transition-colors hover:text-indigo-800"
                        >
                          {tNav('compare')}
                        </Link>
                      </div>
                    </>
                  );
                })()}
              </div>
            </section>

            {/* 何を選んだ結果なのかを、判定の根拠として並べて出す */}
            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-black text-slate-800">{t('yourAnswers')}</h2>
              <ol className="flex flex-col gap-2">
                {QUESTIONS.map((question, questionIndex) => (
                  <li
                    key={question.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-bold text-slate-500">
                      <span className="text-indigo-500">Q{questionIndex + 1}.</span>{' '}
                      {t(question.id)}
                    </p>
                    <p className="mt-1 text-sm font-black leading-snug text-slate-900">
                      {t(question.options[answers[questionIndex]].id)}
                    </p>
                  </li>
                ))}
              </ol>

              <Link
                href="/diagnosis"
                className="flex items-center justify-center gap-1 py-2 text-xs font-bold text-slate-500 transition-colors hover:text-slate-900"
              >
                <RotateCcw size={14} /> {t('retake')}
              </Link>
            </section>
          </>
        ) : (
          <>
            {hasInput && (
              <p className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold leading-relaxed text-amber-800">
                {t('incomplete')}
              </p>
            )}

            {/* 回答済みのぶんは選択状態のまま残す。h1 が見出しの役割を持つので showIntro は落とす */}
            <QuizForm locale={locale} selected={selected} showIntro={false} />

            <Link
              href="/"
              className="flex items-center justify-center gap-1 py-2 text-xs font-bold text-slate-500 transition-colors hover:text-slate-900"
            >
              {t('backToTop')}
            </Link>
          </>
        )}
      </main>

      <FooterNav />
    </div>
  );
}
