import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import FerryRouteMap from '../components/FerryRouteMap';

export default function Access() {
  const { access } = useContent();

  return (
    <>
      <SectionHeader title={access.title} subtitle={access.subtitle} level={1} />

      {/* 뱃길부터 — 어디서 어디로 가는지가 먼저다. 운항 상태·시간표는 '지금 우도'가 맡는다. */}
      <div className="mt-2">
        <SectionHeader title={access.routeMapTitle} />
        <FerryRouteMap />
      </div>

      <div className="mt-14">
        <SectionHeader title={access.stepsTitle} />
        <ol className="grid gap-4 sm:grid-cols-2">
          {access.steps.map((s) => (
            <li key={s.step} className="card">
              <span className="text-xs font-bold text-link">STEP {s.step}</span>
              <h3 className="mt-1 font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>


      <div className="mt-14">
        <SectionHeader title={access.transportTitle} />
        <div className="grid gap-4 sm:grid-cols-3">
          {access.transport.map((t) => (
            <article key={t.title} className="card">
              <div className="text-2xl" aria-hidden>
                {t.icon}
              </div>
              <h3 className="mt-2 font-bold text-ink">{t.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-caution/40 bg-caution/10 p-5">
          <h3 className="font-bold text-ink">{access.carPolicy.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{access.carPolicy.desc}</p>
        </div>
      </div>


    </>
  );
}
