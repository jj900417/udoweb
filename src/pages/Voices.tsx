import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveSection from '../components/archive/ArchiveSection';
import VoicePersonCard from '../components/archive/VoicePersonCard';
import VoiceQuote from '../components/archive/VoiceQuote';
import EmptyArchiveState from '../components/archive/EmptyArchiveState';
import { useArchive, useVoiceClipList, useVoicePeople } from '../archive';

/*
 * 우도의 목소리. 제주어 사전이 아니라 **사람들의 말과 기억**을 남기는 구술사 아카이브다.
 * 동의 범위가 확인된 자료만 공개된다(repository 가 강제, docs/oral-history-workflow.md).
 */
export default function Voices() {
  const { archive } = useContent();
  const repo = useArchive();
  const people = useVoicePeople({ sort: 'title' }).data ?? [];
  const clips = useVoiceClipList({ limit: 5 }).data ?? [];

  /* 클립에 붙일 화자·마을·기록일 — 목록에서도 감추지 않는다(아카이브는 방송이 아니다). */
  const speakerOf = (personIds: readonly string[]) => {
    const person = personIds.map((id) => repo.getEntityById(id)).find((e) => e?.kind === 'voicePerson');
    return person && person.kind === 'voicePerson' ? person : null;
  };

  return (
    <>
      <PageMeta title={archive.sections.voices.title} description={archive.sections.voices.desc} />

      <header className="measure">
        <p className="credit">{archive.sections.voices.sub}</p>
        <h1 className="display t-section mt-2 font-bold text-ink">
          {archive.sections.voices.title}
        </h1>
        <p className="prose-archive mt-4">{archive.sections.voices.lead}</p>
      </header>

      {clips.length > 0 && (
        <ArchiveSection title={archive.sections.clips.title}>
          <div>
            {clips.map((clip) => {
              const person = speakerOf(clip.personIds);
              const session = repo.getEntityById(clip.sessionId);
              return (
                <VoiceQuote
                  key={clip.id}
                  clip={clip}
                  personName={person?.displayName}
                  village={person?.village}
                  recordedOn={session && session.kind === 'session' ? session.recordedOn : undefined}
                />
              );
            })}
          </div>
        </ArchiveSection>
      )}

      <ArchiveSection title={archive.sections.people.title} sub={archive.sections.people.sub}>
        {people.length === 0 ? (
          <EmptyArchiveState note={archive.empty.peopleNote} />
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
