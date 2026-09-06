import { Link } from 'react-router-dom';
import { entityPath, mediaUrl, useArchive, type Work } from '../../archive';
import { useContent } from '../../i18n';
import ArchiveDate from './ArchiveDate';

/*
 * 작품 목록. 카드로 감싸지 않고 이미지 → 제목 → 연도 순으로만 둔다.
 * 이미지는 자르지 않는다(비율 유지) — 그래서 높이가 제각각이고, 그게 맞다.
 */
export default function ArtworkGrid({ works }: { works: readonly Work[] }) {
  const archive = useArchive();
  const { archive: chrome } = useContent();
  const noImage = chrome.work.noImage;
  if (works.length === 0) return null;

  return (
    <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
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
              {!src && (
                /* 사진이 없는 기록도 목록에서 빠지지 않는다 — 없다고 적는다. */
                <span className="flex h-40 w-full items-center justify-center border border-dashed border-line">
                  <span className="caption">{noImage}</span>
                </span>
              )}
              {/* 캡션은 제목 / 연도 두 줄로만 — 그리드에서 설명을 늘어놓지 않는다. */}
              <h3 className="display mt-4 t-meta font-semibold text-ink group-hover:text-link">
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
