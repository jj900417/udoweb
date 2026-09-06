import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../i18n';
import LocaleSelect from './LocaleSelect';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { nav, ui } = useContent();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  /*
   * 탭은 자기 영역 어디에 있어도 켜져 있어야 한다 — /history 나 /spots 에서도
   * 각각 '우도'·'지금 우도'가 켜진다. NavLink 의 기본 매칭으로는 안 되므로
   * nav 데이터의 match 목록으로 직접 판정한다.
   */
  const isActive = (paths: readonly string[]) =>
    paths.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(`${p}/`)));

  const linkClass = (active: boolean) =>
    [
      'rounded-lg px-2.5 py-1.5 t-meta font-medium transition-colors',
      active ? 'bg-brand-soft text-link' : 'text-ink-soft hover:text-link',
    ].join(' ');

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="text-lg font-extrabold tracking-tight text-link">{ui.brand.name}</span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-faint">
            {ui.brand.sub}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <Link key={item.path} to={item.path} className={linkClass(isActive(item.match))}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <LocaleSelect />
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink-soft lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? ui.nav.close : ui.nav.menu}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface px-4 py-2 lg:hidden">
          <ul className="grid grid-cols-2 gap-1">
            {nav.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={linkClass(isActive(item.match))}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
