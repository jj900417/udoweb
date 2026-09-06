import { useCallback, useEffect, useRef, useState } from 'react';
import { useContent } from '../../i18n';
import { mediaUrl, type MediaRef } from '../../archive';

/*
 * 목소리 재생기 — 외부 오디오 라이브러리 없이 브라우저 <audio> 만 쓴다.
 *
 * 규칙
 * - autoplay 금지. preload="metadata"(길이만 먼저 읽는다).
 * - 재생/일시정지 · 처음부터 · 천천히 듣기 · 현재/전체 시간 · **탐색 슬라이더**.
 * - 탐색은 <input type="range"> — 마우스로도 키보드(←/→, Home/End)로도 움직인다.
 *   커스텀 div 진행바는 키보드로 못 만지므로 쓰지 않는다.
 * - '천천히'는 playbackRate 만 바꾼다. 원본 파일은 건드리지 않는다.
 * - 상태를 색으로만 알리지 않는다(재생 중/멈춤을 글자로도 표시).
 * - waveform 시각화는 만들지 않는다 — 여기서 중요한 건 파형이 아니라 말이다.
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
    if (el.paused) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }, []);

  const restart = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = 0;
    setCurrent(0);
  }, []);

  const seek = useCallback((value: number) => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = value;
    setCurrent(value);
  }, []);

  if (!src) {
    return <p className="caption mt-3">{archive.voice.noAudio}</p>;
  }

  return (
    <div className="mt-5">
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
        <button type="button" onClick={() => setSlow((v) => !v)} aria-pressed={slow} className="btn-ghost">
          {slow ? archive.voice.normalSpeed : archive.voice.slow}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.5}
          value={Math.min(current, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label={archive.voice.seek}
          aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
          className="h-1.5 w-full cursor-pointer accent-brand"
          disabled={!duration}
        />
        <span className="caption shrink-0 tabular-nums">
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>

      {/* 상태를 색이 아니라 글자로도 알린다(스크린리더·색각 이상 모두 고려). */}
      <p className="caption mt-1" aria-live="polite">
        {playing ? archive.voice.playing : archive.voice.paused}
        {slow ? ` · ${archive.voice.slow}` : ''}
      </p>
    </div>
  );
}
