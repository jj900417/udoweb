import { Link } from 'react-router-dom';
import { entityPath, mediaUrl, useArchive, type Work } from '../../archive';
import ArchiveDate from './ArchiveDate';

/*
 * 작품 목록. 카드로 감싸지 않고 이미지 → 제목 → 연도 순으로만 둔다.
 * 이미지는 자르지 않는다(비율 유지) — 그래서 높이가 제각각이고, 그게 맞다.
 */
export default function ArtworkGrid({ works }: { works: readonly Work[] }) {
  const archive = useArchive();
  if (works.length === 0) return null;

  return (
    <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((work) => {
        const media = archive.getMedia(work.mediaIds[0]);
        const src = mediaUrl(media, 'display');
        return (
          <li key={work.id}>
            <Link to={entityPath('work', work.slug)} className="group block">
              {src && media && (
                <img
                  src={src}
                  alt={media.alt}
                  loading="lazy"
                  width={media.width}
                  height={media.height}
                  className="h-auto w-full bg-surface-soft object-contain"
                />
              )}
              <h3 className="display mt-3 text-base font-semibold text-ink group-hover:text-brand">
                {work.title}
              </h3>
              <p className="caption mt-0.5">
                <ArchiveDate date={work.created} />
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
