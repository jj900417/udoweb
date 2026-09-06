import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';

export default function Tips() {
  const { tips } = useContent();

  return (
    <>
      <SectionHeader title={tips.title} subtitle={tips.subtitle} level={1} />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {tips.faq.map((item) => (
            <details key={item.q} className="card">
              <summary className="cursor-pointer list-none font-semibold text-ink">
                {item.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>

        <aside className="card h-fit">
          <h2 className="font-bold text-ink">떠나기 전 확인</h2>
          <ul className="mt-3 space-y-2">
            {tips.checklist.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-ink-soft">
                <span aria-hidden>☐</span>
                {c}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
