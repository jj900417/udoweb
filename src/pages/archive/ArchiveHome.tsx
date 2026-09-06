import { Link } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArchiveSection from '../../components/archive/ArchiveSection';
import ArtworkGrid from '../../components/archive/ArtworkGrid';
import EmptyArchiveState from '../../components/archive/EmptyArchiveState';
import {
  useArtistList,
  useCollectionList,
  useCounts,
  useExhibitionList,
  useWorkList,
} from '../../archive';

/*
 * 기록 허브. 이미지 목록이 아니라 **아카이브가 무엇을 하려는 곳인지** 를 먼저 말한다.
 * 자료가 없으면 대표 작품 섹션을 통째로 생략한다(가짜 placeholder 를 만들지 않는다).
 */
export default function ArchiveHome() {
  const { archive, ui } = useContent();
  const artists = useArtistList({ sort: 'title', limit: 6 }).data ?? [];
  const works = useWorkList({ sort: 'dateDesc', limit: 6 }).data ?? [];
  const collections = useCollectionList({ limit: 4 }).data ?? [];
  const exhibitions = useExhibitionList({ sort: 'dateDesc', limit: 4 }).data ?? [];
  const nothingYet = artists.length + works.length + collections.length + exhibitions.length === 0;
  /* 개수는 이 아카이브가 실제로 가진 것의 지도다 — 없으면 없는 대로 보여준다. */
  const counts = useCounts(['artist']);

  return (
    <>
      <PageMeta title={archive.sections.artists.title} description={archive.hub.lead} />

      <header className="measure">
        <p className="credit">{archive.hub.eyebrow}</p>
        <h1 className="display mt-3 text-3xl font-bold leading-snug text-ink sm:text-4xl">
          {archive.hub.title}
        </h1>
        <p className="mt-5 leading-relaxed text-ink-soft">{archive.hub.lead}</p>
        <p className="mt-6 border-l-2 border-brand pl-4 text-sm leading-relaxed text-ink-soft">
          <span className="display block text-base text-ink">{archive.philosophy.line}</span>
          <span className="mt-2 block">{archive.philosophy.body}</span>
        </p>
      </header>

      {works.length > 0 && (
        <ArchiveSection title={archive.hub.featured} sub="Featured">
          <ArtworkGrid works={works} />
        </ArchiveSection>
      )}

      <ArchiveSection
        title={archive.sections.artists.title}
        sub={archive.sections.artists.sub}
        desc={archive.sections.artists.desc}
        action={
          <Link to="/archive/artists" className="t-meta font-semibold text-link">
            {ui.actions.viewAll}
            {counts.artist > 0 ? ` ${counts.artist}` : ''} →
          </Link>
        }
      >
        {artists.length === 0 ? (
          <EmptyArchiveState />
        ) : (
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((a) => (
              <li key={a.id}>
                <Link to={`/archive/artists/${a.slug}`} className="display text-lg text-ink hover:text-link">
                  {a.displayName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </ArchiveSection>

      {/* 아카이브의 나머지 갈래 — 자료가 없어도 어디로 가는지는 보여준다. */}
      <ArchiveSection
        title={archive.sections.collections.title}
        sub={archive.sections.collections.sub}
        desc={archive.sections.collections.desc}
      >
        {collections.length === 0 ? (
          <EmptyArchiveState />
        ) : (
          <ul className="space-y-3">
            {collections.map((c) => (
              <li key={c.id}>
                <Link to={`/archive/collections/${c.slug}`} className="display text-lg text-ink hover:text-link">
                  {c.title}
                </Link>
                {c.summary && <p className="caption mt-1">{c.summary}</p>}
              </li>
            ))}
          </ul>
        )}
      </ArchiveSection>

      {exhibitions.length > 0 && (
        <ArchiveSection title={archive.sections.exhibitions.title} sub={archive.sections.exhibitions.sub}>
          <ul className="space-y-3">
            {exhibitions.map((e) => (
              <li key={e.id}>
                <Link to={`/archive/exhibitions/${e.slug}`} className="display text-lg text-ink hover:text-link">
                  {e.title}
                </Link>
              </li>
            ))}
          </ul>
        </ArchiveSection>
      )}


      {nothingYet && (
        <p className="caption mt-14">{archive.empty.structureOnly}</p>
      )}
    </>
  );
}
