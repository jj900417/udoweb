import { useCallback, useEffect, useRef, useState } from 'react';
import { mediaUrl, udoApi, type Banner } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useLocale } from '../i18n';

/*
 * 홈 배너 — 앱 홈 대시보드의 캐러셀과 **같은 자료·같은 동작**.
 * (운영자가 콘솔에서 배너를 바꾸면 앱과 웹이 함께 바뀐다.)
 *
 * 앱과 맞춘 것: 한 번에 한 장 · 5초마다 자동 넘김 · 하단 점 표시 · 좌우로 밀어 넘기기.
 * 웹에서 더한 것:
 *  - 마우스를 올리거나 키보드 포커스가 들어오면 **자동 넘김을 멈춘다**(읽는 중에 안 바뀌게).
 *  - 다른 탭에 가 있는 동안에도 멈춘다(보이지 않는 화면을 넘길 이유가 없다).
 *  - 모션을 줄이도록 설정한 사용자에게는 자동 넘김을 하지 않는다.
 * 넘기기는 스크롤 스냅으로 구현했다 — 터치 스와이프·트랙패드가 그냥 동작하고,
 * 점 버튼은 키보드로도 눌린다.
 */
const INTERVAL_MS = 5000;
/* 배너 원본이 2.05:1 이라 그 비율로 자리를 잡는다(높이가 들쭉날쭉하지 않게). */
const ASPECT = 'aspect-[2/1]';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Slide({ banner }: { banner: Banner }) {
  const src = mediaUrl(banner.image);
  if (!src) return null;

  const image = (
    <img
      src={src}
      alt={banner.caption || ''}
      loading="lazy"
      className={`${ASPECT} w-full object-cover`}
    />
  );
  const isLink = banner.link_type === 'url' && banner.link_value.startsWith('http');

  return (
    <div className="w-full shrink-0 snap-center">
      {isLink ? (
        <a href={banner.link_value} target="_blank" rel="noopener noreferrer">
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  );
}

export default function BannerStrip() {
  const { locale } = useLocale();
  const { data } = useAsync((signal) => udoApi.banners(locale, signal), [locale]);
  const banners = data?.banners ?? [];

  const track = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /*
   * 현재 장을 ref 로도 들고 있는다. setState 업데이터 안에서 스크롤을 시키면
   * (React 가 업데이터를 두 번 실행할 수 있어) 한 번에 두 장씩 넘어간다.
   * 부수효과는 업데이터 밖에서, 값은 ref 에서 읽는다.
   */
  const indexRef = useRef(0);

  const goTo = useCallback((next: number, smooth = true) => {
    const el = track.current;
    if (!el) return;
    indexRef.current = next;
    setIndex(next);
    el.scrollTo({ left: el.clientWidth * next, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  /* 자동 넘김 — 멈춤 조건이 하나라도 걸리면 돌지 않는다. */
  useEffect(() => {
    if (banners.length < 2 || paused || prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      goTo((indexRef.current + 1) % banners.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [banners.length, paused, goTo]);

  /* 손으로 밀었을 때 현재 장을 따라잡는다(점 표시가 어긋나지 않게). */
  const onScroll = () => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    const current = Math.round(el.scrollLeft / el.clientWidth);
    if (current === indexRef.current) return;
    indexRef.current = current;
    setIndex(current);
  };

  if (banners.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={track}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
      >
        {banners.map((banner) => (
          <Slide key={banner.id} banner={banner} />
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`배너 ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={[
                'h-2 w-2 rounded-full border border-white/70 transition-colors',
                i === index ? 'bg-white' : 'bg-white/30',
              ].join(' ')}
            />
          ))}
        </div>
      )}

      {banners[index]?.caption && (
        <p className="caption px-3 py-2">{banners[index].caption}</p>
      )}
    </div>
  );
}
