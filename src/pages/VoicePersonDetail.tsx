import { useParams } from 'react-router-dom';
import { useContent } from '../i18n';
import PageMeta from '../components/PageMeta';
import ArchiveSection from '../components/archive/ArchiveSection';
import ArtworkFigure from '../components/archive/ArtworkFigure';
import VoiceQuote from '../components/archive/VoiceQuote';
import ArchiveDate from '../components/archive/ArchiveDate';
import EmptyArchiveState from '../components/archive/EmptyArchiveState';
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
            <p key={p} className="leading-relaxed text-ink-soft">
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
              <VoiceQuote key={clip.id} clip={clip} personName={person.displayName} />
            ))}
          </div>
        )}
      </ArchiveSection>

      {sessions.length > 0 && (
        <ArchiveSection title={archive.sections.sessions.title}>
          <ul className="space-y-2 text-sm text-ink-soft">
            {sessions.map((s) => (
              <li key={s.id}>
                <ArchiveDate date={s.recordedOn} />
                {s.location ? ` · ${s.location}` : ''}
                {s.themes.length > 0 ? ` · ${s.themes.join(' · ')}` : ''}
              </li>
            ))}
          </ul>
        </ArchiveSection>
      )}
    </>
  );
}
