import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveSection from '../components/archive/ArchiveSection';
import HistoryTimeline from '../components/archive/HistoryTimeline';
import EmptyArchiveState from '../components/archive/EmptyArchiveState';
import BrowseChips from '../components/archive/BrowseChips';
import { useFacets, useHistoryList } from '../archive';
import { useSearchParams } from 'react-router-dom';

/*
 * 우도의 시간. 『우도지』 같은 자료를 그대로 옮기는 곳이 아니라, 출처를 밝히면서
 * 읽기 쉽게 다시 쓰는 곳이다. 확인되지 않은 연도를 만들어 넣지 않는다.
 */
export default function History() {
  const { archive } = useContent();
  const [params, setParams] = useSearchParams();
  const decade = params.get('decade') ?? undefined;
  const facets = useFacets('history');
  const entries = useHistoryList({ sort: 'dateAsc', decade }).data ?? [];

  const selectDecade = (value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value) next.set('decade', value);
    else next.delete('decade');
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageMeta title={archive.sections.history.title} description={archive.sections.history.desc} />

      <header className="measure">
        <p className="credit">{archive.sections.history.sub}</p>
        <h1 className="display t-section mt-2 font-bold text-ink">
          {archive.sections.history.title}
        </h1>
        <p className="prose-archive mt-4">{archive.sections.history.lead}</p>
      </header>

      <ArchiveSection title={archive.sections.timeline.title}>
        <BrowseChips facets={facets.decades} active={decade} onSelect={selectDecade} kind="decades" />
        {entries.length === 0 ? (
          <EmptyArchiveState note={archive.empty.historyNote} />
        ) : (
          <HistoryTimeline entries={entries} />
        )}
      </ArchiveSection>
    </>
  );
}
