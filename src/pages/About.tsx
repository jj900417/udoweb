import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';

export default function About() {
  const { about } = useContent();

  return (
    <>
      <SectionHeader title={about.title} subtitle={about.subtitle} level={1} />

      <p className="max-w-3xl text-lg leading-relaxed text-ink">{about.lead}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {about.facts.map((f) => (
          <div key={f.label} className="rounded-xl border border-line bg-surface-soft px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">{f.label}</p>
            <p className="mt-1 text-lg font-bold text-ink">{f.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-3xl space-y-4">
        {about.paragraphs.map((p) => (
          <p key={p} className="prose-body">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-14">
        <SectionHeader title={about.keywordsTitle} />
        <div className="grid gap-4 sm:grid-cols-2">
          {about.keywords.map((k) => (
            <article key={k.title} className="card">
              <div className="text-2xl" aria-hidden>
                {k.icon}
              </div>
              <h3 className="mt-2 font-bold text-ink">{k.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{k.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
