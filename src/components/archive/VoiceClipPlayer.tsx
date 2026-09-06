import { useCallback, useEffect, useRef, useState } from 'react';
import { useContent } from '../../i18n';
import { mediaUrl, type MediaRef } from '../../archive';

/*
 * 목소리 재생기 — 외부 오디오 라이브러리 없이 브라우저 <audio> 만 쓴다.
 *
 * 규칙
 * - autoplay 금지. preload="metadata"(길이만 먼저 읽는다).
 * - 재생/일시정지 · 처음부터 · 천천히 듣기 · 현재/전체 시간.
 * - '천천히'는 playbackRate 만 바꾼다 — 원본 파일은 건드리지 않는다.
 * - 모든 조작은 버튼(키보드 가능)이고 focus-visible 이 살아 있다.
 * - 색만으로 상태를 알리지 않는다(재생 중은 글자로도 표시).
 */
const SLOW_RATE = 0.75;

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function VoiceClipPlayer({
  media,
  fallbackDurationSec,
}: {
  media: MediaRef | null;
  fallbackDurationSec?: number;
}) {
  const { archive } = useContent();
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(fallbackDurationSec ?? 0);

  const src = mediaUrl(media, 'display');

  useEffect(() => {
    const el = ref.current;
    if (el) el.playbackRate = slow ? SLOW_RATE : 1;
  }, [slow, src]);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, []);

  const restart = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = 0;
    setCurrent(0);
  }, []);

  if (!src) {
    return <p className="caption mt-3">{archive.voice.noAudio}</p>;
  }

  const progress = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className="mt-4">
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration);
        }}
      >
        <track kind="captions" />
      </audio>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={toggle} className="btn-primary" aria-pressed={playing}>
          {playing ? `❚❚ ${archive.voice.pause}` : `▶ ${archive.voice.listen}`}
        </button>
        <button type="button" onClick={restart} className="btn-ghost">
          ↺ {archive.voice.restart}
        </button>
        <button
          type="button"
          onClick={() => setSlow((v) => !v)}
          aria-pressed={slow}
          className="btn-ghost"
        >
          {slow ? archive.voice.normalSpeed : archive.voice.slow}
        </button>
        <span className="caption ml-auto tabular-nums">
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>

      {/* 진행 표시 — 색만이 아니라 위 시간 표기로도 상태를 알 수 있다. */}
      <div className="mt-3 h-1 w-full bg-surface-soft" role="presentation">
        <div className="h-1 bg-brand" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
