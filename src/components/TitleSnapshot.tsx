import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Table2 } from 'lucide-react';
import { getSiteSnapshot, type SiteSnapshot } from '@/lib/sisterSites';

/**
 * トップに置く「2タイトルの最新データ」表。
 *
 * 狙いは、リンクを踏まなくてもこのページだけで読み切れる事実を出すこと。
 * 出どころを説明できない数字は載せない。
 *
 * 列ごとに、姉妹サイトの /api/latest に snapshot があればそれを使い、
 * 無ければ messages の静的値に落ちる。列は互いに独立していて、
 * 片方が落ちても、もう片方は取り込んだ値のまま出る。
 * - Honor of Kings … snapshot を返すので通常は取り込み。掲載データを増やせば自動で追従する
 * - Wild Rift      … いまは snapshot を返さない（/api/latest 自体は 200 を返す）ので静的値。
 *                    向こうが snapshot を足せば、ここは何も変えずに取り込みへ切り替わる
 *
 * 以前は取得に失敗したら表ごと消していた。2タイトルを並べる表なので、
 * 片方が落ちただけで両方消えるのは行き過ぎだった。静的値という完全な代替がある。
 *
 * 静的値で出した列は「いつ時点の数字か」を注記に出す。鮮度は読者の判断が変わる情報なので書く。
 * 取得間隔や手入力かどうかといった運営側の事情は書かない（2b51a6c で削った経緯がある）。
 *
 * サーバーコンポーネントのままにしておくこと。初期HTMLに文字が出ることがこの表の目的で、
 * 'use client' にすると数字がスクリプトの中へ引っ込む。
 */

type Props = {
  locale: string;
};

/** 表の1列ぶん。取り込みでも静的値でも、ここまで来たら同じ形になる */
type Column = {
  patchLabel: string;
  patchDate: string;
  changedHeroes: string;
  heroes: string;
  catalog: string;
  /** 静的値で出した列の「いつ時点か」。取り込めた列は null */
  asOf: string | null;
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
  const ja = locale === 'ja';

  // 2サイトを並行して取りに行く。片方の遅れがもう片方を待たせないようにする
  const [hokSnap, wrSnap] = await Promise.all([
    getSiteSnapshot('hok'),
    getSiteSnapshot('wildrift'),
  ]);

  /**
   * 取り込めた snapshot を列の形に直す。
   * catalogKey を分けているのは、3つ目の枠の呼び名がタイトルで違うため
   * （HoK はアルカナ、Wild Rift はルーン）。
   */
  const fromSnapshot = (s: SiteSnapshot, catalogKey: 'hokCatalog' | 'wrCatalog'): Column => ({
    patchLabel: ja ? s.patch.labelJa : s.patch.label,
    patchDate: s.patch.date,
    changedHeroes: t('heroCount', { count: s.patch.changedHeroes }),
    heroes: t('heroCount', { count: s.catalog.heroes }),
    catalog: t(catalogKey, {
      items: s.catalog.items,
      arcana: s.catalog.arcana,
      spells: s.catalog.spells,
    }),
    asOf: null,
  });

  /** 取り込めなかったときの控え。messages に持っている手元の値 */
  const fromMessages = (key: 'hok' | 'wr'): Column => ({
    patchLabel: t(`${key}.patch`),
    patchDate: t(`${key}.patchDate`),
    changedHeroes: t(`${key}.changedHeroes`),
    heroes: t(`${key}.heroes`),
    catalog: t(`${key}.catalog`),
    asOf: t(`${key}.asOf`),
  });

  const hok = hokSnap ? fromSnapshot(hokSnap, 'hokCatalog') : fromMessages('hok');
  const wr = wrSnap ? fromSnapshot(wrSnap, 'wrCatalog') : fromMessages('wr');

  // 静的値で出した列だけ、いつ時点かを添える。両方取り込めた日は最後の一文だけになる
  const stale = [
    hok.asOf ? t('asOf', { site: t('colHok'), date: hok.asOf }) : null,
    wr.asOf ? t('asOf', { site: t('colWr'), date: wr.asOf }) : null,
  ].filter(Boolean);
  const footnote = [...stale, t('footnoteBase')].join(ja ? '' : ' ');

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
        <Table2 size={20} className="text-indigo-500" /> {t('heading')}
      </h3>

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
                value={hok.patchLabel}
                note={<time dateTime={hok.patchDate}>{hok.patchDate}</time>}
              />
              <Cell
                value={wr.patchLabel}
                note={<time dateTime={wr.patchDate}>{wr.patchDate}</time>}
              />
            </tr>

            <tr>
              <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                {t('rowChanged')}
              </th>
              <Cell value={hok.changedHeroes} />
              <Cell value={wr.changedHeroes} />
            </tr>

            <tr>
              <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                {t('rowRoster')}
              </th>
              <Cell value={hok.heroes} note={hok.catalog} />
              <Cell value={wr.heroes} note={wr.catalog} />
            </tr>

          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{footnote}</p>
    </section>
  );
}
