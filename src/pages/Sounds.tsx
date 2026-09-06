import { useSearchParams } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveSection from '../components/archive/ArchiveSection';
import SoundCard from '../components/archive/SoundCard';
import EmptyArchiveState from '../components/archive/EmptyArchiveState';
import { useSoundList } from '../archive';

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
        <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center">
          <p className="caption">{archive.sound.mapPending}</p>
        </div>
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
          <EmptyArchiveState note="녹음을 시작하면 이 자리에 소리가 쌓입니다. 언제 어디서 녹음했는지, 그날 날씨가 어땠는지와 함께 남깁니다." />
        ) : (
          <div>
            {sounds.map((sound) => (
              <SoundCard key={sound.id} sound={sound} />
            ))}
          </div>
        )}
      </ArchiveSection>
    </>
  );
}
