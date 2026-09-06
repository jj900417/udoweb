import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveSection from '../components/archive/ArchiveSection';
import VoicePersonCard from '../components/archive/VoicePersonCard';
import VoiceQuote from '../components/archive/VoiceQuote';
import EmptyArchiveState from '../components/archive/EmptyArchiveState';
import { useVoiceClipList, useVoicePeople } from '../archive';

/*
 * 우도의 목소리. 제주어 사전이 아니라 **사람들의 말과 기억**을 남기는 구술사 아카이브다.
 * 동의 범위가 확인된 자료만 공개된다(repository 가 강제, docs/oral-history-workflow.md).
 */
export default function Voices() {
  const { archive } = useContent();
  const people = useVoicePeople({ sort: 'title' }).data ?? [];
  const clips = useVoiceClipList({ limit: 5 }).data ?? [];

  return (
    <>
      <PageMeta title={archive.sections.voices.title} description={archive.sections.voices.desc} />

      <header className="measure">
        <p className="credit">{archive.sections.voices.sub}</p>
        <h1 className="display mt-2 text-3xl font-bold text-ink sm:text-4xl">
          {archive.sections.voices.title}
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          우도에서 살아온 분들의 목소리를 그대로 남깁니다. 말투와 억양, 그 말에 담긴 기억까지가
          기록입니다. 공개는 본인(또는 유족)의 동의 범위 안에서만 합니다.
        </p>
      </header>

      {clips.length > 0 && (
        <ArchiveSection title={archive.sections.clips.title}>
          <div>
            {clips.map((clip) => (
              <VoiceQuote key={clip.id} clip={clip} />
            ))}
          </div>
        </ArchiveSection>
      )}

      <ArchiveSection title="이야기해 주신 분들">
        {people.length === 0 ? (
          <EmptyArchiveState note="인터뷰와 동의 절차가 끝난 분부터 이 자리에 모십니다. 동의 없이는 이름도 목소리도 올리지 않습니다." />
        ) : (
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <li key={person.id}>
                <VoicePersonCard person={person} />
              </li>
            ))}
          </ul>
        )}
      </ArchiveSection>
    </>
  );
}
