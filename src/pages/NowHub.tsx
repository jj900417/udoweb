import { Link } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import SectionHeader from '../components/SectionHeader';
import FerryStatusCard from '../components/FerryStatusCard';
import TimetableCard from '../components/TimetableCard';
import FestivalList from '../components/FestivalList';
import GalleryGrid from '../components/GalleryGrid';
import CctvList from '../components/CctvList';

/*
 * '지금 우도' — 우도 나우 앱 서버에서 실시간으로 받아오는 것들을 한자리에.
 * 데이터는 이 저장소에 복제하지 않는다(앱 서버가 단일 소스).
 */
export default function NowHub() {
  const { hubs, site, ui } = useContent();
  const links = Object.values(hubs.now.links);

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
        <SectionHeader
          title={hubs.now.sections.photos}
          action={
            <Link to="/gallery" className="text-sm font-semibold text-link">
              {ui.actions.viewAll} →
            </Link>
          }
        />
        <GalleryGrid limit={8} />
      </div>

      <div className="mt-12">
        <SectionHeader title={hubs.now.sections.cctv} />
        <CctvList />
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="card card-hover">
            <h2 className="font-bold text-ink">{link.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{link.desc}</p>
          </Link>
        ))}
      </div>

      <p className="caption mt-8">
        {site.app.name} 서버에서 받아온 정보입니다. 최종 확인은 선사·가게 전화가 가장 정확합니다.
      </p>
    </>
  );
}
