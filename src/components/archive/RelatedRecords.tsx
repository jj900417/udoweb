import { Link } from 'react-router-dom';
import { entityPath, useRelated, type ArchiveEntity } from '../../archive';
import { useContent } from '../../i18n';

/*
 * 사진 ↔ 역사 ↔ 목소리를 잇는 자리.
 * 관련 자료가 없으면 **섹션 자체가 사라진다** — 빈 헤딩도, 가짜 추천도 만들지 않는다.
 */
export default function RelatedRecords({ entity }: { entity: ArchiveEntity }) {
  const { archive } = useContent();
  const { data } = useRelated(entity);
  const groups = data ?? [];
  if (groups.length === 0) return null;

  return (
    <section className="mt-12 rule pt-8">
      <h2 className="credit">{archive.sections.related.title}</h2>
      <div className="mt-4 space-y-5">
        {groups.map((group) => (
          <div key={group.kind}>
            <p className="text-xs font-semibold text-faint">{archive.labels.kinds[group.kind]}</p>
            <ul className="mt-1.5 space-y-1">
              {group.items.map((item) => (
                <li key={item.id}>
                  <Link
                    to={entityPath(item.kind, item.slug)}
                    className="text-sm text-ink-soft hover:text-link"
                  >
                    → {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
