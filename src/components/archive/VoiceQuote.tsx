import { useContent } from '../../i18n';
import { useArchive, type VoiceClip } from '../../archive';
import VoiceClipPlayer from './VoiceClipPlayer';

/*
 * 발췌 한 토막 — 제주어 원문이 먼저 크게, 그 아래 표준어와 편집자 주.
 * 표준어 옮김이 없으면 그 자리를 만들지 않는다(임의로 옮기지 않는다).
 */
export default function VoiceQuote({ clip, personName }: { clip: VoiceClip; personName?: string }) {
  const { archive } = useContent();
  const audio = useArchive().getMedia(clip.audioMediaId);

  return (
    <article className="rule py-8 first:border-t-0 first:pt-0">
      {personName && <p className="credit">{personName}</p>}
      <h3 className="sr-only">{clip.title}</h3>

      <blockquote className="measure mt-2">
        {clip.dialectText.map((line) => (
          <p key={line} className="display text-xl leading-relaxed text-ink sm:text-2xl">
            “{line}”
          </p>
        ))}
      </blockquote>

      <VoiceClipPlayer
        media={audio}
        fallbackDurationSec={
          clip.startSec !== undefined && clip.endSec !== undefined ? clip.endSec - clip.startSec : undefined
        }
      />

      {clip.standardKorean && clip.standardKorean.length > 0 && (
        <div className="mt-6">
          <p className="credit">{archive.voice.standard}</p>
          {clip.standardKorean.map((line) => (
            <p key={line} className="measure mt-1 text-sm leading-relaxed text-ink-soft">
              {line}
            </p>
          ))}
        </div>
      )}

      {clip.context && clip.context.length > 0 && (
        <div className="mt-5">
          <p className="credit">{archive.voice.context}</p>
          {clip.context.map((line) => (
            <p key={line} className="measure mt-1 text-sm leading-relaxed text-ink-soft">
              {line}
            </p>
          ))}
        </div>
      )}

      <div className="mt-5 border-l-2 border-line pl-4">
        <p className="text-sm font-semibold text-ink">{archive.voice.repeatTitle}</p>
        <p className="caption mt-1">{archive.voice.repeatBody}</p>
      </div>
    </article>
  );
}
