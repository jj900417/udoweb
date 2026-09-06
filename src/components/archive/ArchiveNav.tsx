import { NavLink } from 'react-router-dom';
import { useContent } from '../../i18n';
import { useCounts } from '../../archive';

/*
 * 아카이브 2차 내비 — /archive 안에서만 보인다. 상단 1차 메뉴(6개)는 그대로 두고
 * 갈래는 여기서 고른다(드롭다운 없음).
 *
 * 개수를 함께 보여준다: 무엇이 얼마나 있는지가 곧 이 아카이브의 정직한 지도다.
 * 자료가 0인 갈래도 감추지 않는다 — 구조를 숨기면 나중에 뭘 채워야 하는지도 안 보인다.
 */
export default function ArchiveNav() {
  const { archive } = useContent();
  const counts = useCounts(['artist', 'work', 'collection', 'exhibition', 'library']);

  const items = [
    { to: '/archive/artists', label: archive.nav.artists, count: counts.artist },
    { to: '/archive/works', label: archive.nav.works, count: counts.work },
    { to: '/archive/collections', label: archive.nav.collections, count: counts.collection },
    { to: '/archive/exhibitions', label: archive.nav.exhibitions, count: counts.exhibition },
    { to: '/archive/library', label: archive.nav.library, count: counts.library },
  ];

  return (
    <nav className="-mx-4 mb-10 overflow-x-auto px-4">
      <ul className="flex min-w-max items-center gap-5 border-b border-line pb-3">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                [
                  't-meta whitespace-nowrap font-semibold transition-colors',
                  isActive ? 'text-ink' : 'text-faint hover:text-link',
                ].join(' ')
              }
            >
              {item.label}
              {item.count > 0 && <span className="ml-1.5 font-normal text-faint">{item.count}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
