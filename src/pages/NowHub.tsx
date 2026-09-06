import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import SectionHeader from '../components/SectionHeader';
import FerryStatusCard from '../components/FerryStatusCard';
import TimetableCard from '../components/TimetableCard';
import FestivalList from '../components/FestivalList';

/*
 * '지금 우도' — 우도 나우 앱 서버에서 실시간으로 받아오는 것들을 한자리에.
 * 데이터는 이 저장소에 복제하지 않는다(앱 서버가 단일 소스).
 */
export default function NowHub() {
  const { hubs, harbor, ui } = useContent();
  const [timetableOpen, setTimetableOpen] = useState(false);

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
        {/*
          * 시간표는 기본으로 접어 둔다. 이 화면에서 사람들이 먼저 보려는 것은
          * '오늘 배가 뜨는지'(운항 상태)이고, 시간표는 필요할 때 펼쳐 보는 참고 자료다.
          * 접혀 있을 때는 아예 그리지 않는다 — 안 보는 표를 앱 서버에서 받아올 이유가 없다.
          */}
        <SectionHeader
          title={hubs.now.sections.timetable}
          action={
            <button
              type="button"
              onClick={() => setTimetableOpen((open) => !open)}
              aria-expanded={timetableOpen}
              aria-controls="now-timetable"
              className="text-sm font-semibold text-link"
            >
              {timetableOpen ? ui.actions.collapse : ui.actions.expand}
            </button>
          }
        />
        {timetableOpen && (
          <div id="now-timetable">
            <TimetableCard />
          </div>
        )}
      </div>

      <div className="mt-12">
        <SectionHeader title={hubs.now.sections.festivals} />
        <FestivalList limit={4} />
      </div>


      <div className="mt-12">
        <SectionHeader title={hubs.now.sections.cctv} />
        {/* 재생은 항구 페이지 한 곳에서만 — 같은 스트림을 두 화면에서 받지 않는다. */}
        <Link to="/harbor" className="card card-hover block">
          <h3 className="font-bold text-ink">{harbor.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{harbor.subtitle}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-link">{ui.actions.more} →</span>
        </Link>
      </div>


    </>
  );
}
