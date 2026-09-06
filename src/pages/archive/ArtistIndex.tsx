import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';
import ArchiveSection from '../../components/archive/ArchiveSection';
import ArtistCard from '../../components/archive/ArtistCard';
import EmptyArchiveState from '../../components/archive/EmptyArchiveState';
import { useArtistList } from '../../archive';

export default function ArtistIndex() {
  const { archive } = useContent();
  const artists = useArtistList({ sort: 'title' }).data ?? [];

  return (
    <>
      <PageMeta title={archive.sections.artists.title} description={archive.sections.artists.desc} />
      <ArchiveSection
        level={1}
        title={archive.sections.artists.title}
        sub={archive.sections.artists.sub}
        desc={archive.sections.artists.desc}
      >
        {artists.length === 0 ? (
          <EmptyArchiveState />
        ) : (
          /* 촘촘한 격자 대신 한 명씩 쌓는다 — 모바일이 곧 기본형이라 재배치가 없다. */
          <ul className="divide-y divide-line border-y border-line">
            {artists.map((artist) => (
              <li key={artist.id} className="py-10">
                <ArtistCard artist={artist} />
              </li>
            ))}
          </ul>
        )}
      </ArchiveSection>
    </>
  );
}
