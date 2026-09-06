import { useParams } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArtworkFigure from '../../components/archive/ArtworkFigure';
import ArtworkMeta from '../../components/archive/ArtworkMeta';
import ArchiveCredit from '../../components/archive/ArchiveCredit';
import SourceList from '../../components/archive/SourceList';
import RelatedRecords from '../../components/archive/RelatedRecords';
import ArchiveNotFound from './ArchiveNotFound';
import { useArchive, useSources, useWork } from '../../archive';

/*
 * 작품 상세 — 사진이 가장 먼저, 그다음 설명, 메타, credit.
 * 다운로드 버튼은 두지 않는다(권리 확인 없이 원본을 내보내지 않는다).
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
        {media.length > 0 && (
          <div className="space-y-10">
            {media.map((m, i) => (
              <ArtworkFigure key={m.id} media={m} priority={i === 0} />
            ))}
          </div>
        )}

        <header className="measure mt-10">
          <h1 className="display text-2xl font-bold text-ink sm:text-3xl">{work.title}</h1>
          {work.subtitle && <p className="caption mt-1">{work.subtitle}</p>}
          {work.summary && <p className="mt-4 leading-relaxed text-ink-soft">{work.summary}</p>}
        </header>

        {work.body && work.body.length > 0 && (
          <div className="measure mt-6 space-y-4">
            {work.body.map((p) => (
              <p key={p} className="leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        )}

        <div className="measure">
          <ArtworkMeta work={work} artistNames={artistNames} />
          <div className="mt-6 rule pt-4">
            <p className="credit">{archive.work.credit}</p>
            <ArchiveCredit rights={work.rights} />
            <p className="caption mt-2">{archive.work.rightsNote}</p>
          </div>
        </div>

        <SourceList sources={sources} />
        <RelatedRecords entity={work} />
      </article>
    </>
  );
}
