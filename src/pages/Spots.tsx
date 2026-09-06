import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import EightViewCard from '../components/EightViewCard';
import PlaceCard from '../components/PlaceCard';

export default function Spots() {
  const { eightViews, places, spotsPage } = useContent();

  return (
    <>
      <SectionHeader
        title={spotsPage.eightTitle}
        subtitle={spotsPage.eightSubtitle}
        level={1}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {eightViews.map((v, i) => (
          <EightViewCard key={v.id} view={v} index={i} />
        ))}
      </div>

      <div className="mt-16">
        <SectionHeader title={spotsPage.placesTitle} subtitle={spotsPage.placesSubtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </div>
    </>
  );
}
