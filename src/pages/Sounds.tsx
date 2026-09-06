import { useSearchParams } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveSection from '../components/archive/ArchiveSection';
import SoundCard from '../components/archive/SoundCard';
import EmptyArchiveState from '../components/archive/EmptyArchiveState';
import UdoMap, { type MapPin } from '../components/archive/UdoMap';
import { useSoundList } from '../archive';
import { useMemo, useState } from 'react';

/*
 * 우도의 소리 — 사운드맵.
 *
 * 지도는 자리만 잡아 두고(사장님이 만든 자체 벡터 지도를 붙일 예정), 지금은 목록과
 * 재생이 먼저 동작한다. 녹음이 0건이어도 화면이 깨지지 않아야 한다.
 */
export default function Sounds() {
  const { archive } = useContent();
  const [params, setParams] = useSearchParams();
  const kind = params.get('kind') ?? undefined;
  const sounds = useSoundList({ kind }).data ?? [];
  const all = useSoundList().data ?? [];

  /* 실제로 녹음이 있는 종류만 필터로 보여준다(빈 필터를 만들지 않는다). */
  const kinds = [...new Set(all.flatMap((s) => s.kinds))];

  /* 지도 핀 — 좌표가 있는 녹음만. 좌표가 없으면 목록에는 남고 지도에서만 빠진다. */
  const pins: MapPin[] = useMemo(
    () =>
      sounds
        .filter((s) => s.lat != null && s.lon != null)
        .map((s) => ({
          id: s.id,
          lat: s.lat as number,
          lon: s.lon as number,
          label: s.title,
          sub: s.kinds.map((k) => archive.sound.kinds[k]).join(' · '),
        })),
    [sounds, archive.sound.kinds],
  );
  const [activeId, setActiveId] = useState<string | undefined>();

  const select = (value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value) next.set('kind', value);
    else next.delete('kind');
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageMeta title={archive.sound.title} description={archive.sound.lead} />

      <header className="measure">
        <p className="credit">{archive.sound.sub}</p>
        <h1 className="display t-section mt-2 font-bold text-ink">{archive.sound.title}</h1>
        <p className="prose-archive mt-4">{archive.sound.lead}</p>
      </header>

      <ArchiveSection title={archive.sound.mapTitle} desc={archive.sound.mapLead}>
        <UdoMap
          pins={pins}
          activeId={activeId}
          onSelect={(id) => {
            setActiveId(id);
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />
        {pins.length === 0 && <p className="caption mt-3">{archive.sound.mapPending}</p>}
      </ArchiveSection>

      <ArchiveSection title={archive.sound.title}>
        {kinds.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => select(undefined)}
              aria-pressed={!kind}
              className={`chip ${!kind ? 'border-brand text-link' : ''}`}
            >
              {archive.browse.all}
            </button>
            {kinds.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => select(k)}
                aria-pressed={kind === k}
                className={`chip ${kind === k ? 'border-brand text-link' : ''}`}
              >
                {archive.sound.kinds[k]}
              </button>
            ))}
          </div>
        )}

        {sounds.length === 0 ? (
          <EmptyArchiveState note="녹음을 시작하면 이 자리에 소리가 쌓여요. 언제 어디서 녹음했는지, 그날 날씨가 어땠는지와 함께 남겨요." />
        ) : (
          <div>
            {sounds.map((sound) => (
              <div key={sound.id} id={sound.id}>
                <SoundCard sound={sound} highlighted={sound.id === activeId} />
              </div>
            ))}
          </div>
        )}
      </ArchiveSection>
    </>
  );
}
