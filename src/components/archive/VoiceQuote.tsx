import { useContent } from '../../i18n';
import { useArchive, type VoiceClip } from '../../archive';
import ArchiveDate from './ArchiveDate';
import VoiceClipPlayer from './VoiceClipPlayer';

/*
 * 발췌 한 토막.
 *
 * 순서가 중요하다: **인용문이 먼저, 사진이 아니라 말이 주인공**이다.
 * 그다음 재생 → 표준어 → 이 말에 담긴 이야기 → 전사(접힘).
 * 전사 전문을 펼쳐 두면 사람들이 읽고 지나간다 — 먼저 듣게 하고, 읽고 싶은 사람만 편다.
 */
export default function VoiceQuote({
  clip,
  personName,
  village,
  recordedOn,
}: {
  clip: VoiceClip;
  personName?: string;
  village?: string;
  recordedOn?: Parameters<typeof ArchiveDate>[0]['date'];
}) {
  const { archive } = useContent();
  const audio = useArchive().getMedia(clip.audioMediaId);
  const hasStandard = Boolean(clip.standardKorean && clip.standardKorean.length > 0);

  return (
    <article className="rule py-10 first:border-t-0 first:pt-0">
      <h3 className="sr-only">{clip.title}</h3>

      <blockquote className="measure">
        {clip.dialectText.map((line) => (
          <p key={line} className="display text-2xl leading-[1.6] text-ink sm:text-3xl">
            “{line}”
          </p>
        ))}
      </blockquote>

      {/* 누가·어디서·언제 — 목록에서도 감추지 않는다(아카이브는 방송이 아니다). */}
      {(personName || village || recordedOn) && (
        <p className="t-meta mt-4 text-faint">
          {[personName, village].filter(Boolean).join(' · ')}
          {recordedOn && (
            <>
              {personName || village ? ' · ' : ''}
              {archive.voice.recordedOn} <ArchiveDate date={recordedOn} />
            </>
          )}
        </p>
      )}

      <VoiceClipPlayer
        media={audio}
        fallbackDurationSec={
          clip.startSec !== undefined && clip.endSec !== undefined ? clip.endSec - clip.startSec : undefined
        }
      />

      {hasStandard && (
        <div className="mt-7">
          <p className="credit">{archive.voice.standard}</p>
          {clip.standardKorean?.map((line) => (
            <p key={line} className="measure prose-archive mt-1">
              {line}
            </p>
          ))}
        </div>
      )}

      {clip.context && clip.context.length > 0 && (
        <div className="mt-6">
          <p className="credit">{archive.voice.context}</p>
          {clip.context.map((line) => (
            <p key={line} className="measure prose-archive mt-1">
              {line}
            </p>
          ))}
        </div>
      )}

      {/* 전사 전문 — 기본 접힘 + 정확도 고지. */}
      {clip.body && clip.body.length > 0 && (
        <details className="mt-6">
          <summary className="credit cursor-pointer list-none hover:text-link">
            {archive.voice.transcript}
          </summary>
          <p className="caption mt-2">{archive.voice.transcriptNote}</p>
          <div className="measure mt-3 space-y-3">
            {clip.body.map((line) => (
              <p key={line} className="prose-archive">
                {line}
              </p>
            ))}
          </div>
        </details>
      )}

      <div className="mt-6 border-l-2 border-line pl-4">
        <p className="t-meta font-semibold text-ink">{archive.voice.repeatTitle}</p>
        <p className="caption mt-1">{archive.voice.repeatBody}</p>
      </div>
    </article>
  );
}
