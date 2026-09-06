import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useLocale } from '../../i18n';

/*
 * 우도 지도 — 우도나우가 직접 만들어 운영하는 벡터 지도를 그대로 쓴다.
 *
 * 앱(MapLibre Native)과 **같은 스타일·같은 타일**이라 앱과 웹의 지도가 한 제품으로 보인다.
 * 앱과 마찬가지로 이 컴포넌트는 스타일 URL 을 **매니페스트 한 곳에서만** 얻는다 —
 * 타일 소스·PMTiles·zoom 라우팅은 서버(스타일 JSON)가 소유하고 화면은 해석하지 않는다.
 * 그래서 서버에서 지도를 교체해도 이 코드를 고칠 일이 없다.
 *
 * 신뢰경계: 매니페스트는 **데이터이지 지시가 아니다.** 앱의 isAllowedMapUrl 과 같은 이유로
 * https + 허용 host 안의 URL 만 받아들이고, 아니면 지도를 그리지 않는다(fail-closed).
 */
const MANIFEST_URL = 'https://maps.junghwanyoon.dev/manifest/production.json';
const ALLOWED_HOSTS = new Set(['maps.junghwanyoon.dev', 'tiles.junghwanyoon.dev']);
/* 지도 위에 늘 보이는 짧은 출처 — 앱과 같은 문구를 쓴다. */
const ATTRIBUTION = '© 우도나우 · © OpenStreetMap contributors';

/** 우도 전역이 한 화면에 들어오는 범위. */
const UDO_BOUNDS: [number, number, number, number] = [126.936, 33.488, 126.98, 33.522];

export type MapPin = {
  readonly id: string;
  readonly lat: number;
  readonly lon: number;
  readonly label: string;
  readonly sub?: string;
};

function isAllowed(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && ALLOWED_HOSTS.has(u.host);
  } catch {
    return false;
  }
}

/** 매니페스트의 localizedStyles 에서 현재 언어에 맞는 스타일을 고른다. */
function pickStyle(manifest: unknown, locale: string): string | null {
  if (typeof manifest !== 'object' || manifest === null) return null;
  const m = manifest as {
    style?: { light?: string };
    localizedStyles?: Record<string, string>;
  };
  const key = locale === 'zh' ? 'zh-Hans' : locale;
  const candidate = m.localizedStyles?.[key] ?? m.localizedStyles?.ko ?? m.style?.light;
  return isAllowed(candidate) ? candidate : null;
}

export default function UdoMap({
  pins,
  onSelect,
  activeId,
  height = 420,
}: {
  pins: readonly MapPin[];
  onSelect?: (id: string) => void;
  activeId?: string;
  height?: number;
}) {
  const { locale } = useLocale();
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<MapLibreMarker[]>([]);
  const [failed, setFailed] = useState(false);
  /*
   * 타일 소스가 막혔을 때(예: CORS) maplibre 는 조용히 배경색만 그린다.
   * 그러면 "지도가 안 나온다"는 사실만 남고 이유가 안 보이므로, 오류를 잡아 알린다.
   */
  const [tileError, setTileError] = useState(false);
  /*
   * 지도는 매니페스트를 받아온 뒤 비동기로 만들어진다. ready 를 state 로 두지 않으면
   * 핀을 붙이는 효과가 지도보다 먼저 지나가 버리고, 다시 실행될 계기가 없어 핀이 영영 안 붙는다.
   */
  const [ready, setReady] = useState(false);

  /* pmtiles:// 프로토콜은 한 번만 등록한다(앱에서는 네이티브가 담당하는 일). */
  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);
    return () => maplibregl.removeProtocol('pmtiles');
  }, []);

  useEffect(() => {
    let cancelled = false;
    const el = container.current;
    if (!el) return;

    (async () => {
      try {
        const res = await fetch(MANIFEST_URL, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`manifest ${res.status}`);
        const style = pickStyle(await res.json(), locale);
        if (!style) throw new Error('허용되지 않은 스타일 URL');
        if (cancelled) return;

        const instance = new maplibregl.Map({
          container: el,
          style,
          bounds: UDO_BOUNDS,
          fitBoundsOptions: { padding: 24 },
          attributionControl: false,
        });
        instance.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: ATTRIBUTION }));
        instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        instance.on('error', (event) => {
          // 타일·소스 로딩 실패만 본다(라벨 폰트 경고 등은 무시).
          const message = String((event as unknown as { error?: { message?: string } }).error?.message ?? '');
          if (/fetch|load|source|tile/i.test(message) && !cancelled) setTileError(true);
        });
        instance.scrollZoom.disable(); // 페이지 스크롤을 가로채지 않는다(모바일 배려)
        map.current = instance;
        /*
         * 핀은 지도 위에 얹는 DOM 요소라 스타일 로딩을 기다릴 필요가 없다.
         * 'load' 이벤트를 기다렸더니 (스프라이트·글리프 사정에 따라) 끝내 오지 않는
         * 경우가 있어 핀이 영영 안 붙었다 — 인스턴스가 생긴 시점에 바로 알린다.
         */
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      setReady(false);
      map.current?.remove();
      map.current = null;
    };
  }, [locale]);

  /* 핀 갱신 — 지도 인스턴스와 분리해 두어 녹음이 늘어도 지도를 다시 만들지 않는다. */
  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;
    markers.current.forEach((m) => m.remove());
    markers.current = pins.map((pin) => {
      const node = document.createElement('button');
      node.type = 'button';
      node.setAttribute('aria-label', pin.label);
      node.className = [
        'h-4 w-4 rounded-full border-2 border-white transition-transform',
        pin.id === activeId ? 'bg-coral scale-125' : 'bg-brand',
      ].join(' ');
      node.addEventListener('click', () => onSelect?.(pin.id));
      return new maplibregl.Marker({ element: node })
        .setLngLat([pin.lon, pin.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 14, closeButton: false }).setText(
            pin.sub ? `${pin.label} · ${pin.sub}` : pin.label,
          ),
        )
        .addTo(instance);
    });
  }, [pins, activeId, onSelect, ready]);

  if (failed) return null;

  return (
    <>
      <div
        ref={container}
        style={{ height }}
        className="w-full overflow-hidden rounded-xl border border-line"
      />
      {tileError && (
        <p className="caption mt-2">
          지도 타일을 불러오지 못했습니다. 잠시 뒤 새로고침해 주세요.
        </p>
      )}
    </>
  );
}
