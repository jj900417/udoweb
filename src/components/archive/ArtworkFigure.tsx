import { aspectRatio, mediaUrl, type MediaRef } from '../../archive';

/*
 * 작품 이미지.
 *
 * ★ 원본 비율을 그대로 지킨다 — aspect-square + object-cover 로 자르지 않는다.
 *   (그건 /gallery 의 '현재의 우도' 사진 스트림에서만 쓰는 방식이다.)
 * 비율을 아는 경우 aspect-ratio 를 미리 걸어 레이아웃이 튀지 않게 한다.
 */
export default function ArtworkFigure({
  media,
  caption,
  credit,
  priority = false,
}: {
  media: MediaRef | null;
  caption?: string;
  credit?: string;
  priority?: boolean;
}) {
  const src = mediaUrl(media, 'display');
  if (!src || !media) return null;
  const ratio = aspectRatio(media);

  return (
    <figure className="w-full">
      <img
        src={src}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width={media.width}
        height={media.height}
        style={ratio ? { aspectRatio: String(ratio) } : undefined}
        className="h-auto w-full bg-surface-soft object-contain"
      />
      {(caption || credit) && (
        <figcaption className="mt-3">
          {caption && <span className="block text-sm leading-relaxed text-ink-soft">{caption}</span>}
          {credit && <span className="credit mt-1 block">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
