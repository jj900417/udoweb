import { useContent } from '../i18n';

export default function Footer() {
  const { site, ui } = useContent();
  return (
    <footer className="mt-20 border-t border-line bg-surface-soft">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
        <p className="font-semibold text-ink">
          {site.name} · {site.tagline}
        </p>
        <p className="mt-1 text-faint">{ui.footer.madeBy}</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-faint">
              {ui.footer.dataSource}
            </h3>
            <ul className="mt-2 space-y-1 text-ink-soft">
              <li>운항 판정·시간표·가게·축제 — {site.app.name}</li>
              <li>기상 특보·예보 — 기상청 · 물때 — 국립해양조사원</li>
              <li>CCTV — 제주특별자치도 제주시</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-faint">Links</h3>
            <ul className="mt-2 space-y-1">
              {site.officialLinks.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:text-brand-strong"
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-xs text-faint">
          {ui.footer.verifyNote} · {site.domain}
        </p>
      </div>
    </footer>
  );
}
