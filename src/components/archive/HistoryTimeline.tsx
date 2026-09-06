import { Link } from 'react-router-dom';
import { entityPath, type HistoryEntry } from '../../archive';
import { useContent } from '../../i18n';
import ArchiveDate from './ArchiveDate';

/*
 * 연표. semantic 하게 <ol> 이고, 왼쪽에 세로 시간축을 그린다.
 * 모바일에서도 축이 무너지지 않도록 축은 고정 폭 grid 열로 잡는다(절대배치 아님).
 */
export default function HistoryTimeline({ entries }: { entries: readonly HistoryEntry[] }) {
  const { archive } = useContent();
  if (entries.length === 0) return null;

  return (
    <ol className="relative">
      {entries.map((entry) => (
        <li key={entry.id} className="grid grid-cols-[4.5rem_1fr] gap-x-3 sm:grid-cols-[8rem_1fr] sm:gap-x-6">
          {/* 시간축 눈금 */}
          <div className="py-4 text-right">
            <span className="caption font-semibold text-ink-soft">
              <ArchiveDate date={entry.when} />
            </span>
          </div>
          <div className="border-l border-line py-4 pl-4 sm:pl-6">
            <span
              className="absolute -ml-[1.32rem] mt-1.5 block h-2 w-2 rounded-full bg-brand sm:-ml-[1.82rem]"
              aria-hidden
            />
            <p className="credit">{archive.labels.categories[entry.category]}</p>
            <h3 className="display mt-1 text-lg font-semibold text-ink">
              <Link to={entityPath('history', entry.slug)} className="hover:text-link">
                {entry.title}
              </Link>
            </h3>
            {entry.summary && (
              <p className="mt-1.5 measure text-sm leading-relaxed text-ink-soft">{entry.summary}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
