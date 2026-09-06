import { udoApi } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useContent } from '../i18n';
import StateBlock from './StateBlock';

/* 축제·행사 — 앱 서버 /festivals(검수된 목록). 소개글은 외부 데이터: 렌더링만 한다. */
export default function FestivalList({ limit }: { limit?: number }) {
  const { ui } = useContent();
  const { data, loading, error } = useAsync((s) => udoApi.festivals(s));
  const items = (data?.items ?? []).slice(0, limit ?? undefined);

  if (loading || error || items.length === 0)
    return <StateBlock loading={loading} error={error} empty={!loading && !error} />;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((f) => (
        <article key={f.id} className="card card-hover">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-ink">{f.name}</h3>
            {f.date_status && <span className="chip">{f.date_status}</span>}
          </div>
          <p className="mt-1 text-sm text-faint">
            {f.start_date} ~ {f.end_date} · {f.place}
          </p>
          {f.intro && <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{f.intro}</p>}
          {f.homepage_url && (
            <a
              href={f.homepage_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-strong"
            >
              {ui.actions.openLink} ↗
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
