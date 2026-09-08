import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Table2 } from 'lucide-react';
import { getSiteSnapshot, type SiteSnapshot } from '@/lib/sisterSites';
import { liveSitesFor, type HighlightSite } from '@/data/highlights';

/**
 * トップに置く「タイトル別の最新データ」表。
 *
 * 狙いは、リンクを踏まなくてもこのページだけで読み切れる事実を出すこと。
 * 出どころを説明できない数字は載せない。
 *
 * 列は highlights.ts の liveSitesFor(locale) で決まる。**公開したサイトが自動で1列増える。**
 * ここに列を書き足す作業は無い。増やすときは SITE_LOCALES にその言語を足して、
 * 下の SITE_META にその1件を書くだけでよい。
 *
 * 言語別なのは、日本語だけで公開しているサイトを英語の表に出さないため。
 * 出すと、英語の読者が読めないページへ送られる。
 *
 * 列ごとに、姉妹サイトの /api/latest に snapshot があればそれを使い、
 * 無ければ messages の静的値に落ちる。列は互いに独立していて、
 * ひとつが落ちても、他は取り込んだ値のまま出る。
 *
 * 以前は取得に失敗したら表ごと消していた。複数タイトルを並べる表なので、
 * ひとつが落ちただけで全部消えるのは行き過ぎだった。静的値という完全な代替がある。
 *
 * 静的値を持たないサイト（fallbackKey が無い）は、取得できなければ「—」を出す。
 * **控えの数字を手で書き足さないこと。** 実データの裏が無い数字を表に出すくらいなら、
 * 空であることを見せたほうがよい。
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

/**
 * 列ごとの見た目と messages のキー。
 *
 * catalogKey が分かれているのは、3つ目の枠の呼び名がタイトルで違うため
 * （HoK はアルカナ、Wild Rift はルーン、MLBB はエンブレム）。
 * snapshot 側はどれも arcana というキーで返してくる（契約が共通のため）。
 *
 * fallbackKey は静的値の置き場で、**持たないサイトがあってよい。**
 * MLBB は掲載数の実測をポータル側に持っていないため控えを用意していない。
 */
const SITE_META: Record<
  HighlightSite,
  {
    headClass: string;
    catalogKey: string;
    labelKey: string;
    fallbackKey?: string;
  }
> = {
  hok: { headClass: 'text-amber-700', catalogKey: 'hokCatalog', labelKey: 'colHok', fallbackKey: 'hok' },
  wildrift: { headClass: 'text-cyan-700', catalogKey: 'wrCatalog', labelKey: 'colWr', fallbackKey: 'wr' },
  mlbb: { headClass: 'text-violet-700', catalogKey: 'mlbbCatalog', labelKey: 'colMlbb' },
};

