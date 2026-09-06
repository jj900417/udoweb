import { Link } from 'react-router-dom';
import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import FerryStatusCard from '../components/FerryStatusCard';
import EightViewCard from '../components/EightViewCard';
import PlaceCard from '../components/PlaceCard';
import FestivalList from '../components/FestivalList';
import GalleryGrid from '../components/GalleryGrid';

export default function Home() {
  const { home, eightViews, places, site, ui } = useContent();

  return (
    <>
      {/* 히어로 — 사진이 준비되면 배경 이미지로 교체(현재는 바다색 그라데이션). */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand-soft via-surface to-sand px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-brand">
          {home.hero.eyebrow}
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
          {home.hero.title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {home.hero.lead}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to={home.hero.ctaPrimary.to} className="btn-primary">
            {home.hero.ctaPrimary.label}
          </Link>
          <Link to={home.hero.ctaSecondary.to} className="btn-ghost">
            {home.hero.ctaSecondary.label}
          </Link>
        </div>
      </section>

      {/* 오늘 배가 뜨나요 — 이 사이트가 다른 관광 페이지와 다른 지점. */}
      <section className="mt-14">
        <SectionHeader
          title={home.sections.ferry.title}
          subtitle={home.sections.ferry.desc}
          action={
            <Link to="/access" className="text-sm font-semibold text-brand">
              {ui.actions.more} →
            </Link>
          }
        />
        <FerryStatusCard />
      </section>

      <section className="mt-14">
        <SectionHeader
          title={home.sections.eight.title}
          subtitle={home.sections.eight.desc}
          action={
            <Link to="/spots" className="text-sm font-semibold text-brand">
              {ui.actions.viewAll} →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eightViews.slice(0, 4).map((v, i) => (
            <EightViewCard key={v.id} view={v} index={i} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader title={home.sections.places.title} subtitle={home.sections.places.desc} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.slice(0, 6).map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader
          title={home.sections.festivals.title}
          subtitle={home.sections.festivals.desc}
        />
        <FestivalList limit={2} />
      </section>

      <section className="mt-14">
        <SectionHeader
          title={home.sections.gallery.title}
          subtitle={home.sections.gallery.desc}
          action={
            <Link to="/gallery" className="text-sm font-semibold text-brand">
              {ui.actions.viewAll} →
            </Link>
          }
        />
        <GalleryGrid limit={8} />
      </section>

      <section className="mt-14 rounded-2xl border border-line bg-surface-soft p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">{home.sections.app.title}</h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">
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
