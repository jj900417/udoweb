import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveSection from '../components/archive/ArchiveSection';
import HistoryTimeline from '../components/archive/HistoryTimeline';
import EmptyArchiveState from '../components/archive/EmptyArchiveState';
import { useHistoryList } from '../archive';

/*
 * 우도의 시간. 『우도지』 같은 자료를 그대로 옮기는 곳이 아니라, 출처를 밝히면서
 * 읽기 쉽게 다시 쓰는 곳이다. 확인되지 않은 연도를 만들어 넣지 않는다.
 */
export default function History() {
  const { archive } = useContent();
  const entries = useHistoryList({ sort: 'dateAsc' }).data ?? [];

  return (
    <>
      <PageMeta title={archive.sections.history.title} description={archive.sections.history.desc} />

      <header className="measure">
        <p className="credit">{archive.sections.history.sub}</p>
        <h1 className="display mt-2 text-3xl font-bold text-ink sm:text-4xl">
          {archive.sections.history.title}
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          우도에 사람이 들어와 살기 시작한 때부터 지금까지를, 출처를 밝히며 정리합니다.
          연도가 분명하지 않은 일은 분명하지 않은 채로 적습니다.
        </p>
      </header>

      <ArchiveSection title={archive.sections.timeline.title}>
        {entries.length === 0 ? (
          <EmptyArchiveState note="『우도지』와 공공기록을 확인하며 항목을 하나씩 올립니다. 확인되지 않은 연도·사건은 싣지 않습니다." />
        ) : (
          <HistoryTimeline entries={entries} />
        )}
      </ArchiveSection>
    </>
  );
}
