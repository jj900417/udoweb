import { Link, Outlet, useLocation } from 'react-router-dom';
import { useContent } from '../i18n';
import { useCounts, type EntityKind } from '../archive';

/*
 * 허브 안쪽 레이아웃 — 왼쪽 세로 메뉴 + 오른쪽 본문.
 *
 * 데스크톱: 왼쪽에 고정(sticky)된 목록, 스크롤해도 따라온다.
 * 모바일: 같은 목록이 본문 위에 가로 스크롤 줄로 바뀐다(360px 에서도 안 깨진다).
 *
 * 메뉴는 src/data/sideNav.ts 가 단일 소스이고, 아카이브 갈래에는 보유 개수를 붙인다.
 */
type Item = { readonly path: string; readonly label: string; readonly count: string };

export default function SideNavLayout({ menu }: { menu: 'udo' | 'now' }) {
  const { sideNav } = useContent();
  const { pathname } = useLocation();
  const counts = useCounts(['artist', 'work', 'collection', 'exhibition', 'history', 'voicePerson', 'library']);
  const group = sideNav[menu];
  const items = group.items as readonly Item[];

  /* 하위 경로(예: /archive/artists/kim)에서도 해당 항목이 켜져 있어야 한다. */
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const link = (item: Item, active: boolean) => (
    <Link
      to={item.path}
      className={[
        'block whitespace-nowrap rounded-lg px-3 py-2 t-meta transition-colors',
        active ? 'bg-brand-soft font-semibold text-link' : 'text-ink-soft hover:text-link',
      ].join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      {item.label}
      {item.count && counts[item.count as EntityKind] > 0 && (
        <span className="ml-2 font-normal text-faint">{counts[item.count as EntityKind]}</span>
      )}
    </Link>
  );

  return (
    <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12">
      {/* 데스크톱: 왼쪽 고정 목록 */}
      <nav className="hidden lg:block" aria-label={group.title}>
        <p className="credit mb-3 px-3">{group.title}</p>
        <ul className="sticky top-24 space-y-0.5">
          {items.map((item) => (
            <li key={item.path}>{link(item, isActive(item.path))}</li>
          ))}
        </ul>
      </nav>

      {/* 모바일: 같은 목록을 가로 줄로 */}
      <nav className="-mx-4 mb-8 overflow-x-auto px-4 lg:hidden" aria-label={group.title}>
        <ul className="flex min-w-max gap-1 border-b border-line pb-2">
          {items.map((item) => (
            <li key={item.path}>{link(item, isActive(item.path))}</li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
