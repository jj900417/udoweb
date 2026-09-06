import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import FerryStatusCard from '../components/FerryStatusCard';

/* 우도 나우 앱 안내 — 이 사이트의 실시간 정보가 어디서 오는지도 함께 밝힌다. */
export default function AppPage() {
  const { site, ui } = useContent();

  const features = [
    { icon: '🚦', title: '운항 신호등', desc: '오늘·내일 배가 뜨는지 한 눈에. 결항 시 푸시 알림.' },
    { icon: '🚌', title: '버스 도착', desc: '성산항 터미널 실시간 도착 + 우도 안 순환버스 시각.' },
    { icon: '🌊', title: '물때·기상', desc: '조석 달력과 5일 해상 전망.' },
    { icon: '📹', title: '항구 CCTV', desc: '천진항·하우목동항 실시간 화면.' },
    { icon: '🍽️', title: '가게 정보', desc: '오늘 영업/휴무, 전화, 지도.' },
    { icon: '🗣️', title: '제주어 회화', desc: '섬에서 듣는 말을 배우는 학습 모드.' },
  ];

  return (
    <>
      <SectionHeader
        title={site.app.name}
        subtitle={site.app.desc}
        level={1}
      />

      <FerryStatusCard />

      <div className="mt-12">
        <SectionHeader title={site.appFeaturesTitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="card">
              <div className="text-2xl" aria-hidden>
                {f.icon}
              </div>
              <h3 className="mt-2 font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a href={site.app.web} target="_blank" rel="noopener noreferrer" className="btn-primary">
          웹으로 열기 ↗
        </a>
        {site.app.android && (
          <a href={site.app.android} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Google Play ↗
          </a>
        )}
      </div>

      <p className="mt-8 max-w-3xl text-sm text-faint">
        이 홈페이지의 운항 상태·시간표·가게·축제·사진은 모두 {site.app.name} 서버에서 받아옵니다.
        섬에서 바뀐 정보가 앱에 반영되면 이 사이트도 함께 바뀝니다. {ui.footer.verifyNote}
      </p>
    </>
  );
}
