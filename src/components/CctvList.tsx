import { useEffect, useState } from 'react';
import { udoApi } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useContent } from '../i18n';
import StateBlock from './StateBlock';
import CctvPlayer from './CctvPlayer';

/*
 * 항구 CCTV — 항구를 골라 보는 패널.
 *
 * ⚠ 화면 안에서 바로 재생하지 못한다. 제주시가 주는 스트림이 **http 전용**이라
 *   (https 로는 응답하지 않는다) 브라우저가 https 페이지 안에서의 재생을 막는다
 *   — 이른바 혼합 콘텐츠 차단이다. 앱은 네이티브라 이 제약이 없다.
 *   그래서 여기서는 항구를 고르고 새 탭에서 여는 방식으로 둔다.
 *   (우리 서버로 영상을 되받아 넘기면 화면 안 재생이 가능하지만, 공공 스트림을
 *    재송출하게 되고 대역폭도 우리가 떠안는다 — 앱 서버도 같은 이유로 하지 않는다.)
 */
export default function CctvList() {
  const { ui } = useContent();
  const { data, loading, error } = useAsync((s) => udoApi.cctv(s));
  /* active 가 아예 없는 항목도 있다 — 명시적으로 false 일 때만 숨긴다. */
  const cams = (data?.cams ?? []).filter((c) => c.active !== false);
  const keyOf = (cam: { id?: string; name: string }) => cam.id ?? cam.name;
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    if (!selected && cams.length > 0) setSelected(keyOf(cams[0]));
  }, [cams, selected]);

  if (loading || error || cams.length === 0)
    return <StateBlock loading={loading} error={error} empty={!loading && !error} />;

  const current = cams.find((c) => keyOf(c) === selected) ?? cams[0];

  return (
    <div>
      {/* 항구 선택 — 앱처럼 탭으로 고른다. 카메라가 하나뿐이면 탭을 그리지 않는다. */}
      <div className={`flex flex-wrap gap-2 ${cams.length < 2 ? 'hidden' : ''}`}>
        {cams.map((cam) => (
          <button
            key={keyOf(cam)}
            type="button"
            onClick={() => setSelected(keyOf(cam))}
            aria-pressed={keyOf(cam) === keyOf(current)}
            className={`chip ${keyOf(cam) === keyOf(current) ? 'border-brand text-link' : ''}`}
          >
            {cam.name.replace('우도면 ', '')}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-line bg-surface-soft p-4 sm:p-6">
        <p className="t-meta font-semibold text-ink">{current.name}</p>
        {current.desc && <p className="caption mt-1">{current.desc}</p>}
        {/* 출처는 서버가 주는 값을 쓰고, 없을 때만 기본 문구로 채운다(같은 말을 두 번 쓰지 않게). */}
        <p className="caption mt-1">출처: {data?.source || ui.cctv.note}</p>
        {current.url.includes('.m3u8') ? (
          <div className="mt-4">
            <CctvPlayer streamUrl={current.url} />
            <p className="caption mt-2">{ui.cctv.note2}</p>
          </div>
        ) : (
          /* 스트림이 아니라 안내 페이지 링크인 항목(콘솔 설정에 따라 올 수 있다). */
          <a href={current.url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4">
            {ui.cctv.open}
          </a>
        )}
      </div>
    </div>
  );
}
