import { mediaUrl, udoApi } from '../api/udo';
import { useAsync } from '../api/useAsync';
import StateBlock from './StateBlock';

/*
 * 사진 — 앱 서버 /gallery (엠버서더·방문자 업로드 + 검수 통과분).
 * caption/author 는 외부 데이터이므로 텍스트로만 렌더링한다.
 */
export default function GalleryGrid({ limit = 12 }: { limit?: number }) {
  const { data, loading, error } = useAsync((s) => udoApi.gallery(limit, s), [limit]);
  const items = data?.items ?? [];

  if (loading || error || items.length === 0)
    return <StateBlock loading={loading} error={error} empty={!loading && !error} />;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <figure key={p.id} className="overflow-hidden rounded-xl border border-line bg-surface">
          <img
            src={mediaUrl(p.thumb_url || p.url)}
            alt={p.caption || '우도 사진'}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <figcaption className="px-2.5 py-2 text-xs text-faint">
            {p.caption && <span className="block text-ink-soft">{p.caption}</span>}
            {p.author && <span>ⓒ {p.author}</span>}
            {p.tags?.length > 0 && (
              <span className="mt-1 block truncate">
                {p.tags.map((t) => `#${t.name}`).join(' ')}
              </span>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
