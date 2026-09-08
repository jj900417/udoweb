import { udoApi } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useContent, useLocale } from '../i18n';
import StateBlock from './StateBlock';

/*
 * 서버가 주는 날짜 상태('확정')는 lang 을 넘겨도 한국어다. 아는 값은 화면 언어로
 * 바꾸고, 모르는 값은 서버 값을 그대로 보여준다(칩이 사라지지 않게).
 */
const DATE_STATUS_KEYS: Record<string, string> = {
  확정: 'confirmed',
  예정: 'planned',
  미정: 'undecided',
  취소: 'cancelled',
};

function dateStatusLabel(server: string, labels: Record<string, string>): string {
  const key = DATE_STATUS_KEYS[server.trim()];
  return (key && labels[key]) || server;
}

/*
 * 축제·행사 — 앱 서버 /festivals(검수된 목록). 소개글은 외부 데이터: 렌더링만 한다.
 * 언어를 바꾸면 다시 불러온다 — 이름·장소·소개는 서버가 그 언어로 준다.
 */
export default function FestivalList({ limit }: { limit?: number }) {
  const { ui } = useContent();
  const { locale } = useLocale();
  const { data, loading, error } = useAsync((s) => udoApi.festivals(locale, s), [locale]);
  const items = (data?.items ?? []).slice(0, limit ?? undefined);

  if (loading || error || items.length === 0)
    return <StateBlock loading={loading} error={error} empty={!loading && !error} />;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((f) => (
        <article key={f.id} className="card card-hover">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-ink">{f.name}</h3>
            {f.date_status && (
              <span className="chip">{dateStatusLabel(f.date_status, ui.festivals.dateStatus)}</span>
            )}
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
              className="mt-3 inline-block text-sm font-semibold text-link hover:text-cta-strong"
            >
              {ui.actions.openLink} ↗
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
