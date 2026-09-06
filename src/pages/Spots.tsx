import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import EightViewCard from '../components/EightViewCard';
import PlaceCard from '../components/PlaceCard';

export default function Spots() {
  const { eightViews, places } = useContent();

  return (
    <>
      <SectionHeader
        title="우도8경"
        subtitle="섬 사람들이 오래 꼽아온 여덟 풍경 — 시간과 물때가 맞아야 보이는 것들"
        level={1}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {eightViews.map((v, i) => (
          <EightViewCard key={v.id} view={v} index={i} />
        ))}
      </div>

      <div className="mt-16">
        <SectionHeader title="주요 명소" subtitle="실제로 찾아가는 자리" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </div>
    </>
  );
}
