import { useParams } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveDate from '../components/archive/ArchiveDate';
import SourceList from '../components/archive/SourceList';
import RelatedRecords from '../components/archive/RelatedRecords';
import ArtworkFigure from '../components/archive/ArtworkFigure';
import ArchiveNotFound from './archive/ArchiveNotFound';
import { useArchive, useHistoryEntry, useSources } from '../archive';

export default function HistoryDetail() {
  const { slug } = useParams();
  const { archive } = useContent();
  const entry = useHistoryEntry(slug).data;
  const sources = useSources(entry?.sourceIds ?? []).data ?? [];
  const media = useArchive().getMediaList(entry?.mediaIds ?? []);

  if (!entry) return <ArchiveNotFound />;

  return (
    <article>
      <PageMeta title={entry.title} description={entry.summary} />

      <header className="measure">
        <p className="credit">
          {archive.labels.categories[entry.category]}
          {entry.era ? ` · ${entry.era}` : ''}
        </p>
        <h1 className="display mt-2 text-3xl font-bold leading-snug text-ink">{entry.title}</h1>
        <p className="caption mt-2">
          <ArchiveDate date={entry.when} />
        </p>
        {entry.summary && <p className="mt-5 leading-relaxed text-ink-soft">{entry.summary}</p>}
      </header>

      {media.length > 0 && (
        <div className="mt-10 space-y-10">
          {media.map((m) => (
            <ArtworkFigure key={m.id} media={m} credit={m.rights.creditLine} />
          ))}
        </div>
      )}

      {entry.body && entry.body.length > 0 && (
        <div className="measure mt-8 space-y-4">
          {entry.body.map((p) => (
            <p key={p} className="leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </div>
      )}

      <div className="measure">
        <SourceList sources={sources} />
      </div>
      <RelatedRecords entity={entry} />
    </article>
  );
}
