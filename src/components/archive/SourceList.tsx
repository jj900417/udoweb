import { useContent } from '../../i18n';
import type { Source } from '../../archive';

/*
 * 출처. 역사 기록에서 가장 중요한 부분이다 — 확인하지 않은 쪽수를 만들어 쓰지 않는다.
 * citation 문자열은 데이터에 적힌 그대로 보여준다(우리가 조립하지 않는다).
 */
export default function SourceList({ sources }: { sources: readonly Source[] }) {
  const { archive } = useContent();
  if (sources.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="credit">{archive.sections.sources.title}</h2>
      <ol className="mt-3 space-y-2 text-sm text-ink-soft">
        {sources.map((s) => (
          <li key={s.id} className="leading-relaxed">
            {s.citation}
            {s.url && (
              <>
                {' '}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:text-brand-strong"
                >
                  ↗
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
