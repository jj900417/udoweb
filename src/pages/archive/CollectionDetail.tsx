import { Link, useParams } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArchiveSection from '../../components/archive/ArchiveSection';
import SourceList from '../../components/archive/SourceList';
import EmptyArchiveState from '../../components/archive/EmptyArchiveState';
import ArchiveNotFound from './ArchiveNotFound';
import { entityPath, useCollection, useCollectionMembers, useSources } from '../../archive';

export default function CollectionDetail() {
  const { slug } = useParams();
  const { archive } = useContent();
  const collection = useCollection(slug).data;
  const members = useCollectionMembers(collection?.id ?? null).data ?? [];
  const sources = useSources(collection?.sourceIds ?? []).data ?? [];

  if (!collection) return <ArchiveNotFound />;

  return (
    <>
      <PageMeta title={collection.title} description={collection.summary} />
      <header className="measure">
        <p className="credit">{archive.sections.collections.sub}</p>
        <h1 className="display mt-2 text-3xl font-bold text-ink">{collection.title}</h1>
        {collection.summary && <p className="mt-4 leading-relaxed text-ink-soft">{collection.summary}</p>}
      </header>

      {collection.body && collection.body.length > 0 && (
        <div className="measure mt-6 space-y-4">
          {collection.body.map((p) => (
            <p key={p} className="leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </div>
      )}

      <ArchiveSection title={archive.sections.works.title}>
        {members.length === 0 ? (
          <EmptyArchiveState />
        ) : (
          <ul className="space-y-3">
            {members.map((m) => (
              <li key={m.id}>
                <Link to={entityPath(m.kind, m.slug)} className="display text-lg text-ink hover:text-link">
                  {m.title}
                </Link>
                <span className="caption ml-2">{archive.labels.kinds[m.kind]}</span>
              </li>
            ))}
          </ul>
        )}
      </ArchiveSection>

      <SourceList sources={sources} />
    </>
  );
}
