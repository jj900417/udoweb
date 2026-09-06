import { useCallback, useEffect, useRef, useState } from 'react';
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
 *
 * ★ **치명 오류는 곧바로 포기하지 않는다.**
 *   라이브 HLS 는 세그먼트가 재생 창 밖으로 밀려나거나 상류가 잠깐 끊기면
 *   fatal 이벤트가 정상적으로 발생한다. 예전 구현은 그 한 번에 '불러오지 못했어요'
 *   문구를 띄우고 영영 멈춰서, 잠깐의 딸꾹질이 "영상이 아예 안 나온다"로 보였다.
 *   hls.js 가 권하는 대로 네트워크 오류는 startLoad(), 미디어 오류는
 *   recoverMediaError() 로 되살리고, 그래도 안 되면 그때 문구를 띄운다.
 */
const MAX_RECOVERIES = 3;

export default function CctvPlayer({
  streamUrl,
  poster,
}: {
  streamUrl: string;
  poster?: string;
}) {
  const { ui } = useContent();
  const video = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);
  /* 다시 시도를 누르면 값이 올라가고, 아래 효과가 처음부터 다시 붙는다. */
  const [attempt, setAttempt] = useState(0);

  const src = `/api/cctv?url=${encodeURIComponent(streamUrl)}`;

  const retry = useCallback(() => {
    setFailed(false);
    setAttempt((n) => n + 1);
  }, []);

  /* 항구를 바꾸면 새 스트림으로 이어서 재생한다. */
  useEffect(() => {
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
    if (!el) return;

    let destroy: (() => void) | undefined;
    let cancelled = false;
    const native = el.canPlayType('application/vnd.apple.mpegurl');

    if (native) {
      /* 사파리는 HLS 를 직접 재생한다. 오류는 video 엘리먼트로 온다. */
      el.src = src;
      const onError = () => setFailed(true);
      el.addEventListener('error', onError);
      destroy = () => el.removeEventListener('error', onError);
      void el.play().catch(() => undefined);
    } else {
      void (async () => {
        try {
          const { default: Hls } = await import('hls.js');
          if (cancelled) return;
          if (!Hls.isSupported()) {
            setFailed(true);
            return;
          }
          const hls = new Hls({ liveSyncDurationCount: 4, manifestLoadingMaxRetry: 4 });
          let recoveries = 0;

          hls.on(Hls.Events.ERROR, (_e, data) => {
            if (!data.fatal) return;
            if (recoveries >= MAX_RECOVERIES) {
              setFailed(true);
              return;
            }
            recoveries += 1;
            /* 상류가 잠깐 끊긴 것과 디코딩이 어긋난 것은 되살리는 방법이 다르다. */
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
            else setFailed(true);
          });

          hls.loadSource(src);
          hls.attachMedia(el);
          destroy = () => hls.destroy();
          void el.play().catch(() => undefined);
        } catch {
          if (!cancelled) setFailed(true);
        }
      })();
    }

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [src, attempt]);

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
      {failed && (
        <p className="caption mt-2">
          {ui.cctv.failed}{' '}
          <button type="button" onClick={retry} className="font-semibold text-link underline">
            {ui.actions.retry}
          </button>
        </p>
      )}
    </div>
  );
}
