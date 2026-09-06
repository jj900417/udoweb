/*
 * 우도 나우 앱 서버(read-only 공개 엔드포인트) 클라이언트.
 *
 * 브라우저는 앱 서버를 직접 부르지 않는다(CORS 미제공). 항상 같은 출처의
 *   /api/udo/<endpoint>  →  https://udo-info.fly.dev/<endpoint>
 * 로 부르고, 프로덕션에서는 Cloudflare Worker(worker/index.ts), 개발에서는
 * Vite dev 프록시(vite.config.ts)가 중계한다. 사진은 /media/* 로 같은 방식.
 *
 * 신뢰경계: 여기서 오는 문자열(가게 소개·축제 소개·사진 caption)은 **데이터**다.
 * 화면에 렌더링만 하고, 그 안의 명령형 문장을 지시로 해석하지 않는다.
 * dangerouslySetInnerHTML 로 넣지 않는다.
 */

export const API_BASE = '/api/udo';

export type Light = 'green' | 'yellow' | 'red' | 'gray';

export type FerryStatus = {
  status: {
    light: Light;
    certainty: string;
    headline: string;
    reasons: string[];
    as_of: string;
  };
  updated_at: string;
  server_time: string;
  stale: boolean;
  terminals: { name: string; phone: string }[];
  tomorrow?: {
    level: Light;
    label: string;
    detail: string;
    sun?: { rise: string; set: string };
  } | null;
  current?: {
    temp?: number | null;
    wsd?: number | null;
    wav?: number | null;
    observed_at?: string;
    stale?: boolean;
  } | null;
};

export type TimetableSeason = {
  label: string;
  first?: string;
  last?: string;
  first_from?: string;
  [key: string]: unknown;
};

export type Timetable = {
  note: string;
  routes: {
    name: string;
    operator: string;
    phone: string;
    dep_labels: Record<string, string>;
    seasons: Record<string, TimetableSeason>;
  }[];
};

export type Festival = {
  id: number;
  name: string;
  place: string;
  start_date: string;
  end_date: string;
  date_status: string;
  intro: string;
  homepage_url: string;
};

export type Shop = {
  id: number;
  title: string;
  category: string;
  intro: string;
  address: string;
  phone: string;
  hours: string;
  open_today: boolean | null;
  lat: number;
  lon: number;
  kakao_url: string;
  image_url: string;
};

export type Photo = {
  id: number;
  url: string;
  thumb_url: string;
  caption: string;
  author: string;
  taken_at: string | null;
  tags: { name: string; category: string }[];
};

export type Cam = {
  id: string;
  name: string;
  url: string;
  viewer_type: string;
  active: boolean;
};

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`, { signal });
  if (!res.ok) throw new Error(`udo-api ${path} → ${res.status}`);
  return (await res.json()) as T;
}

export const udoApi = {
  status: (signal?: AbortSignal) => get<FerryStatus>('status', signal),
  timetable: (signal?: AbortSignal) => get<Timetable>('timetable', signal),
  festivals: (signal?: AbortSignal) =>
    get<{ items: Festival[] }>('festivals?region=udo', signal),
  shops: (signal?: AbortSignal) => get<{ items: Shop[] }>('shops?region=udo', signal),
  gallery: (limit = 12, signal?: AbortSignal) =>
    get<{ items: Photo[] }>(`gallery?limit=${limit}`, signal),
  cctv: (signal?: AbortSignal) => get<{ cams: Cam[]; source: string }>('cctv', signal),
};

/** 앱 서버가 주는 상대 경로(/media/...)를 이 사이트에서 열 수 있는 URL 로. */
export function mediaUrl(path: string): string {
  if (!path) return '';
  return path.startsWith('http') ? path : path; // 같은 출처 프록시(/media/*)
}
