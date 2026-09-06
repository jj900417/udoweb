import { useContent } from '../../i18n';
import { usePlaceResolver, type Facet } from '../../archive';

/*
 * 브라우즈 칩 — 시대·주제·장소.
 *
 * 축의 값이 2개 미만이면 repository 가 빈 배열을 주므로 이 컴포넌트는 아무것도
 * 그리지 않는다. 즉 자료가 없을 때 "필터만 있고 결과는 없는" 화면이 생기지 않는다.
 * 각 칩에는 개수를 붙인다 — 눌러보기 전에 무엇이 얼마나 있는지 보이도록.
 */
export default function BrowseChips({
  facets,
  active,
  onSelect,
  kind,
}: {
  facets: readonly Facet[];
  active?: string;
  onSelect: (key: string | undefined) => void;
  kind: 'decades' | 'tags' | 'places';
}) {
  const { archive } = useContent();
  const resolvePlace = usePlaceResolver();
  if (facets.length === 0) return null;

  const label = (facet: Facet) =>
    kind === 'places'
      ? (resolvePlace(facet.key as `place-${string}`)?.name ?? facet.label)
      : facet.label;

  return (
    <div className="mb-6">
      <p className="credit mb-2">{archive.browse[kind]}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          aria-pressed={!active}
          className={`chip ${!active ? 'border-brand text-link' : ''}`}
        >
          {archive.browse.all}
        </button>
        {facets.map((facet) => (
          <button
            key={facet.key}
            type="button"
            onClick={() => onSelect(facet.key)}
            aria-pressed={active === facet.key}
            className={`chip ${active === facet.key ? 'border-brand text-link' : ''}`}
          >
            {label(facet)}
            <span className="ml-1.5 text-faint">{facet.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
