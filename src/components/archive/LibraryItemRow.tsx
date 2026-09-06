import { useContent } from '../../i18n';
import type { LibraryItem } from '../../archive';
import ArchiveDate from './ArchiveDate';

/*
 * 서재 항목 — 서지정보와 소개까지만. 원문을 공개할 권리가 없으면 본문을 싣지 않는다.
 */
export default function LibraryItemRow({ item }: { item: LibraryItem }) {
  const { archive, ui } = useContent();
  return (
    <li className="rule py-6 first:border-t-0 first:pt-0">
      <p className="credit">{archive.labels.itemTypes[item.itemType]}</p>
      <h3 className="display mt-1 text-lg font-semibold text-ink">{item.title}</h3>
      <p className="caption mt-1">
        {[item.authors.join(', '), item.publisher].filter(Boolean).join(' · ')}
        {item.published.value && (
          <>
            {' · '}
            <ArchiveDate date={item.published} />
          </>
        )}
      </p>
      {item.summary && <p className="measure mt-2 text-sm leading-relaxed text-ink-soft">{item.summary}</p>}
      {item.holdingNote && <p className="caption mt-2">{item.holdingNote}</p>}
      {item.externalUrl && (
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-link hover:text-cta-strong"
        >
          {ui.actions.openLink} ↗
        </a>
      )}
    </li>
  );
}
