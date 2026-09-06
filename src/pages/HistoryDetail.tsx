import { useParams } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveDate from '../components/archive/ArchiveDate';
import SourceList from '../components/archive/SourceList';
import RelatedRecords from '../components/archive/RelatedRecords';
import ArtworkFigure from '../components/archive/ArtworkFigure';
import RecordNote from '../components/archive/RecordNote';
import ArchiveNotFound from './archive/ArchiveNotFound';
import { useArchive, useHistoryEntry, useSources } from '../archive';

export default function HistoryDetail() {
  const { slug } = useParams();
  const { archive } = useContent();
  const entry = useHistoryEntry(slug).data;
  const sources = useSources(entry?.sourceIds ?? []).data ?? [];
  const media = useArchive().getMediaList(entry?.mediaIds ?? []);

  if (!entry) return <ArchiveNotFound />;

  return (
    <article>
      <PageMeta title={entry.title} description={entry.summary} />

      <header className="measure">
        <p className="credit">
          {archive.labels.categories[entry.category]}
          {entry.era ? ` · ${entry.era}` : ''}
        </p>
        <h1 className="display mt-2 t-section font-bold text-ink">{entry.title}</h1>
        <p className="caption mt-2">
          <ArchiveDate date={entry.when} />
        </p>
        {entry.summary && <p className="prose-archive mt-5">{entry.summary}</p>}
      </header>

      {/*
       * 본문과 사진을 교차 배치한다 — 사진을 맨 위에 몰아넣지 않고 글 사이에 두면
       * 기사가 그 시대를 걷는 것처럼 읽힌다. 사진은 단 폭의 60~70%, 정렬을 번갈아.
       */}
      {entry.body && entry.body.length > 0 && (
        <div className="mt-10 space-y-6">
          {entry.body.map((paragraph, i) => {
            const image = media[Math.floor(i / 2)];
            const showImage = i > 0 && i % 2 === 1 && image;
            return (
              <div key={paragraph}>
                {showImage && (
                  <div
                    className={`my-10 w-full sm:w-[68%] ${
                      Math.floor(i / 2) % 2 === 1 ? 'sm:ml-auto' : ''
                    }`}
                  >
                    <ArtworkFigure media={image} credit={image.rights.creditLine} />
                  </div>
                )}
                <p className="measure prose-archive">{paragraph}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* 본문보다 사진이 많으면 남은 것은 아래에 모아 보여준다. */}
      {media.length > Math.ceil((entry.body?.length ?? 0) / 2) && (
        <div className="mt-12 space-y-12">
          {media.slice(Math.ceil((entry.body?.length ?? 0) / 2)).map((m) => (
            <div key={m.id} className="w-full sm:w-[68%]">
              <ArtworkFigure media={m} credit={m.rights.creditLine} />
            </div>
          ))}
        </div>
      )}

      <div className="measure">
        <SourceList sources={sources} />
      </div>
      <RelatedRecords entity={entry} />
      <div className="measure">
        <RecordNote entity={entry} />
      </div>
    </article>
  );
}
