import { useContent } from '../../i18n';
import type { ArchiveDate as ArchiveDateValue } from '../../archive';

/*
 * 날짜 표기 — **정밀도를 지어내지 않는다.**
 * display 가 있으면 그대로, 없으면 정밀도에 맞는 만큼만 보여준다.
 * ('1930' + decade → "1930년대", '1932' + year → "1932년")
 */
export function formatArchiveDate(
  date: ArchiveDateValue | undefined,
  labels: { exact: string; year: string; decade: string; approximate: string; unknown: string },
): string {
  if (!date) return '';
  if (date.display) return date.display;
  if (date.precision === 'unknown' || !date.value) return labels.unknown;
  const [y, m, d] = date.value.split('-');
  switch (date.precision) {
    case 'decade':
      return `${y}${labels.decade}`;
    case 'year':
      return `${y}${labels.year}`;
    case 'approximate':
      return `${y}${labels.year} ${labels.approximate}`;
    default:
      return [y && `${y}년`, m && `${Number(m)}월`, d && `${Number(d)}일`].filter(Boolean).join(' ');
  }
}

export default function ArchiveDate({ date }: { date: ArchiveDateValue | undefined }) {
  const { archive } = useContent();
  const text = formatArchiveDate(date, archive.labels.precision);
  if (!text) return null;
  return <time dateTime={date?.value || undefined}>{text}</time>;
}
