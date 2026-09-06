import { useEffect, useRef, useState } from 'react';
import { useContent } from '../i18n';

/*
 * 항구 CCTV 재생기.
 *
 * 제주시 스트림은 http 전용이라 https 페이지에서 직접 못 튼다 — 그래서 우리 워커의
 * `/api/cctv` 릴레이(같은 출처·https)를 거친다. 재생목록 안 세그먼트 주소도 워커가
 * 릴레이 주소로 바꿔 주므로, 여기서는 그 주소 하나만 넘기면 된다.
 *
 * - **자동 재생**: 화면에 들어오면 바로 튼다. 브라우저가 자동 재생을 허용하도록
 *   음소거로 시작한다(소리는 컨트롤에서 켤 수 있다).
 * - 다른 탭으로 가 있으면 멈춘다 — 보이지 않는 영상을 계속 받을 이유가 없다.
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
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);

  const src = `/api/cctv?url=${encodeURIComponent(streamUrl)}`;

  /* 항구를 바꾸면 새 스트림으로 이어서 재생한다. */
  useEffect(() => {
    setPlaying(true);
    setFailed(false);
  }, [streamUrl]);

  /* 탭이 가려지면 멈추고, 돌아오면 다시 튼다(대역폭·상류 부하 절약). */
  useEffect(() => {
    const onVisibility = () => {
      const el = video.current;
      if (!el) return;
      if (document.hidden) el.pause();
      else void el.play().catch(() => undefined);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

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
          controls
          autoPlay
          playsInline
          muted
          className="aspect-video w-full bg-black"
        />
      </div>
      {failed && <p className="caption mt-2">{ui.cctv.failed}</p>}
    </div>
  );
}
