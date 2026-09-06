import { useMemo } from 'react';
import { udoApi } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useContent } from '../i18n';
import UdoMap, { type MapLine, type MapPin } from './archive/UdoMap';

/*
 * 운항 노선도 — 앱의 운항도와 **같은 자료**(항구·항로·운항 중 선박).
 * ferry-server 의 공개 API 를 앱 서버가 중계하고, 우리는 그것을 지도 위에 그린다.
 *
 * ⚠ 이 그림은 **운항 여부를 말하지 않는다.** 배가 보이지 않는 것은 위치 정보가 없다는
 *   뜻일 뿐이다(앱도 같은 규칙 — docs/ferry-state-v2.md). 운항 판정은 운항 상태 카드만 한다.
 */
export default function FerryRouteMap() {
  const { access } = useContent();
  const { data } = useAsync((signal) => udoApi.ferryBoard(signal));

  const pins: MapPin[] = useMemo(
    () =>
      (data?.ports ?? []).map((port) => ({
        id: port.port_id,
        lat: port.lat,
        lon: port.lon,
        label: port.name,
        sub: port.is_mainland_port ? access.mainlandPort : access.islandPort,
      })),
    [data, access.mainlandPort, access.islandPort],
  );

  const lines: MapLine[] = useMemo(
    () =>
      (data?.routes ?? [])
        .filter((route) => route.path.length > 1)
        .map((route) => ({
          id: route.route_id,
          coordinates: route.path.map((p) => [p.lon, p.lat] as [number, number]),
        })),
    [data],
  );

  const bounds = useMemo(() => {
    const m = data?.map_config;
    if (!m) return undefined;
    return [m.min_lon, m.min_lat, m.max_lon, m.max_lat] as [number, number, number, number];
  }, [data]);

  if (pins.length === 0) return null;

  return (
    <div>
      <UdoMap pins={pins} lines={lines} bounds={bounds} height={380} />
      <p className="caption mt-2">
        {access.routeMapNote}
        {data?.routes?.length ? ` · ${data.routes.map((r) => r.public_name).join(' · ')}` : ''}
      </p>
    </div>
  );
}
