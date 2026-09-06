import { useContent } from '../../i18n';

/*
 * 자료가 없을 때. 가짜 인물·작품·역사를 만들어 채우지 않는다 —
 * 비어 있다는 사실을 그대로 보여주는 것이 아카이브의 정직함이다.
 */
export default function EmptyArchiveState({ note }: { note?: string }) {
  const { archive } = useContent();
  return (
    <div className="rounded-lg border border-dashed border-line px-6 py-12 text-center">
      <p className="display text-lg text-ink">{archive.empty.title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-faint">
        {note ?? archive.empty.body}
      </p>
    </div>
  );
}
