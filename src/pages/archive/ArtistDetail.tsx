import { useParams } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArchiveSection from '../../components/archive/ArchiveSection';
import ArtworkGrid from '../../components/archive/ArtworkGrid';
import ArtworkFigure from '../../components/archive/ArtworkFigure';
import SourceList from '../../components/archive/SourceList';
import RelatedRecords from '../../components/archive/RelatedRecords';
import RecordNote from '../../components/archive/RecordNote';
import ArchiveDate from '../../components/archive/ArchiveDate';
import ArchiveNotFound from './ArchiveNotFound';
import { useArchive, useArtist, useSources, useWorksByArtist } from '../../archive';

/* 작가 페이지 — 생애(글)와 주요 작품(이미지)을 분리해 보여준다. */
export default function ArtistDetail() {
  const { slug } = useParams();
  const { archive } = useContent();
  const artist = useArtist(slug).data;
  const works = useWorksByArtist(artist?.id ?? null).data ?? [];
  const sources = useSources(artist?.sourceIds ?? []).data ?? [];
  const portrait = useArchive().getMedia(artist?.portraitMediaId);

  if (!artist) return <ArchiveNotFound />;

  return (
    <>
      <PageMeta title={artist.displayName} description={artist.summary} />

      <header className="measure">
        <p className="credit">{artist.roles.map((r) => archive.labels.roles[r]).join(' · ')}</p>
        <h1 className="display mt-2 text-3xl font-bold text-ink sm:text-4xl">{artist.displayName}</h1>
        {artist.hanja && <p className="caption mt-1">{artist.hanja}</p>}
        <p className="caption mt-2">
          {artist.birth && <ArchiveDate date={artist.birth} />}
          {artist.death && (
            <>
              {' — '}
              <ArchiveDate date={artist.death} />
            </>
          )}
          {artist.village ? ` · ${artist.village}` : ''}
        </p>
        {artist.summary && <p className="mt-5 leading-relaxed text-ink-soft">{artist.summary}</p>}
      </header>

      {portrait && (
        <div className="mt-10 max-w-md">
          <ArtworkFigure media={portrait} credit={portrait.rights.creditLine} priority />
        </div>
      )}

      {artist.body && artist.body.length > 0 && (
        <ArchiveSection title={archive.sections.biography.title}>
          <div className="measure space-y-5">
            {artist.body.map((p) => (
              <p key={p} className="prose-archive">
                {p}
              </p>
            ))}
          </div>
        </ArchiveSection>
      )}

      {artist.statement && artist.statement.length > 0 && (
        <ArchiveSection title={archive.sections.statement.title}>
          <div className="measure space-y-4 border-l-2 border-line pl-5">
            {artist.statement.map((p) => (
              <p key={p} className="display text-lg leading-relaxed text-ink">
                {p}
              </p>
            ))}
          </div>
        </ArchiveSection>
      )}

      {works.length > 0 && (
        <ArchiveSection title={archive.sections.selectedWorks.title}>
          <ArtworkGrid works={works} />
        </ArchiveSection>
      )}

      <div className="measure">
        <SourceList sources={sources} />
      </div>
      <RelatedRecords entity={artist} />
      <div className="measure">
        <RecordNote entity={artist} />
      </div>
    </>
  );
}
