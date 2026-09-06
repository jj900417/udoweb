import { udoApi } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useContent } from '../i18n';
import StateBlock from './StateBlock';

/*
 * 항구 CCTV — 스트림(HLS)을 이 사이트에서 직접 재생하지 않는다(공개 스트림의
 * 대역폭·저작권·http 혼합콘텐츠 문제). 링크로만 연결한다.
 */
export default function CctvList() {
  const { ui } = useContent();
  const { data, loading, error } = useAsync((s) => udoApi.cctv(s));
  const cams = (data?.cams ?? []).filter((c) => c.active);

  if (loading || error || cams.length === 0)
    return <StateBlock loading={loading} error={error} empty={!loading && !error} />;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cams.map((c) => (
          <a
            key={c.id}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover flex items-center justify-between gap-3"
          >
            <span className="font-semibold text-ink">{c.name}</span>
            <span className="text-sm text-link">{ui.actions.openLink} ↗</span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs text-faint">
        {ui.cctv.note} · {data?.source}
      </p>
    </div>
  );
}
