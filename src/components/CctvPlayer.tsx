import { useEffect, useRef, useState } from 'react';
import { useContent } from '../i18n';

/*
 * 항구 CCTV 재생기.
 *
 * 제주시 스트림은 http 전용이라 https 페이지에서 직접 못 튼다 — 그래서 우리 워커의
 * `/api/cctv` 릴레이(같은 출처·https)를 거친다. 재생목록 안 세그먼트 주소도 워커가
 * 릴레이 주소로 바꿔 주므로, 여기서는 그 주소 하나만 넘기면 된다.
 *
 * - **누르면 재생**: 들어오자마자 영상을 받지 않는다(데이터·상류 부하 절약).
 * - iOS 사파리는 HLS 를 자체 재생하므로 hls.js 를 받지 않는다.
 * - hls.js 는 눌렀을 때만 내려받는다(동적 import) — 안 보는 사람은 비용 0.
 */
export default function CctvPlayer({
  streamUrl,
  poster,
}: {
  streamUrl: string;
  poster?: string;
}) {
  const { ui } = useContent();
  const video = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const src = `/api/cctv?url=${encodeURIComponent(streamUrl)}`;

  useEffect(() => {
    setPlaying(false);
    setFailed(false);
  }, [streamUrl]);

  useEffect(() => {
    const el = video.current;
    if (!playing || !el) return;

    let destroy: (() => void) | undefined;
    const native = el.canPlayType('application/vnd.apple.mpegurl');

    if (native) {
      el.src = src;
      void el.play().catch(() => setFailed(true));
    } else {
      void (async () => {
        try {
          const { default: Hls } = await import('hls.js');
          if (!Hls.isSupported()) {
            setFailed(true);
            return;
          }
          const hls = new Hls({ liveSyncDurationCount: 4, manifestLoadingMaxRetry: 4 });
          hls.loadSource(src);
          hls.attachMedia(el);
          hls.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal) setFailed(true);
          });
          destroy = () => hls.destroy();
          void el.play().catch(() => undefined);
        } catch {
          setFailed(true);
        }
      })();
    }

    return () => destroy?.();
  }, [playing, src]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-line bg-black">
        <video
          ref={video}
          poster={poster}
          controls={playing}
          playsInline
          muted
          className="aspect-video w-full bg-black"
        />
        {!playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-on-cta"
          >
            <span className="btn-primary">▶ {ui.cctv.play}</span>
          </button>
        )}
      </div>
      {/*
        * 릴레이가 막히면(예: 원본이 비표준 포트라 엣지에서 못 나갈 때) 화면 안 재생을
        * 포기하고 원본을 새 탭으로 연다 — 아무것도 못 보는 것보다 낫다.
        */}
      {failed && (
        <p className="caption mt-2">
          {ui.cctv.failed}{' '}
          <a href={streamUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-link">
            {ui.cctv.open} ↗
          </a>
        </p>
      )}
    </div>
  );
}
