import { udoApi, type Light } from '../api/udo';
import { statusHeadline, statusReasons } from '../api/ferryText';
import { useAsync } from '../api/useAsync';
import { useContent } from '../i18n';
import StateBlock from './StateBlock';

/*
 * 운항 신호등. 판정은 앱 서버(/status)가 하고 여기서는 표시만 한다.
 * 신호색(초/노/빨/회)은 **의미색**이다 — 버튼·링크에 쓰지 않는다(앱 디자인 규칙).
 */
const LIGHT_STYLE: Record<Light, { dot: string; tint: string; border: string; text: string }> = {
  green: { dot: 'bg-go', tint: 'bg-go/10', border: 'border-go/40', text: 'text-go' },
  yellow: { dot: 'bg-caution', tint: 'bg-caution/10', border: 'border-caution/40', text: 'text-caution' },
  red: { dot: 'bg-stop', tint: 'bg-stop/10', border: 'border-stop/40', text: 'text-stop' },
  gray: { dot: 'bg-unknown', tint: 'bg-unknown/10', border: 'border-unknown/40', text: 'text-unknown' },
};

function timeLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  });
}

export default function FerryStatusCard() {
  const { ui } = useContent();
  const { data, loading, error } = useAsync((s) => udoApi.status(s));

  if (loading || error || !data) return <StateBlock loading={loading} error={error} />;

  const light = (data.status?.light ?? 'gray') as Light;
  const style = LIGHT_STYLE[light] ?? LIGHT_STYLE.gray;
  const cur = data.current;
  /* 서버가 준 완성 문장 대신 code+params 로 조립한다(앱과 같은 문안·같은 규칙). */
  const headline = statusHeadline(data.status, ui.ferry);
  const reasons = statusReasons(data.status, ui.ferry);

  return (
    <div className={`rounded-xl border ${style.border} ${style.tint} p-5`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${style.dot}`} aria-hidden />
        <span className={`text-sm font-bold ${style.text}`}>
          {ui.ferry.today} · {ui.ferry.lights[light]}
        </span>
        {data.stale && <span className="chip">stale</span>}
      </div>

      <p className="mt-2 text-lg font-bold text-ink">{headline}</p>
      {reasons.length > 0 && (
        <ul className="mt-1.5 space-y-0.5 text-sm text-ink-soft">
          {reasons.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {data.tomorrow && (
          <div className="rounded-lg border border-line bg-surface px-3 py-2.5">
            <p className="text-xs font-semibold text-faint">{ui.ferry.tomorrow}</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">
              {ui.ferry.lights[(data.tomorrow.level ?? 'gray') as Light]}
            </p>
            <p className="text-xs text-ink-soft">{data.tomorrow.detail}</p>
          </div>
        )}
        {cur && (
          <div className="rounded-lg border border-line bg-surface px-3 py-2.5">
            <p className="text-xs font-semibold text-faint">{ui.ferry.weatherNow}</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {cur.temp != null && <>{ui.ferry.temp} {cur.temp}℃ · </>}
              {cur.wsd != null && <>{ui.ferry.wind} {cur.wsd} m/s · </>}
              {cur.wav != null && <>{ui.ferry.wave} {cur.wav} m</>}
            </p>
          </div>
        )}
      </div>

      {data.terminals?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.terminals.map((t) => (
            <a key={t.name} href={`tel:${t.phone}`} className="chip hover:border-brand hover:text-link">
              ☎ {t.name} {t.phone}
            </a>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-faint">
        {ui.states.updatedAt} {timeLabel(data.updated_at)} · {ui.ferry.source}
      </p>
      <p className="text-xs text-faint">{ui.ferry.disclaimer}</p>
    </div>
  );
}
