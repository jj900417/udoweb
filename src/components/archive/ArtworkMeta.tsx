import { Link } from 'react-router-dom';
import { useContent } from '../../i18n';
import { decadeOf, usePlaceResolver, type Work } from '../../archive';
import ArchiveDate from './ArchiveDate';

/*
 * 작품 기록.
 *
 * 라벨 순서는 한국 미술관 기록 관례(작가명→작품명→제작연도→재료→규격→부문→
 * 관리번호→수집경위→전시상태)를 사진 아카이브로 옮긴 것이다. 다만 라벨과 값을
 * 같은 크기·색으로 늘어놓지 않고(그러면 아무것도 스캔되지 않는다) 묶음으로 나눈다.
 *
 * 촬영연도·분류 값은 목록의 같은 조건으로 되돌아가는 링크다 — "관련"이 곧
 * 사용자가 직접 실행할 수 있는 질의라는 것을 보여준다.
 */
type Row = { label: string; value: React.ReactNode };

export default function ArtworkMeta({ work, artistNames }: { work: Work; artistNames: readonly string[] }) {
  const { archive } = useContent();
  const resolvePlace = usePlaceResolver();

  const placeLinks = work.places
    .map((link) => ({ id: link.placeId, name: resolvePlace(link.placeId)?.name }))
    .filter((p): p is { id: `place-${string}`; name: string } => Boolean(p.name));

  const decade = decadeOf(work.created);

  const identity: Row[] = [
    {
      label: archive.work.photographer,
      value: artistNames.length > 0 ? artistNames.join(' · ') : archive.work.unknownArtist,
    },
  ];

  const creation: Row[] = [
    {
      label: archive.work.date,
      value: decade ? (
        <Link to={`/archive/works?decade=${decade}`} className="text-link hover:text-cta-strong">
          <ArchiveDate date={work.created} />
        </Link>
      ) : (
        <ArchiveDate date={work.created} />
      ),
    },
  ];
  if (placeLinks.length > 0) {
    creation.push({
      label: archive.work.place,
      value: placeLinks.map((p, i) => (
        <span key={p.id}>
          {i > 0 && ' · '}
          <Link to={`/archive/works?place=${p.id}`} className="text-link hover:text-cta-strong">
            {p.name}
          </Link>
        </span>
      )),
    });
  }

  const material: Row[] = [];
  if (work.medium) material.push({ label: archive.work.medium, value: work.medium });
  if (work.dimensions) material.push({ label: archive.work.dimensions, value: work.dimensions });
  if (work.tags.length > 0) {
    material.push({
      label: archive.work.classification,
      value: work.tags.map((tag, i) => (
        <span key={tag}>
          {i > 0 && ' · '}
          <Link to={`/archive/works?tag=${encodeURIComponent(tag)}`} className="text-link hover:text-cta-strong">
            {tag}
          </Link>
        </span>
      )),
    });
  }

  const provenance: Row[] = [];
  if (work.accessionNumber) provenance.push({ label: archive.work.accession, value: work.accessionNumber });
  if (work.acquisition) provenance.push({ label: archive.work.acquisition, value: work.acquisition });
  provenance.push({ label: archive.work.visibility, value: archive.work.publicLabel });

  const groups: { title: string; rows: Row[] }[] = [
    { title: archive.work.groups.identity, rows: identity },
    { title: archive.work.groups.creation, rows: creation },
    { title: archive.work.groups.material, rows: material },
    { title: archive.work.groups.provenance, rows: provenance },
  ].filter((g) => g.rows.length > 0);

  return (
    <div className="mt-8 space-y-6">
      {groups.map((group) => (
        <section key={group.title}>
          <h3 className="credit">{group.title}</h3>
          <dl className="mt-2 space-y-1.5">
            {group.rows.map((row) => (
              <div key={row.label} className="flex gap-4">
                <dt className="caption w-20 shrink-0 pt-0.5">{row.label}</dt>
                <dd className="t-meta text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
