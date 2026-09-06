import { Link } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import SectionHeader from '../components/SectionHeader';
import FerryStatusCard from '../components/FerryStatusCard';
import InstallButton from '../components/InstallButton';
import BannerStrip from '../components/BannerStrip';
import ArtworkGrid from '../components/archive/ArtworkGrid';
import { useCounts, useWorkList } from '../archive';

/*
 * 홈 = 기록 + 지금 + 여행.
 * 실시간 운항 카드는 이 사이트의 실용적 차별점이라 홈에서 빼지 않는다.
 * 아카이브 대표 작품은 **자료가 있을 때만** 나온다(가짜 placeholder 금지).
 */
export default function Home() {
  const { home, hubs, site, ui } = useContent();
  const featured = useWorkList({ sort: 'dateDesc', limit: 3 }).data ?? [];
  const counts = useCounts(['artist', 'work']);
  /* 기록 입구 한 줄 — 실제 보유량을 함께 보여준다(없으면 표시하지 않는다). */
  const records = [{ ...home.records.artists, count: counts.artist + counts.work }];

  return (
    <>
      <PageMeta description={home.hero.lead} />

      {/* 히어로 — 아카이브 사진이 준비되면 배경으로 교체(지금은 바다색 그라데이션). */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand-soft via-surface to-sand px-6 py-16 sm:px-10 sm:py-24">
        <h1 className="display t-display max-w-3xl font-extrabold text-ink">
          {home.hero.title}
        </h1>
        <p className="measure mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
          {home.hero.lead}
        </p>
      </section>

      {/* 세 갈래 기록 */}
      <section className="mt-20">
        <p className="credit">{home.records.title}</p>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {records.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="group flex flex-wrap items-baseline justify-between gap-2 py-8 transition-colors hover:text-link"
              >
                <span className="display t-section font-bold text-ink group-hover:text-link">
                  {item.title}
                </span>
                <span className="credit">
                  {item.count > 0 ? `${item.count} · ` : ''}
                  {item.sub} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {featured.length > 0 && (
        <section className="mt-20">
          <SectionHeader title={home.sections.featured.title} subtitle={home.sections.featured.desc} />
          <ArtworkGrid works={featured} />
        </section>
      )}

      {/* 지금의 우도 — 실시간 운항 */}
      <section className="mt-20">
        <SectionHeader
          title={home.sections.ferry.title}
          subtitle={home.sections.ferry.desc}
          action={
            <Link to="/now" className="text-sm font-semibold text-link">
              {ui.actions.more} →
            </Link>
          }
        />
        <FerryStatusCard />
      </section>


      {/* 여행 정보 — 뒤로 밀되 없애지 않는다 */}
      <section className="mt-20">
        <SectionHeader
          title={home.sections.travel.title}
          subtitle={home.sections.travel.desc}
          action={
            <Link to="/travel" className="text-sm font-semibold text-link">
              {ui.actions.viewAll} →
            </Link>
          }
        />
        {/* 네 개를 한 줄에 — 좁은 화면에서는 2열, 더 좁으면 1열로 접힌다. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(hubs.travel.links).map((link) => (
            <Link key={link.to} to={link.to} className="card card-hover">
              <h3 className="font-bold text-ink">{link.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 앱 홈과 같은 배너 — 자료가 없으면 아무것도 그리지 않는다. */}
      <section className="mt-16">
        <BannerStrip />
      </section>

      <section className="mt-20 rounded-2xl border border-line bg-surface-soft p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">{home.sections.app.title}</h2>
        <p className="measure mt-1.5 text-sm leading-relaxed text-ink-soft">{site.app.desc}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link to="/app" className="btn-primary">
            {ui.app.about}
          </Link>
          <InstallButton />
        </div>
      </section>
    </>
  );
}
