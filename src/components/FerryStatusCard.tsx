import { udoApi, type Light } from '../api/udo';
import { lightLabel, outlookLabel, statusHeadline, statusReasons } from '../api/ferryText';
import { useAsync } from '../api/useAsync';
import { useContent, useLocale } from '../i18n';
import { intlTag } from '../i18n/locales';
import StateBlock from './StateBlock';

/*
 * 운항 신호등. 판정은 앱 서버(/status)가 하고 여기서는 표시만 한다.
 * 신호색(초/노/빨/회)은 **의미색**이다 — 버튼·링크에 쓰지 않는다(앱 디자인 규칙).
 */
const LIGHT_STYLE: Record<Light, { dot: string; tint: string; border: string; text: string }> = {
  green: { dot: 'bg-go', tint: 'bg-go/10', border: 'border-go/40', text: 'text-go' },
  /* 운영 시간 외는 경고가 아니다 — 신호색을 쓰지 않고 중립으로 둔다. */
  closed: { dot: 'bg-faint', tint: 'bg-surface-soft', border: 'border-line', text: 'text-ink-soft' },
  yellow: { dot: 'bg-caution', tint: 'bg-caution/10', border: 'border-caution/40', text: 'text-caution' },
  red: { dot: 'bg-stop', tint: 'bg-stop/10', border: 'border-stop/40', text: 'text-stop' },
  gray: { dot: 'bg-unknown', tint: 'bg-unknown/10', border: 'border-unknown/40', text: 'text-unknown' },
};

/** 풍향(도) → 16방위 이름. 337.5° 부터 다시 '북'이 되도록 반올림한다. */
function compass(deg: number, names: readonly string[]): string {
  const index = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
  return names[index] ?? '';
}

/*
 * 대합실 이름은 서버가 한국어로만 준다('천진항 대합실'). 항구 이름으로 어느 곳인지
 * 알아내 화면 언어의 이름으로 바꾼다. 못 알아보면 서버 이름을 그대로 쓴다 —
 * 새 대합실이 생겨도 칩이 사라지지는 않게.
 */
const TERMINAL_KEYS = [
  ['천진', 'cheonjin'],
  ['하우목동', 'haumokdong'],
  ['성산', 'seongsan'],
  ['종달', 'jongdal'],
] as const;

function terminalName(serverName: string, names: Record<string, string>): string {
  const hit = TERMINAL_KEYS.find(([ko]) => serverName.includes(ko));
  return (hit && names[hit[1]]) || serverName;
}

/* 기준 시각은 화면 언어로 찍는다 — 한국어 고정이면 '오전/오후' 가 영어 화면에 남는다. */
function timeLabel(iso: string, intl: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(intl, {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  });
}

export default function FerryStatusCard() {
  const { ui } = useContent();
  const { locale } = useLocale();
  const { data, loading, error } = useAsync((s) => udoApi.status(s));

  if (loading || error || !data) return <StateBlock loading={loading} error={error} />;

  const light = (data.status?.light ?? 'gray') as Light;
  const style = LIGHT_STYLE[light] ?? LIGHT_STYLE.gray;
  const cur = data.current;
  /* 서버가 준 완성 문장 대신 code+params 로 조립한다(앱과 같은 문안·같은 규칙). */
  const headline = statusHeadline(data.status, ui.ferry);
  const reasons = statusReasons(data.status, ui.ferry);
  /*
   * 내일 전망의 '풍속 · 파고' 도 서버 문장(detail) 대신 숫자로 다시 조립한다 —
   * 서버 문장은 한국어뿐이라 다른 언어 화면에 그대로 남았다. 숫자가 없을 때만 폴백.
   */
  const tomorrow = data.tomorrow;
  const tomorrowDetail = tomorrow
    ? [
        tomorrow.wsd != null ? `${ui.ferry.wind} ${tomorrow.wsd} m/s` : null,
        tomorrow.wav != null ? `${ui.ferry.wave} ${tomorrow.wav} m` : null,
      ]
        .filter(Boolean)
        .join(' · ') || tomorrow.detail
    : '';

  return (
    <div className={`rounded-xl border ${style.border} ${style.tint} p-5`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${style.dot}`} aria-hidden />
        <span className={`text-sm font-bold ${style.text}`}>
          {ui.ferry.today} · {lightLabel(light, data.status.certainty, ui.ferry.lights)}
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
        {tomorrow && (
          <div className="rounded-lg border border-line bg-surface px-3 py-2.5">
            <p className="text-xs font-semibold text-faint">{ui.ferry.tomorrow}</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">
              {outlookLabel(tomorrow.level ?? 'gray', ui.ferry.outlook)}
            </p>
            <p className="text-xs text-ink-soft">{tomorrowDetail}</p>
          </div>
        )}
        {cur && (
          <div className="rounded-lg border border-line bg-surface px-3 py-2.5">
            <p className="text-xs font-semibold text-faint">{ui.ferry.weatherNow}</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {[
                cur.temp != null ? `${ui.ferry.temp} ${cur.temp}℃` : null,
                cur.wsd != null ? `${ui.ferry.wind} ${cur.wsd} m/s` : null,
                cur.vec != null ? `${ui.ferry.windDir} ${compass(cur.vec, ui.ferry.compass)}` : null,
                cur.reh != null ? `${ui.ferry.humidity} ${cur.reh}%` : null,
                cur.wav != null ? `${ui.ferry.wave} ${cur.wav} m` : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
        )}
      </div>

      {data.terminals?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.terminals.map((t) => (
            <a key={t.name} href={`tel:${t.phone}`} className="chip hover:border-brand hover:text-link">
              ☎ {terminalName(t.name, ui.ferry.terminals)} {t.phone}
            </a>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-faint">
        {ui.states.updatedAt} {timeLabel(data.updated_at, intlTag(locale))}
      </p>
    </div>
  );
}
