import { Link } from 'react-router-dom';

import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import SectionHeader from '../components/SectionHeader';
import InstallButton from '../components/InstallButton';

/*
 * 우도 나우 소개.
 *
 * 운항 상태 카드는 두지 않는다 — '지금 우도'가 그 일을 한다(같은 정보를 두 번 보여주지 않는다).
 * 문안은 junghwanyoon.dev/udo-now 와 같은 것을 쓴다(src/data/appPage.ts).
 */
export default function AppPage() {
  const { site, appPage, support } = useContent();

  return (
    <>
      <PageMeta title={site.app.name} description={appPage.subtitle} />

      <SectionHeader title={site.app.name} subtitle={appPage.subtitle} level={1} />

      <p className="measure prose-archive">{appPage.intro}</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <InstallButton />
        {/* 앱을 쓰다 막히면 여기서 바로 갈 수 있게 — 스토어 심사자도 같은 길로 들어온다. */}
        <Link className="btn-ghost" to="/support">
          {support.title}
        </Link>
      </div>

      <div className="mt-14">
        <SectionHeader title={appPage.featuresTitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appPage.features.map((f) => (
            <article key={f.title} className="card">
              <div className="text-2xl" aria-hidden>
                {f.icon}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-ink">{f.title}</h3>
                {f.soon && <span className="chip">{appPage.soonLabel}</span>}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <SectionHeader title={appPage.whyTitle} />
        <div className="measure space-y-5">
          {appPage.why.map((p) => (
            <p key={p} className="prose-archive">
              {p}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