/** 表の1列ぶん。取り込みでも静的値でも、ここまで来たら同じ形になる */
type Column = {
  patchLabel: string;
  patchDate: string;
  changedHeroes: string;
  heroes: string;
  catalog: string;
  /** サイト自体の最終更新日。相手が返していなければ null で、その欄は「未公開」 */
  siteUpdatedAt: string | null;
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

  // 公開済みのタイトルを並行して取りに行く。ひとつの遅れが他を待たせないようにする
  const sites = liveSitesFor(locale);
  const snapshots = await Promise.all(sites.map((site) => getSiteSnapshot(site)));

  /** 取り込めた snapshot を列の形に直す */
  const fromSnapshot = (s: SiteSnapshot, catalogKey: string): Column => ({
    patchLabel: ja ? s.patch.labelJa : s.patch.label,
    patchDate: s.patch.date,
    changedHeroes: t('heroCount', { count: s.patch.changedHeroes }),
    heroes: t('heroCount', { count: s.catalog.heroes }),
    catalog: t(catalogKey, {
      items: s.catalog.items,
      arcana: s.catalog.arcana,
      spells: s.catalog.spells,
    }),
    siteUpdatedAt: s.siteUpdatedAt,
    asOf: null,
  });

  /** 取り込めなかったときの控え。messages に持っている手元の値 */
  const fromMessages = (key: string): Column => ({
    patchLabel: t(`${key}.patch`),
    patchDate: t(`${key}.patchDate`),
    changedHeroes: t(`${key}.changedHeroes`),
    heroes: t(`${key}.heroes`),
    catalog: t(`${key}.catalog`),
    // 取り込めなかった列は最終更新日も分からない。憶測で静的値を置かない
    siteUpdatedAt: null,
    asOf: t(`${key}.asOf`),
  });

  const columns = sites.map((site) => {
    const meta = SITE_META[site];
    const snap = snapshots[sites.indexOf(site)];
    const col = snap
      ? fromSnapshot(snap, meta.catalogKey)
      : meta.fallbackKey
        ? fromMessages(meta.fallbackKey)
        : null;
    return { site, meta, col };
  });

  /** 列が無い（取り込めず控えも無い）ときの表示。空欄にせず、無いことを見せる */
  const DASH = '—';

  // 静的値で出した列だけ、いつ時点かを添える。全部取り込めた日は最後の一文だけになる
  const stale = columns
    .map(({ meta, col }) =>
      col?.asOf ? t('asOf', { site: t(meta.labelKey), date: col.asOf }) : null,
    )
    .filter(Boolean);
  const footnote = [...stale, t('footnoteBase')].join(ja ? '' : ' ');

  // 最終更新日は、どのタイトルも返していなければ行ごと出さない（空欄が並ぶ行を作らない）
  const anySiteUpdated = columns.some(({ col }) => col?.siteUpdatedAt);

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
        <Table2 size={20} className="text-indigo-500" /> {t('heading')}
      </h3>

      {/* 列が増えるので狭い画面では横に送る。行を折り返して潰すより読める。
          最小幅は「項目の列 + 1タイトルあたり 170px」で見積もる */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table
          className="w-full border-collapse text-left text-xs"
          style={{ minWidth: `${170 + columns.length * 155}px` }}
        >
          <thead>
            <tr className="bg-slate-100 text-slate-600">
              <th scope="col" className="w-[30%] py-2.5 px-3 font-bold">
                {t('colAxis')}
              </th>
              {columns.map(({ site, meta }) => (
                <th key={site} scope="col" className={`py-2.5 px-3 font-bold ${meta.headClass}`}>
                  {t(meta.labelKey)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            <tr>
              <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                {t('rowPatch')}
              </th>
              {columns.map(({ site, col }) => (
                <Cell
                  key={site}
                  value={col ? col.patchLabel : DASH}
                  note={col ? <time dateTime={col.patchDate}>{col.patchDate}</time> : undefined}
                />
              ))}
            </tr>

            <tr>
              <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                {t('rowChanged')}
              </th>
              {columns.map(({ site, col }) => (
                <Cell key={site} value={col ? col.changedHeroes : DASH} />
              ))}
            </tr>

            <tr>
              <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                {t('rowRoster')}
              </th>
              {columns.map(({ site, col }) => (
                <Cell key={site} value={col ? col.heroes : DASH} note={col?.catalog} />
              ))}
            </tr>

            {/* サイト自体の最終更新日。上の「現在のパッチ」はゲーム側の公開日なので、
                サイトが手入れされているかは分からない */}
            {anySiteUpdated && (
              <tr>
                <th scope="row" className="py-3 px-3 align-top font-semibold text-slate-600">
                  {t('rowSiteUpdated')}
                </th>
                {columns.map(({ site, col }) => (
                  <Cell
                    key={site}
                    value={
                      col?.siteUpdatedAt ? (
                        <time dateTime={col.siteUpdatedAt}>{col.siteUpdatedAt}</time>
                      ) : (
                        t('notPublished')
                      )
                    }
                  />
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{footnote}</p>
    </section>
  );
}
