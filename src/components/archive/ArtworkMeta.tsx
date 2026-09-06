import { useContent } from '../../i18n';
import { usePlaceResolver, type Work } from '../../archive';
import ArchiveDate from './ArchiveDate';

/* 작품 메타데이터 — 있는 것만 줄줄이 쓰지 않고 정의 목록으로 정리한다. */
export default function ArtworkMeta({ work, artistNames }: { work: Work; artistNames: readonly string[] }) {
  const { archive } = useContent();
  const resolvePlace = usePlaceResolver();
  const placeNames = work.places
    .map((link) => resolvePlace(link.placeId)?.name)
    .filter((n): n is string => Boolean(n));

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: archive.work.date, value: <ArchiveDate date={work.created} /> },
  ];
  if (work.medium) rows.push({ label: archive.work.medium, value: work.medium });
  if (work.dimensions) rows.push({ label: archive.work.dimensions, value: work.dimensions });
  if (placeNames.length > 0) rows.push({ label: archive.work.place, value: placeNames.join(' · ') });

  return (
    <dl className="mt-6 space-y-2 text-sm">
      <div className="flex gap-3">
        <dt className="w-24 shrink-0 text-faint">{archive.labels.kinds.artist}</dt>
        <dd className="text-ink-soft">
          {artistNames.length > 0 ? artistNames.join(' · ') : archive.work.unknownArtist}
        </dd>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="flex gap-3">
          <dt className="w-24 shrink-0 text-faint">{row.label}</dt>
          <dd className="text-ink-soft">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
