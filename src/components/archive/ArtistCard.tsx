import { Link } from 'react-router-dom';
import { entityPath, mediaUrl, useArchive, type Artist } from '../../archive';
import { useContent } from '../../i18n';
import ArchiveDate from './ArchiveDate';

/* 작가 카드 — 초상이 없으면 이름과 활동 시기만. 빈 사진 자리를 만들지 않는다. */
export default function ArtistCard({ artist }: { artist: Artist }) {
  const { archive } = useContent();
  const portrait = useArchive().getMedia(artist.portraitMediaId);
  const src = mediaUrl(portrait, 'thumb');

  return (
    <article>
      <Link to={entityPath('artist', artist.slug)} className="group block">
        {src && portrait && (
          <img
            src={src}
            alt={portrait.alt}
            loading="lazy"
            className="mb-3 h-auto w-full object-contain"
          />
        )}
        <h3 className="display text-lg font-bold text-ink group-hover:text-brand">
          {artist.displayName}
        </h3>
        <p className="caption mt-1">
          {artist.roles.map((r) => archive.labels.roles[r]).join(' · ')}
          {artist.village ? ` · ${artist.village}` : ''}
        </p>
        {artist.activePeriod && (
          <p className="caption mt-0.5">
            <ArchiveDate date={artist.activePeriod.start} />
            {artist.activePeriod.end ? ' — ' : artist.activePeriod.ongoing ? ' —' : ''}
            {artist.activePeriod.end && <ArchiveDate date={artist.activePeriod.end} />}
          </p>
        )}
        {artist.summary && (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{artist.summary}</p>
        )}
      </Link>
    </article>
  );
}
