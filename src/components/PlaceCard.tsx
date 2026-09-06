import type { Place } from '../data/spots';
import { useContent } from '../i18n';

/* 명소 카드. 지도는 외부(카카오맵) 링크로 — 지도 SDK 키 없이 동작하게 한다. */
export default function PlaceCard({ place }: { place: Place }) {
  const { ui } = useContent();
  const mapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lon}`;

  return (
    <article className="card card-hover">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-bold text-ink">{place.name}</h3>
        <span className="chip">{place.category}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{place.summary}</p>
      {place.tips && <p className="mt-2 text-xs text-faint">💡 {place.tips}</p>}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-strong"
      >
        {ui.actions.openMap} ↗
      </a>
    </article>
  );
}
