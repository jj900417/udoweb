import { Link } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArchiveSection from '../../components/archive/ArchiveSection';
import ArchiveDate from '../../components/archive/ArchiveDate';
import EmptyArchiveState from '../../components/archive/EmptyArchiveState';
import { useExhibitionList } from '../../archive';

/*
 * 기획전 목록 — 촘촘한 격자 대신 한 줄에 하나씩 쌓는 editorial 열.
 * (모바일이 곧 기본형이라 화면이 좁아져도 재배치가 필요 없다.)
 */
export default function ExhibitionIndex() {
  const { archive } = useContent();
  const exhibitions = useExhibitionList({ sort: 'dateDesc' }).data ?? [];

  return (
    <>
      <PageMeta title={archive.sections.exhibitions.title} description={archive.sections.exhibitions.desc} />
      <ArchiveSection
        level={1}
        title={archive.sections.exhibitions.title}
        sub={archive.sections.exhibitions.sub}
        desc={archive.sections.exhibitions.desc}
      >
        {exhibitions.length === 0 ? (
          <EmptyArchiveState />
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {exhibitions.map((e) => (
              <li key={e.id} className="py-8">
                <Link to={`/archive/exhibitions/${e.slug}`} className="group block">
                  <p className="caption">
                    <ArchiveDate date={e.period.start} />
                    {e.period.end && (
                      <>
                        {' — '}
                        <ArchiveDate date={e.period.end} />
                      </>
                    )}
                    {e.venue ? ` · ${e.venue}` : ''}
                  </p>
                  <h2 className="display mt-1 t-section font-semibold text-ink group-hover:text-link">
                    {e.title}
                  </h2>
                  {e.summary && <p className="measure mt-2 t-meta text-ink-soft">{e.summary}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </ArchiveSection>
    </>
  );
}
