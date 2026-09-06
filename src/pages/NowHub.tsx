import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import SectionHeader from '../components/SectionHeader';
import FerryStatusCard from '../components/FerryStatusCard';
import TimetableCard from '../components/TimetableCard';
import FestivalList from '../components/FestivalList';
import CctvList from '../components/CctvList';

/*
 * '지금 우도' — 우도 나우 앱 서버에서 실시간으로 받아오는 것들을 한자리에.
 * 데이터는 이 저장소에 복제하지 않는다(앱 서버가 단일 소스).
 */
export default function NowHub() {
  const { hubs, site } = useContent();

  return (
    <>
      <PageMeta title={hubs.now.title} description={hubs.now.lead} />
      <SectionHeader title={hubs.now.title} subtitle={hubs.now.subtitle} level={1} />

      <p className="measure prose-body">{hubs.now.lead}</p>

      <div className="mt-8">
        <SectionHeader title={hubs.now.sections.ferry} />
        <FerryStatusCard />
      </div>

      <div className="mt-12">
        <SectionHeader title={hubs.now.sections.timetable} />
        <TimetableCard />
      </div>

      <div className="mt-12">
        <SectionHeader title={hubs.now.sections.festivals} />
        <FestivalList limit={4} />
      </div>


      <div className="mt-12">
        <SectionHeader title={hubs.now.sections.cctv} />
        <CctvList />
      </div>


      <p className="caption mt-8">
        {site.app.name} 서버에서 받아온 정보입니다. 최종 확인은 선사·가게 전화가 가장 정확합니다.
      </p>
    </>
  );
}
