'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, Copy, ExternalLink, RotateCcw } from 'lucide-react';
import { X_LIMIT, intentUrl, type XPostDraft } from '@/lib/xPosts';

/**
 * X へ投げる下書きの一覧。投稿そのものは X の画面で運営者が行う。
 *
 * 「投稿済み」は localStorage に持つ。運営者ひとりが自分の端末から使う画面なので、
 * サーバーに置くほどのものではない。ID に日付や版名が入っているため、
 * 次の更新が来れば別の下書きとして未投稿で出てくる。
 */

const STORE_KEY = 'hubgame_x_posted';

const KIND_LABELS: Record<XPostDraft['kind'], string> = {
  patch: 'パッチ',
  stats: '統計',
  data: 'データ',
};

const SITE_STYLES: Record<XPostDraft['site'], string> = {
  hok: 'bg-amber-100 text-amber-900 border-amber-200',
  wildrift: 'bg-sky-100 text-sky-900 border-sky-200',
  mlbb: 'bg-violet-100 text-violet-900 border-violet-200',
};

/**
 * 投稿済みの印は localStorage に持つ。サーバーでは読めないので useSyncExternalStore で
 * 受け取る。サーバー側は空配列を返し、描画後に実際の値へ差し替わる。
 */
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
/** 同じ中身なら同じ配列を返す。毎回新しい配列を返すと描画が止まらなくなる */
let cache: { raw: string; value: string[] } = { raw: '', value: EMPTY };

function emit() {
  for (const l of listeners) l();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // 別のタブで押したときも印を合わせる
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): string[] {
  let raw = '';
  try {
    raw = localStorage.getItem(STORE_KEY) ?? '';
  } catch {
    // プライベートウィンドウなど、読めない環境でも画面は使えるようにする
    raw = '';
  }
  if (raw !== cache.raw) {
    let value: string[] = EMPTY;
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) value = parsed.filter((x): x is string => typeof x === 'string');
    } catch {
      value = EMPTY;
    }
    cache = { raw, value };
  }
  return cache.value;
}

export default function XPostList({ drafts, siteLabels }: { drafts: XPostDraft[]; siteLabels: Record<string, string> }) {
  const posted = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const [copied, setCopied] = useState<string | null>(null);

  const save = (next: string[]) => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      // 保存できなくても投稿はできる。印が残らないだけ
    }
    emit();
  };

  const markPosted = (id: string) => save(posted.includes(id) ? posted : [...posted, id]);
  const undo = (id: string) => save(posted.filter((x) => x !== id));

  const copy = async (d: XPostDraft) => {
    try {
      await navigator.clipboard.writeText(`${d.text}\n${d.url}`);
      setCopied(d.id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  if (drafts.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-600">
        下書きがありません。各サイトの /api/latest から値を取れていません。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {drafts.map((d) => {
        const done = posted.includes(d.id);
        const over = d.weight > X_LIMIT;
        return (
          <article
            key={d.id}
            className={`rounded-2xl border bg-white p-5 shadow-sm transition-opacity ${done ? 'border-slate-200 opacity-60' : 'border-slate-300'}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${SITE_STYLES[d.site]}`}>
                {siteLabels[d.site] ?? d.site}
              </span>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                {KIND_LABELS[d.kind]}
              </span>
              <span className="text-xs font-bold text-slate-500">{d.heading}</span>
              {done && (
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <Check size={14} />
                  投稿済み
                </span>
              )}
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-800">{d.text}</p>
            <p className="mt-1 break-all text-xs font-medium text-slate-500">{d.url}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={intentUrl(d)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => markPosted(d.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                <ExternalLink size={14} />
                Xの投稿画面を開く
              </a>
              <button
                type="button"
                onClick={() => copy(d)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Copy size={14} />
                {copied === d.id ? 'コピーしました' : '文面をコピー'}
              </button>
              {done && (
                <button
                  type="button"
                  onClick={() => undo(d.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  <RotateCcw size={13} />
                  未投稿に戻す
                </button>
              )}
              <span className={`ml-auto text-xs font-bold ${over ? 'text-rose-600' : 'text-slate-500'}`}>
                {d.weight} / {X_LIMIT}
                {over && '（長すぎます）'}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
