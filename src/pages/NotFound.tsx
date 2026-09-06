import { Link } from 'react-router-dom';
import { useContent } from '../i18n';

export default function NotFound() {
  const { ui } = useContent();
  return (
    <div className="py-20 text-center">
      <p className="text-6xl" aria-hidden>
        🌊
      </p>
      <h1 className="mt-4 text-2xl font-bold text-ink">{ui.notFound.title}</h1>
      <p className="mt-2 text-ink-soft">{ui.notFound.body}</p>
      <Link to="/" className="btn-primary mt-6">
        {ui.notFound.home}
      </Link>
    </div>
  );
}
