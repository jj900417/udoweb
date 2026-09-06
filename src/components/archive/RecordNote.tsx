import { useContent } from '../../i18n';
import type { ArchiveEntity } from '../../archive';

/*
 * "이 기록에 대하여" — 모든 상세 페이지 아래에 붙는 정직한 각주.
 *
 * 아카이브는 완결된 사실의 집합이 아니라 확인된 만큼의 기록이다. 그 사실을
 * 화면에서 밝히고 정정 통로를 열어 두는 것이, 빈 칸을 그럴듯하게 채우는 것보다 낫다.
 * (코드의 VERIFY: 주석과 같은 태도.)
 */
export default function RecordNote({ entity }: { entity: ArchiveEntity }) {
  const { archive } = useContent();
  const sourceCount = entity.sourceIds.length;

  return (
    <details className="mt-12 rule pt-4">
      <summary className="credit cursor-pointer list-none hover:text-link">
        {archive.recordNote.title}
      </summary>
      <p className="measure mt-3 t-caption text-ink-soft">{archive.recordNote.body}</p>
      <p className="caption mt-2">
        {archive.recordNote.updated} {entity.updatedAt}
        {sourceCount > 0 && ` · ${archive.recordNote.sourceCount.replace('{n}', String(sourceCount))}`}
      </p>
    </details>
  );
}
