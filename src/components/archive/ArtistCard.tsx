import { Link } from 'react-router-dom';
import { entityPath, mediaUrl, useArchive, type Artist } from '../../archive';
import { useContent } from '../../i18n';
import ArchiveDate from './ArchiveDate';

/*
 * 작가 항목 — 프로필 아바타 격자가 아니라 editorial 한 줄.
 * 대표 이미지가 있으면 왼쪽에 크게, 없으면 이름과 글만으로도 성립한다
 * (빈 사진 자리를 만들지 않는다). 좁은 화면에서는 그대로 세로로 쌓인다.
 */
export default function ArtistCard({ artist }: { artist: Artist }) {
  const { archive } = useContent();
  const repo = useArchive();
  const portrait = repo.getMedia(artist.portraitMediaId);
  const src = mediaUrl(portrait, 'display');
  const workCount = repo.listWorksByArtist(artist.id).length;

  return (
    <article className="grid gap-5 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8">
      <Link to={entityPath('artist', artist.slug)} className="group block">
        {src && portrait && (
          <img
            src={src}
            alt={portrait.alt}
            loading="lazy"
            width={portrait.width}
            height={portrait.height}
            className="h-auto w-full bg-surface-soft object-contain"
          />
        )}
      </Link>
      <div>
        <h3 className="display t-section font-semibold text-ink">
          <Link to={entityPath('artist', artist.slug)} className="hover:text-link">
            {artist.displayName}
          </Link>
        </h3>
        <p className="caption mt-1.5">
          {artist.roles.map((r) => archive.labels.roles[r]).join(' · ')}
          {artist.village ? ` · ${artist.village}` : ''}
        </p>
        {(artist.birth || artist.death) && (
          <p className="caption mt-0.5">
            {artist.birth && <ArchiveDate date={artist.birth} />}
            {artist.death && (
              <>
                {' — '}
                <ArchiveDate date={artist.death} />
              </>
            )}
          </p>
        )}
        {artist.summary && <p className="measure mt-3 t-meta text-ink-soft">{artist.summary}</p>}
        {/* 개수는 이 아카이브가 실제로 가진 것의 정직한 지도다. */}
        {workCount > 0 && (
          <p className="caption mt-3">
            {archive.nav.works} {workCount}
          </p>
        )}
      </div>
    </article>
  );
}
