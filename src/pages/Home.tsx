import { Link } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import SectionHeader from '../components/SectionHeader';
import FerryStatusCard from '../components/FerryStatusCard';
import GalleryGrid from '../components/GalleryGrid';
import ArtworkGrid from '../components/archive/ArtworkGrid';
import { useCounts, useWorkList } from '../archive';

/*
 * 홈 = 기록 + 지금 + 여행.
 * 실시간 운항 카드는 이 사이트의 실용적 차별점이라 홈에서 빼지 않는다.
 * 아카이브 대표 작품은 **자료가 있을 때만** 나온다(가짜 placeholder 금지).
 */
export default function Home() {
  const { home, hubs, site, ui, archive, eightViews } = useContent();
  const featured = useWorkList({ sort: 'dateDesc', limit: 3 }).data ?? [];
  const counts = useCounts(['artist', 'work']);
  /* 기록 입구 한 줄 — 실제 보유량을 함께 보여준다(없으면 표시하지 않는다). */
  const records = [{ ...home.records.artists, count: counts.artist + counts.work }];

  return (
    <>
      <PageMeta description={home.hero.lead} />

      {/* 히어로 — 아카이브 사진이 준비되면 배경으로 교체(지금은 바다색 그라데이션). */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand-soft via-surface to-sand px-6 py-16 sm:px-10 sm:py-24">
        <p className="credit">{home.hero.eyebrow}</p>
        <h1 className="display t-display mt-3 max-w-3xl font-extrabold text-ink">
          {home.hero.title}
        </h1>
        <p className="measure mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
          {home.hero.lead}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={home.hero.ctaPrimary.to} className="btn-primary">
            {home.hero.ctaPrimary.label}
          </Link>
          <Link to={home.hero.ctaSecondary.to} className="btn-ghost">
            {home.hero.ctaSecondary.label}
          </Link>
        </div>
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
        <p className="measure mt-6 text-sm leading-relaxed text-faint">
          {archive.philosophy.line}
        </p>
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

      {/* 현재의 우도 — 방문자·엠버서더 사진(아카이브 작품과 다른 데이터) */}
      <section className="mt-20">
        <SectionHeader
          title={home.sections.gallery.title}
          subtitle={home.sections.gallery.desc}
          action={
            <Link to="/gallery" className="text-sm font-semibold text-link">
              {ui.actions.viewAll} →
            </Link>
          }
        />
        <GalleryGrid limit={8} />
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(hubs.travel.links).map((link) => (
            <Link key={link.to} to={link.to} className="card card-hover">
              <h3 className="font-bold text-ink">{link.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{link.desc}</p>
            </Link>
          ))}
        </div>
        <p className="caption mt-4">
          우도8경 가운데 첫 풍경은 {eightViews[0].name}({eightViews[0].hanja}) — {eightViews[0].meaning}.
        </p>
      </section>

      <section className="mt-20 rounded-2xl border border-line bg-surface-soft p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">{home.sections.app.title}</h2>
        <p className="measure mt-1.5 text-sm leading-relaxed text-ink-soft">
          {site.app.desc} — {home.sections.app.desc}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/app" className="btn-primary">
            {site.app.name} {ui.actions.more}
          </Link>
          <a href={site.app.web} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            {ui.actions.openLink} ↗
          </a>
        </div>
      </section>
    </>
  );
}
