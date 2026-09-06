import { udoApi } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useContent } from '../i18n';
import StateBlock from './StateBlock';

/*
 * 운항 시간표 — 앱 서버 /timetable 을 그대로 표시. 사이트에 숫자를 복사해 두지
 * 않는다(선사 변경이 앱 서버 한 곳에서만 반영되도록).
 * 응답 구조: routes[].seasons[key] = { label, first, last, first_from, <출발지키>: string[] }
 */
export default function TimetableCard() {
  const { ui } = useContent();
  const { data, loading, error } = useAsync((s) => udoApi.timetable(s));

  if (loading || error || !data) return <StateBlock loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      {data.routes.map((route) => (
        <div key={route.name} className="card">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-bold text-ink">{route.name}</h3>
            <a href={`tel:${route.phone}`} className="text-sm font-semibold text-link">
              {route.operator} ☎ {route.phone}
            </a>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {Object.entries(route.seasons).map(([key, season]) => (
              <div key={key} className="rounded-lg border border-line bg-surface-soft p-3">
                <p className="text-sm font-semibold text-ink">{season.label}</p>
                {(season.first || season.last) && (
                  <p className="mt-0.5 text-xs text-faint">
                    첫 배 {season.first} · 막 배 {season.last}
                    {season.first_from ? ` (${season.first_from} 출발 기준)` : ''}
                  </p>
                )}
                <div className="mt-2 space-y-2">
                  {Object.entries(season)
                    .filter(([k, v]) => Array.isArray(v) && k in route.dep_labels)
                    .map(([k, v]) => (
                      <div key={k}>
                        <p className="text-xs font-semibold text-faint">{route.dep_labels[k]}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
                          {(v as string[]).join(' · ')}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-xs text-faint">
        {data.note} {ui.timetable.note}
      </p>
    </div>
  );
}
