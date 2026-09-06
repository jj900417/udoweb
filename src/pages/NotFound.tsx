import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-6xl" aria-hidden>
        🌊
      </p>
      <h1 className="mt-4 text-2xl font-bold text-ink">여기는 아직 물이 안 빠졌습니다</h1>
      <p className="mt-2 text-ink-soft">찾는 페이지가 없습니다.</p>
      <Link to="/" className="btn-primary mt-6">
        홈으로
      </Link>
    </div>
  );
}
