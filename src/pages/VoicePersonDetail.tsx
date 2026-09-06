import { useParams } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveSection from '../components/archive/ArchiveSection';
import ArtworkFigure from '../components/archive/ArtworkFigure';
import VoiceQuote from '../components/archive/VoiceQuote';
import ArchiveDate from '../components/archive/ArchiveDate';
import EmptyArchiveState from '../components/archive/EmptyArchiveState';
import RecordNote from '../components/archive/RecordNote';
import ArchiveNotFound from './archive/ArchiveNotFound';
import { useArchive, useClipsByPerson, useSessionsByPerson, useVoicePerson } from '../archive';

export default function VoicePersonDetail() {
  const { slug } = useParams();
  const { archive } = useContent();
  const person = useVoicePerson(slug).data;
  const sessions = useSessionsByPerson(person?.id ?? null).data ?? [];
  const clips = useClipsByPerson(person?.id ?? null).data ?? [];
  const portrait = useArchive().getMedia(person?.portraitMediaId);

  if (!person) return <ArchiveNotFound />;

  return (
    <>
      <PageMeta title={person.displayName} description={person.summary} />

      <header className="measure">
        <p className="credit">
          {[person.village, person.occupations.join(' · ')].filter(Boolean).join(' · ')}
        </p>
        <h1 className="display mt-2 text-3xl font-bold text-ink">{person.displayName}</h1>
        {person.birth && (
          <p className="caption mt-1">
            <ArchiveDate date={person.birth} />
            {person.death && (
              <>
                {' — '}
                <ArchiveDate date={person.death} />
              </>
            )}
          </p>
        )}
        {person.anonymized && <p className="caption mt-1">{archive.voice.anonymous}</p>}
        {person.summary && <p className="mt-5 leading-relaxed text-ink-soft">{person.summary}</p>}
      </header>

      {portrait && (
        <div className="mt-8 max-w-md">
          <ArtworkFigure media={portrait} credit={portrait.rights.creditLine} />
        </div>
      )}

      {person.body && person.body.length > 0 && (
        <div className="measure mt-8 space-y-4">
          {person.body.map((p) => (
            <p key={p} className="prose-archive">
              {p}
            </p>
          ))}
        </div>
      )}

      <ArchiveSection title={archive.sections.clips.title}>
        {clips.length === 0 ? (
          <EmptyArchiveState />
        ) : (
          <div>
            {clips.map((clip) => (
              <VoiceQuote
                key={clip.id}
                clip={clip}
                personName={person.displayName}
                village={person.village}
              />
            ))}
          </div>
        )}
      </ArchiveSection>

      {sessions.length > 0 && (
        <ArchiveSection title={archive.sections.sessions.title}>
          {/*
            * 보존 기록의 관례: 인터뷰를 설명하는 대신 **분량과 공개 범위를 수치·문장으로**
            * 밝힌다. 공개 동의가 없는 자료는 애초에 이 목록에 오지 않는다(repository 가 거른다).
            */}
          <ul className="divide-y divide-line border-y border-line">
            {sessions.map((s) => (
              <li key={s.id} className="py-4">
                <p className="t-meta text-ink">
                  <ArchiveDate date={s.recordedOn} />
                  {s.location ? ` · ${s.location}` : ''}
                </p>
                <p className="caption mt-1">
                  {[
                    s.durationSec
                      ? archive.voice.extent.replace('{min}', String(Math.round(s.durationSec / 60)))
                      : null,
                    s.clipIds.length > 0 ? archive.voice.hasTranscript : null,
                    archive.voice.consentPublic,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                {s.themes.length > 0 && <p className="caption mt-0.5">{s.themes.join(' · ')}</p>}
              </li>
            ))}
          </ul>
        </ArchiveSection>
      )}

      <div className="measure">
        <RecordNote entity={person} />
      </div>
    </>
  );
}
