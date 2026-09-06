import { useContent } from '../../i18n';
import { useArchive, type SoundRecording } from '../../archive';
import ArchiveDate from './ArchiveDate';
import VoiceClipPlayer from './VoiceClipPlayer';

/*
 * 소리 한 점 — 무엇이 들리는지(종류), 언제 어디서 녹음했는지, 그날 날씨가 어땠는지.
 *
 * 날씨는 녹음 시점의 관측값을 그대로 보여준다. 지금 날씨를 불러와 채우지 않는다 —
 * 그러면 기록이 아니라 장식이 된다.
 */
export default function SoundCard({ sound }: { sound: SoundRecording }) {
  const { archive } = useContent();
  const audio = useArchive().getMedia(sound.audioMediaId);
  const w = sound.weather;

  const meta = [
    sound.season ? archive.sound.seasons[sound.season] : null,
    sound.timeOfDay ? archive.sound.times[sound.timeOfDay] : null,
    sound.durationSec ? `${Math.round(sound.durationSec / 60)}분` : null,
  ].filter(Boolean);

  return (
    <article className="rule py-8 first:border-t-0 first:pt-0">
      <p className="credit">{sound.kinds.map((k) => archive.sound.kinds[k]).join(' · ')}</p>
      <h3 className="display mt-1 t-section font-semibold text-ink">{sound.title}</h3>

      <p className="t-meta mt-2 text-faint">
        {archive.sound.recordedAt} <ArchiveDate date={sound.recordedAt} />
        {meta.length > 0 && ` · ${meta.join(' · ')}`}
      </p>

      {sound.summary && <p className="measure prose-archive mt-3">{sound.summary}</p>}

      <VoiceClipPlayer media={audio} fallbackDurationSec={sound.durationSec} />

      {w && (w.sky || w.tempC != null || w.windMs != null || w.waveM != null) && (
        <p className="caption mt-3">
          {archive.sound.weather} ·{' '}
          {[
            w.sky,
            w.tempC != null ? `${archive.sound.temp} ${w.tempC}℃` : null,
            w.windMs != null ? `${archive.sound.wind} ${w.windMs} m/s` : null,
            w.waveM != null ? `${archive.sound.wave} ${w.waveM} m` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
    </article>
  );
}
