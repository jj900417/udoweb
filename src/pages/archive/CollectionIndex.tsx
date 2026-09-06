import { Link } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArchiveSection from '../../components/archive/ArchiveSection';
import EmptyArchiveState from '../../components/archive/EmptyArchiveState';
import { useCollectionList } from '../../archive';

export default function CollectionIndex() {
  const { archive } = useContent();
  const collections = useCollectionList({ sort: 'title' }).data ?? [];

  return (
    <>
      <PageMeta title={archive.sections.collections.title} description={archive.sections.collections.desc} />
      <ArchiveSection
        level={1}
        title={archive.sections.collections.title}
        sub={archive.sections.collections.sub}
        desc={archive.sections.collections.desc}
      >
        {collections.length === 0 ? (
          <EmptyArchiveState />
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {collections.map((c) => (
              <li key={c.id} className="py-6">
                <Link to={`/archive/collections/${c.slug}`} className="group block">
                  <h2 className="display t-section font-semibold text-ink group-hover:text-link">
                    {c.title}
                  </h2>
                  {c.summary && <p className="measure mt-2 t-meta text-ink-soft">{c.summary}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </ArchiveSection>
    </>
  );
}
