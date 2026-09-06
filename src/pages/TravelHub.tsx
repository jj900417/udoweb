import { Link } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import SectionHeader from '../components/SectionHeader';

/*
 * 여행 허브. 기존 여행 페이지(/spots·/access·/experience·/food·/tips)는 그대로 있고
 * 여기서 안내만 한다 — URL 을 바꾸지 않기 위해서다(공유된 링크가 살아 있어야 한다).
 */
export default function TravelHub() {
  const { hubs, ui } = useContent();
  const links = Object.values(hubs.travel.links);

  return (
    <>
      <PageMeta title={hubs.travel.title} description={hubs.travel.lead} />
      <SectionHeader title={hubs.travel.title} subtitle={hubs.travel.subtitle || undefined} level={1} />

      <p className="measure prose-body">{hubs.travel.lead}</p>

      {/* 네 개를 한 줄에 — 좁은 화면에서는 2열, 더 좁으면 1열로 접힌다. */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="card card-hover">
            <h2 className="font-bold text-ink">{link.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{link.desc}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-link">
              {ui.actions.more} →
            </span>
          </Link>
        ))}
      </div>

    </>
  );
}
