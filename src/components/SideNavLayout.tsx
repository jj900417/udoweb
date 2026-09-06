import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useContent } from '../i18n';
import { useCounts, type EntityKind } from '../archive';

/*
 * 허브 안쪽 레이아웃 — 왼쪽 세로 메뉴 + 오른쪽 본문.
 *
 * 메뉴는 접히는 그룹이다. 그룹 이름을 누르면 그 그룹의 대표 페이지로 가고,
 * 옆의 화살표를 누르면 이동 없이 펼치고 접는다. 지금 보고 있는 페이지가 속한
 * 그룹은 자동으로 펼쳐진다 — 어디에 있는지가 늘 보이게.
 *
 * 데스크톱: 왼쪽에 sticky 로 붙는다.
 * 모바일: 같은 목록이 본문 위 접이식(`<details>`)으로 바뀐다 — 360px 에서도 안 깨진다.
 */
type Item = { readonly path: string; readonly label: string; readonly count: string };
type Group = Item & { readonly items: readonly Item[] };

export default function SideNavLayout({ menu }: { menu: 'udo' | 'now' }) {
  const { sideNav } = useContent();
  const { pathname } = useLocation();
  const counts = useCounts([
    'artist',
    'work',
    'collection',
    'exhibition',
    'history',
    'voicePerson',
    'library',
  ]);

  const group = sideNav[menu];
  const groups = group.groups as readonly Group[];

  /*
   * '지금 이 페이지'(exact)와 '이 갈래 안에 있음'(within)을 구분한다.
   * aria-current="page" 는 화면에 **하나만** 있어야 하므로 exact 일 때만 붙이고,
   * 상위 그룹은 색으로만 "여기 안에 있다"를 알린다.
   */
  const isExact = (path: string) => pathname === path;
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  const activeGroup = useMemo(
    () => groups.find((g) => isActive(g.path) || g.items.some((i) => isActive(i.path)))?.path,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, pathname],
  );

  const [open, setOpen] = useState<Record<string, boolean>>({});
  /* 페이지가 바뀌면 그 페이지가 속한 그룹을 펼친다(사용자가 접은 다른 그룹은 그대로). */
  useEffect(() => {
    if (activeGroup) setOpen((prev) => (prev[activeGroup] ? prev : { ...prev, [activeGroup]: true }));
  }, [activeGroup]);

  const countOf = (key: string) => (key ? counts[key as EntityKind] : 0);

  const label = (item: Item) => (
    <>
      {item.label}
      {countOf(item.count) > 0 && (
        <span className="ml-2 font-normal text-faint">{countOf(item.count)}</span>
      )}
    </>
  );

  const tree = (variant: string) => (
    <ul className="space-y-0.5">
      {groups.map((g) => {
        const expanded = open[g.path] ?? false;
        const hasItems = g.items.length > 0;
        const listId = `${variant}-${g.path.replace(/\//g, '-')}`;
        return (
          <li key={g.path}>
            <div className="flex items-center">
              <Link
                to={g.path}
                className={[
                  'flex-1 rounded-lg px-3 py-2 t-meta transition-colors',
                  isExact(g.path)
                    ? 'bg-brand-soft font-semibold text-link'
                    : isActive(g.path) || g.items.some((i) => isActive(i.path))
                      ? 'font-semibold text-ink hover:text-link'
                      : 'text-ink hover:text-link',
                ].join(' ')}
                aria-current={isExact(g.path) ? 'page' : undefined}
              >
                {label(g)}
              </Link>
              {hasItems && (
                <button
                  type="button"
                  onClick={() => setOpen((prev) => ({ ...prev, [g.path]: !expanded }))}
                  aria-expanded={expanded}
                  aria-controls={listId}
                  aria-label={`${g.label} 펼치기`}
                  className="rounded-lg px-2 py-2 text-faint transition-colors hover:text-link"
                >
                  <span aria-hidden>{expanded ? '▾' : '▸'}</span>
                </button>
              )}
            </div>

            {hasItems && expanded && (
              <ul id={listId} className="mt-0.5 space-y-0.5 border-l border-line pl-3">
                {g.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={[
                        'block rounded-lg px-3 py-1.5 t-caption transition-colors',
                        isActive(item.path)
                          ? 'bg-brand-soft font-semibold text-link'
                          : 'text-ink-soft hover:text-link',
                      ].join(' ')}
                      aria-current={isExact(item.path) ? 'page' : undefined}
                    >
                      {label(item)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  /* 지금 위치를 모바일 요약줄에 보여주기 위한 현재 항목 이름. */
  const currentLabel =
    groups.flatMap((g) => [g, ...g.items]).find((i) => isActive(i.path))?.label ?? group.title;

  return (
    <div className="lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
      <nav className="hidden lg:block" aria-label={group.title}>
        <p className="credit mb-3 px-3">{group.title}</p>
        <div className="sticky top-24">{tree('desktop')}</div>
      </nav>

      <details className="mb-8 rounded-xl border border-line lg:hidden">
        <summary className="cursor-pointer list-none px-4 py-3 t-meta font-semibold text-ink">
          <span className="text-faint">{group.title}</span> · {currentLabel}
          <span className="float-right text-faint" aria-hidden>
            ▾
          </span>
        </summary>
        <div className="border-t border-line p-2">{tree('mobile')}</div>
      </details>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
