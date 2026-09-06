import { useSearchParams } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArchiveSection from '../../components/archive/ArchiveSection';
import ArtworkGrid from '../../components/archive/ArtworkGrid';
import BrowseChips from '../../components/archive/BrowseChips';
import EmptyArchiveState from '../../components/archive/EmptyArchiveState';
import { useFacets, useWorkList, type PlaceRefId } from '../../archive';

/*
 * 작품 목록 + 브라우즈(시대·주제·장소).
 *
 * 선택은 URL 에 남는다(?decade=1970&tag=해녀) — 링크로 공유되고, 작품 상세의
 * "1970년대" 링크가 정확히 이 화면으로 되돌아온다. 축의 값이 2개 미만이면
 * 칩 자체가 나타나지 않으므로, 자료가 없을 때 빈 필터만 남는 일이 없다.
 */
export default function WorkIndex() {
  const { archive } = useContent();
  const [params, setParams] = useSearchParams();
  const facets = useFacets('work');

  const decade = params.get('decade') ?? undefined;
  const tag = params.get('tag') ?? undefined;
  const place = (params.get('place') as PlaceRefId | null) ?? undefined;

  const works = useWorkList({ sort: 'dateDesc', decade, tag, placeId: place }).data ?? [];

  const set = (key: string) => (value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const filtered = Boolean(decade || tag || place);

  return (
    <>
      <PageMeta title={archive.sections.works.title} description={archive.sections.works.desc} />
      <ArchiveSection
        level={1}
        title={archive.sections.works.title}
        sub={archive.sections.works.sub}
        desc={archive.sections.works.desc}
      >
        <BrowseChips facets={facets.decades} active={decade} onSelect={set('decade')} kind="decades" />
        <BrowseChips facets={facets.tags} active={tag} onSelect={set('tag')} kind="tags" />
        <BrowseChips facets={facets.places} active={place} onSelect={set('place')} kind="places" />

        {works.length === 0 ? (
          <EmptyArchiveState />
        ) : (
          <>
            {filtered && (
              <p className="caption mb-6">
                {archive.browse.resultCount.replace('{n}', String(works.length))}
              </p>
            )}
            <ArtworkGrid works={works} />
          </>
        )}
      </ArchiveSection>
    </>
  );
}
