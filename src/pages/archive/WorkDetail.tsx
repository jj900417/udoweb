import { useParams } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArtworkFigure from '../../components/archive/ArtworkFigure';
import ArtworkMeta from '../../components/archive/ArtworkMeta';
import ArchiveCredit from '../../components/archive/ArchiveCredit';
import ArchiveDate from '../../components/archive/ArchiveDate';
import SourceList from '../../components/archive/SourceList';
import RelatedRecords from '../../components/archive/RelatedRecords';
import RecordNote from '../../components/archive/RecordNote';
import ArchiveNotFound from './ArchiveNotFound';
import { useArchive, useSources, useWork } from '../../archive';

/*
 * 작품 상세 — 한 장을 보는 경험이 이 아카이브에서 가장 중요한 화면이다.
 *
 * 사진이 화면을 차지하고(.bleed, 최대 80vh), 그 아래에서 읽는 폭으로 좁혀
 * 제목·기록·credit·이야기·관련으로 내려간다. 이미지는 자르지 않는다.
 * 다운로드 버튼은 없다(docs/archive-rights.md).
 */
export default function WorkDetail() {
  const { slug } = useParams();
  const { archive } = useContent();
  const repo = useArchive();
  const work = useWork(slug).data;
  const sources = useSources(work?.sourceIds ?? []).data ?? [];

  if (!work) return <ArchiveNotFound />;

  const media = repo.getMediaList(work.mediaIds);
  const artistNames = work.artistIds
    .map((id) => repo.getEntityById(id))
    .map((e) => (e && e.kind === 'artist' ? e.displayName : null))
    .filter((n): n is string => Boolean(n));

  return (
    <>
      <PageMeta title={work.title} description={work.summary} />

      <article>
        {media.length > 0 ? (
          <div className="bleed bg-surface-soft py-6 sm:py-10">
            <div className="mx-auto flex max-w-[110rem] flex-col items-center gap-10 px-4">
              {media.map((m, i) => (
                <div key={m.id} className="max-h-[80vh] w-full max-w-5xl">
                  <ArtworkFigure media={m} priority={i === 0} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 사진이 없어도 기록은 남는다 — 없다는 사실을 적는다. */
          <p className="caption border border-dashed border-line px-4 py-10 text-center">
            {archive.work.noImage}
          </p>
        )}

        <header className="measure mt-10">
          <h1 className="display t-section font-bold text-ink">{work.title}</h1>
          <p className="t-meta mt-2 text-faint">
            {artistNames.length > 0 ? artistNames.join(' · ') : archive.work.unknownArtist}
            {' · '}
            <ArchiveDate date={work.created} />
          </p>
          {work.summary && <p className="prose-archive mt-5">{work.summary}</p>}
        </header>

        {work.body && work.body.length > 0 && (
          <div className="measure mt-6 space-y-4">
            {work.body.map((p) => (
              <p key={p} className="prose-archive">
                {p}
              </p>
            ))}
          </div>
        )}

        <div className="measure">
          <ArtworkMeta work={work} artistNames={artistNames} />

          <div className="mt-8 rule pt-4">
            <p className="credit">{archive.work.credit}</p>
            <ArchiveCredit rights={work.rights} />
            <p className="caption mt-2">{archive.work.rightsNote}</p>
          </div>

          <SourceList sources={sources} />
        </div>

        <RelatedRecords entity={work} />
        <div className="measure">
          <RecordNote entity={work} />
        </div>
      </article>
    </>
  );
}
