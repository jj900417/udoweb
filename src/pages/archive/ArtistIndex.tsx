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
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <li key={artist.id}>
                <ArtistCard artist={artist} />
              </li>
            ))}
          </ul>
        )}
      </ArchiveSection>
    </>
  );
}
