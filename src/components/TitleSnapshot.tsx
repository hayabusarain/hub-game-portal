import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Table2 } from 'lucide-react';
import { getSiteSnapshot } from '@/lib/sisterSites';

/**
 * トップに置く「2タイトルの現在地」表。
 *
 * 狙いは、リンクを踏まなくてもこのページだけで読み切れる事実を出すこと。
 * そのため数字には必ず取得日と出典を添える。出典の書けない数字は載せない。
 *
 * 列ごとに出どころが違う。
 * - Honor of Kings … hok.hub-game.com の /api/latest から取り込む。掲載データを増やせば自動で追従する
 * - Wild Rift      … 自動取得はしていない。messages の静的値で、取得日を4行目に明記する
 *
 * 取得に失敗したら null を返して表ごと消す。半端な行が残った表は、無いほうがましなので。
 * サーバーコンポーネントのままにしておくこと。初期HTMLに文字が出ることがこの表の目的で、
 * 'use client' にすると数字がスクリプトの中へ引っ込む。
 */

type Props = {
  locale: string;
};

/** 値を1行目、出典や内訳を2行目に置く。行ごとに書き方が揺れないよう部品にしている */
function Cell({ value, note }: { value: ReactNode; note?: ReactNode }) {
  return (
    <td className="py-3 px-3 align-top">
      <div className="font-bold text-slate-900 leading-snug">{value}</div>
      {note && (
        <div className="mt-1 text-[11px] font-medium text-slate-500 leading-relaxed">{note}</div>
      )}
    </td>
  );
}

export default async function TitleSnapshot({ locale }: Props) {
  const t = await getTranslations('TitleSnapshot');
  const hok = await getSiteSnapshot('hok');

  // 姉妹サイトが落ちている・古い形の JSON を返している場合はここで諦める
  if (!hok) return null;

  const ja = locale === 'ja';
  const patchLabel = ja ? hok.patch.labelJa : hok.patch.label;
  const statsSource = ja ? hok.stats.sourceJa : hok.stats.sourceEn;

  const hokSourceNote = (
    <>
      {t('sourceLabel')}{' '}
      {hok.stats.sourceUrl ? (
        <a
          href={hok.stats.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
        >
          {statsSource}
        </a>
      ) : (
        statsSource
      )}
    </>
  );

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
        <Table2 size={20} className="text-indigo-500" /> {t('heading')}
      </h3>

      <p className="text-xs text-slate-500 font-medium leading-relaxed">{t('lead')}</p>

      {/* 3列あるので狭い画面では横に送る。行を折り返して潰すより読める */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[480px] border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-600">
              <th scope="col" className="w-[30%] py-2.5 px-3 font-bold">
                {t('colAxis')}
              </th>
              <th scope="col" className="py-2.5 px-3 font-bold text-amber-700">
                {t('colHok')}
              </th>
              <th scope="col" className="py-2.5 px-3 font-bold text-cyan-700">
                {t('colWr')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            <tr>
              <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                {t('rowPatch')}
              </th>
              <Cell
                value={patchLabel}
                note={<time dateTime={hok.patch.date}>{hok.patch.date}</time>}
              />
              <Cell
                value={t('wr.patch')}
                note={<time dateTime={t('wr.patchDate')}>{t('wr.patchDate')}</time>}
              />
            </tr>

            <tr>
              <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                {t('rowChanged')}
              </th>
              <Cell value={t('heroCount', { count: hok.patch.changedHeroes })} />
              <Cell value={t('wr.changedHeroes')} />
            </tr>

            <tr>
              <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                {t('rowRoster')}
              </th>
              <Cell
                value={t('heroCount', { count: hok.catalog.heroes })}
                note={t('hokCatalog', {
                  items: hok.catalog.items,
                  arcana: hok.catalog.arcana,
                  spells: hok.catalog.spells,
                })}
              />
              <Cell value={t('wr.heroes')} note={t('wr.catalog')} />
            </tr>

            <tr>
              <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                {t('rowStats')}
              </th>
              <Cell
                value={t('statsAsOf', { date: hok.stats.updatedAt })}
                note={hokSourceNote}
              />
              <Cell value={t('wr.statsAsOf')} note={t('wr.statsSource')} />
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{t('footnote')}</p>
    </section>
  );
}
