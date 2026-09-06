import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArchiveSection from '../../components/archive/ArchiveSection';
import LibraryItemRow from '../../components/archive/LibraryItemRow';
import EmptyArchiveState from '../../components/archive/EmptyArchiveState';
import { useLibraryList } from '../../archive';

/*
 * 우도 서재. 원문 공개 권리가 없는 자료는 서지정보와 소개만 싣는다
 * (docs/archive-rights.md).
 */
export default function LibraryIndex() {
  const { archive } = useContent();
  const items = useLibraryList({ sort: 'dateDesc' }).data ?? [];

  return (
    <>
      <PageMeta title={archive.sections.library.title} description={archive.sections.library.desc} />
      <ArchiveSection
        level={1}
        title={archive.sections.library.title}
        sub={archive.sections.library.sub}
        desc={archive.sections.library.desc}
      >
        {items.length === 0 ? (
          <EmptyArchiveState note={archive.empty.libraryNote} />
        ) : (
          <ul>
            {items.map((item) => (
              <LibraryItemRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </ArchiveSection>
    </>
  );
}
