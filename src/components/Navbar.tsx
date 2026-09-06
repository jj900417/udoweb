import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useContent } from '../i18n';
import LocaleSelect from './LocaleSelect';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { nav, ui } = useContent();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors',
      isActive ? 'bg-brand-soft text-link' : 'text-ink-soft hover:text-link',
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
            /* end 를 쓰지 않는다 — /archive/artists 에서도 '기록'이 활성 표시되어야 한다. */
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
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
                <NavLink
                  to={item.path}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
