import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import FerryStatusCard from '../components/FerryStatusCard';
import TimetableCard from '../components/TimetableCard';
import CctvList from '../components/CctvList';

export default function Access() {
  const { access, ui } = useContent();

  return (
    <>
      <SectionHeader title={access.title} subtitle={access.subtitle} level={1} />

      <FerryStatusCard />

      <div className="mt-14">
        <SectionHeader title="순서" />
        <ol className="grid gap-4 sm:grid-cols-2">
          {access.steps.map((s) => (
            <li key={s.step} className="card">
              <span className="text-xs font-bold text-brand">STEP {s.step}</span>
              <h3 className="mt-1 font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14">
        <SectionHeader title={ui.timetable.title} />
        <TimetableCard />
      </div>

      <div className="mt-14">
        <SectionHeader title="섬 안에서 이동" />
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

      <div className="mt-14">
        <SectionHeader title="안전" />
        <ul className="space-y-2">
          {access.safety.map((s) => (
            <li key={s} className="flex gap-2 text-sm text-ink-soft">
              <span aria-hidden>·</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14">
        <SectionHeader title={ui.cctv.title} subtitle="지금 항구가 어떤지 직접 보기" />
        <CctvList />
      </div>
    </>
  );
}
