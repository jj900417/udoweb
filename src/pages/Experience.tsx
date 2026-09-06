import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import FestivalList from '../components/FestivalList';

export default function Experience() {
  const { experiences } = useContent();

  return (
    <>
      <SectionHeader title={experiences.title} subtitle={experiences.subtitle} level={1} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {experiences.items.map((item) => (
          <article key={item.title} className="card card-hover">
            <div className="text-2xl" aria-hidden>
              {item.icon}
            </div>
            <h3 className="mt-2 font-bold text-ink">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
            <p className="mt-3 text-xs text-faint">{item.season}</p>
          </article>
        ))}
      </div>

      <div className="mt-14">
        <SectionHeader title="축제·행사" subtitle="지금 열리거나 곧 열리는 것" />
        <FestivalList />
      </div>

      <div className="mt-14 rounded-2xl border border-line bg-sand/60 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">섬에서 지켜주세요</h2>
        <ul className="mt-4 space-y-2">
          {experiences.etiquette.map((e) => (
            <li key={e} className="flex gap-2 text-sm text-ink-soft">
              <span aria-hidden>·</span>
              {e}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
