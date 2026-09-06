import { useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type {
  ExpressionSpecification,
  Map as MapLibreMap,
  Marker as MapLibreMarker,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useLocale } from '../../i18n';

/*
 * 우도 지도.
 *
 * 타일은 **OpenFreeMap**(OpenStreetMap 기반 벡터 타일, 키 없이 공개·CORS 허용)을 쓴다.
 * myweb 의 제주 지도와 같은 방식이다.
 *
 * 우도나우 자체 지도(maps.junghwanyoon.dev)를 붙여봤지만 되돌렸다 — R2 응답이
 * `Vary: Origin` 없이 캐시돼서, 앱(Origin 을 안 보냄)이 타일을 받는 순간 CORS 헤더가
 * 없는 응답이 캐시에 남고 웹이 깨진다. 그 서버에 Transform Rule 을 걸면 해결되지만,
 * 사이트 쪽에서 통제할 수 없는 의존을 안고 갈 이유가 없다. 자체 지도를 다시 쓰고 싶으면
 * 그 규칙을 건 뒤 STYLE 만 매니페스트에서 받아오게 바꾸면 된다.
 */
const STYLE = 'https://tiles.openfreemap.org/styles/liberty';
/*
 * 지도 위 출처 한 줄.
 * OpenFreeMap 은 **OpenMapTiles 와 OpenStreetMap 표기를 요구**한다(OpenFreeMap 이름은 선택).
 * 스타일 JSON 안의 소스별 출처를 그대로 두면 같은 말이 두세 번 겹쳐 길어지므로,
 * 스타일을 받아 소스의 attribution 을 지우고 이 한 줄로 대신한다.
 */
const ATTRIBUTION = '© 우도나우 · © OpenMapTiles · © OpenStreetMap contributors';

/** 우도 전역이 한 화면에 들어오는 범위. */
const UDO_BOUNDS: [number, number, number, number] = [126.936, 33.488, 126.98, 33.522];

/* 라벨을 화면 언어에 맞춘다. 한국어는 지도 원본 라벨(name)이 이미 한국어다. */
const NAME_KEYS: Record<string, string[]> = {
  en: ['name:en', 'name:latin'],
  ja: ['name:ja', 'name:latin'],
  zh: ['name:zh', 'name:zh-Hans', 'name:latin'],
};

/** 지도에 그릴 선(항로 등). 좌표는 [경도, 위도] 순서 — GeoJSON 규약. */
export type MapLine = {
  readonly id: string;
  readonly coordinates: readonly [number, number][];
};

export type MapPin = {
  readonly id: string;
  readonly lat: number;
  readonly lon: number;
  readonly label: string;
  readonly sub?: string;
};

function localizeLabels(map: MapLibreMap, locale: string) {
  const keys = NAME_KEYS[locale];
  if (!keys) return; // 한국어 등 — 원본 라벨 그대로
  /*
   * maplibre 의 표현식 타입은 고정 길이 튜플이라 이런 동적 조립과 맞지 않는다.
   * 값 자체는 스펙에 맞는 coalesce 표현식이므로 여기서 한 번만 단언한다.
   */
  const expr = ['coalesce', ...keys.map((k) => ['get', k]), ['get', 'name']] as unknown as ExpressionSpecification;
  for (const layer of map.getStyle().layers ?? []) {
    if (layer.type === 'symbol' && layer.layout && 'text-field' in layer.layout) {
      try {
        map.setLayoutProperty(layer.id, 'text-field', expr);
      } catch {
        /* 이 레이어는 건너뛴다 — 라벨 하나 때문에 지도를 못 그리게 하지 않는다 */
      }
    }
  }
}

export default function UdoMap({
  pins,
  lines = [],
  onSelect,
  activeId,
  height = 420,
  bounds,
}: {
  pins: readonly MapPin[];
  /** 항로 폴리라인 — 스타일이 로드된 뒤 GeoJSON 레이어로 그린다. */
  lines?: readonly MapLine[];
  onSelect?: (id: string) => void;
  activeId?: string;
  height?: number;
  /** [서, 남, 동, 북]. 없으면 우도 전역. */
  bounds?: readonly [number, number, number, number];
}) {
  const { locale } = useLocale();
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<MapLibreMarker[]>([]);
  const [ready, setReady] = useState(false);
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let cancelled = false;
    let instance: MapLibreMap | null = null;

    /*
     * 스타일을 받아 **소스별 출처를 지운 뒤** 넘긴다.
     * 그대로 두면 지도 위 출처 줄에 같은 말이 두세 번 겹쳐 길어진다.
     * 필수 표기(OpenMapTiles·OpenStreetMap)는 ATTRIBUTION 한 줄로 대신한다.
     */
    const loadStyle = async (): Promise<maplibregl.StyleSpecification | string> => {
      try {
        const res = await fetch(STYLE);
        const style = (await res.json()) as {
          sources?: Record<string, { url?: string; attribution?: string } & Record<string, unknown>>;
        };

        /*
         * 출처 문구는 스타일이 아니라 **타일 메타(TileJSON)** 안에 들어 있다.
         * 그래서 메타를 우리가 받아 소스에 펼쳐 넣고 attribution 만 뺀다.
         * (그냥 두면 지도 위에 같은 말이 두세 번 겹쳐 길어진다.)
         */
        await Promise.all(
          Object.values(style.sources ?? {}).map(async (source) => {
            delete source.attribution;
            const metaUrl = source.url;
            if (!metaUrl || !metaUrl.startsWith('http')) return;
            try {
              const meta = (await (await fetch(metaUrl)).json()) as Record<string, unknown>;
              delete meta.attribution;
              Object.assign(source, meta);
              delete source.url;
            } catch {
              /* 메타를 못 받으면 원래 url 을 그대로 둔다 — 지도는 떠야 한다 */
            }
          }),
        );

        return style as unknown as maplibregl.StyleSpecification;
      } catch {
        return STYLE; // 못 받으면 원본 스타일 그대로 — 지도가 안 뜨는 것보다 낫다
      }
    };

    void (async () => {
      const style = await loadStyle();
      if (cancelled || !container.current) return;

      instance = new maplibregl.Map({
        container: el,
        style,
        bounds: (bounds ?? UDO_BOUNDS) as [number, number, number, number],
        fitBoundsOptions: { padding: 24 },
        attributionControl: false,
      });
      instance.addControl(
        new maplibregl.AttributionControl({ compact: true, customAttribution: ATTRIBUTION }),
      );
      instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      instance.scrollZoom.disable(); // 페이지 스크롤을 가로채지 않는다(모바일 배려)

      const created = instance;
      created.on('load', () => {
        if (!cancelled) localizeLabels(created, locale);
      });
      /* 타일이 막히면 maplibre 는 조용히 배경만 그린다 — 이유가 보이게 잡아둔다. */
      created.on('error', (event) => {
        const message = String(
          (event as unknown as { error?: { message?: string } }).error?.message ?? '',
        );
        if (/fetch|load|source|tile/i.test(message) && !cancelled) setTileError(true);
      });

      map.current = created;
      setReady(true);
      if (import.meta.env.DEV) {
        (window as unknown as { __udoMap?: MapLibreMap }).__udoMap = created;
      }
    })();

    return () => {
      cancelled = true;
      setReady(false);
      instance?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, bounds]);

  /*
   * 항로 — 스타일이 다 로드된 뒤에만 소스·레이어를 붙일 수 있다.
   * 라벨 위가 아니라 아래에 깔아 지명을 가리지 않는다.
   */
  useEffect(() => {
    const instance = map.current;
    if (!instance || lines.length === 0) return;

    const draw = () => {
      const data = {
        type: 'FeatureCollection' as const,
        features: lines.map((line) => ({
          type: 'Feature' as const,
          properties: { id: line.id },
          geometry: { type: 'LineString' as const, coordinates: line.coordinates as [number, number][] },
        })),
      };
      const existing = instance.getSource('ferry-routes');
      if (existing && 'setData' in existing) {
        (existing as maplibregl.GeoJSONSource).setData(data);
        return;
      }
      instance.addSource('ferry-routes', { type: 'geojson', data });
      instance.addLayer({
        id: 'ferry-routes-line',
        type: 'line',
        source: 'ferry-routes',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#00a5cd',
          'line-width': 3,
          'line-dasharray': [2, 1.5],
          'line-opacity': 0.9,
        },
      });
    };

    if (instance.isStyleLoaded()) draw();
    else instance.once('load', draw);
  }, [lines, ready]);

  /* 핀은 지도 위에 얹는 DOM 이라 스타일 로딩을 기다릴 필요가 없다. */
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
    return () => markers.current.forEach((m) => m.remove());
  }, [pins, activeId, onSelect, ready]);

  const style = useMemo(() => ({ height }), [height]);

  return (
    <>
      <div ref={container} style={style} className="w-full overflow-hidden rounded-xl border border-line" />
      {tileError && (
        <p className="caption mt-2">지도 타일을 불러오지 못했어요. 잠시 뒤 새로고침해 주세요.</p>
      )}
    </>
  );
}
