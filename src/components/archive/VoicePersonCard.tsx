import { Link } from 'react-router-dom';
import { entityPath, mediaUrl, useArchive, type VoicePerson } from '../../archive';
import { useContent } from '../../i18n';

export default function VoicePersonCard({ person }: { person: VoicePerson }) {
  const { archive } = useContent();
  const portrait = useArchive().getMedia(person.portraitMediaId);
  const src = mediaUrl(portrait, 'thumb');

  return (
    <article>
      <Link to={entityPath('voicePerson', person.slug)} className="group block">
        {src && portrait && (
          <img src={src} alt={portrait.alt} loading="lazy" className="mb-3 h-auto w-full object-contain" />
        )}
        <h3 className="display text-lg font-bold text-ink group-hover:text-brand">
          {person.displayName}
        </h3>
        <p className="caption mt-1">
          {[person.village, person.occupations.join(' · ')].filter(Boolean).join(' · ')}
          {person.anonymized ? ` · ${archive.voice.anonymous}` : ''}
        </p>
        {person.summary && (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{person.summary}</p>
        )}
      </Link>
    </article>
  );
}
