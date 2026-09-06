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
          <EmptyArchiveState note="『우도지』를 비롯한 자료의 서지정보부터 정리해 올립니다. 원문 공개 권리가 없는 책은 소개와 소장처만 싣습니다." />
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
