import { useParams } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArchiveSection from '../../components/archive/ArchiveSection';
import ArtworkGrid from '../../components/archive/ArtworkGrid';
import ArchiveDate from '../../components/archive/ArchiveDate';
import EmptyArchiveState from '../../components/archive/EmptyArchiveState';
import ArchiveNotFound from './ArchiveNotFound';
import { useExhibition, useWorksInExhibition } from '../../archive';

export default function ExhibitionDetail() {
  const { slug } = useParams();
  const { archive } = useContent();
  const exhibition = useExhibition(slug).data;
  const works = useWorksInExhibition(exhibition?.id ?? null).data ?? [];

  if (!exhibition) return <ArchiveNotFound />;

  return (
    <>
      <PageMeta title={exhibition.title} description={exhibition.summary} />
      <header className="measure">
        <p className="credit">{archive.sections.exhibitions.sub}</p>
        <h1 className="display mt-2 text-3xl font-bold text-ink">{exhibition.title}</h1>
        <p className="caption mt-2">
          <ArchiveDate date={exhibition.period.start} />
          {exhibition.period.end && (
            <>
              {' — '}
              <ArchiveDate date={exhibition.period.end} />
            </>
          )}
          {exhibition.venue ? ` · ${exhibition.venue}` : ''}
        </p>
        {exhibition.summary && <p className="mt-4 leading-relaxed text-ink-soft">{exhibition.summary}</p>}
      </header>

      <ArchiveSection title={archive.sections.works.title}>
        {works.length === 0 ? <EmptyArchiveState /> : <ArtworkGrid works={works} />}
      </ArchiveSection>
    </>
  );
}
