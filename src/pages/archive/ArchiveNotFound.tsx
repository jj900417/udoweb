import { Link } from 'react-router-dom';
import { useContent } from '../../i18n';
import PageMeta from '../../components/PageMeta';

/* 없는 slug — 아카이브 안에서의 404. 사이트 전체 404 와 톤을 나눈다. */
export default function ArchiveNotFound() {
  const { archive } = useContent();
  return (
    <div className="py-16">
      <PageMeta title={archive.empty.notFound} />
      <h1 className="display text-2xl font-bold text-ink">{archive.empty.notFound}</h1>
      <p className="measure mt-2 text-ink-soft">{archive.empty.notFoundBody}</p>
      <Link to="/archive" className="btn-ghost mt-6">
        {archive.empty.backToArchive}
      </Link>
    </div>
  );
}
