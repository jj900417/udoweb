import { useContent } from '../i18n';

/* API 로딩/실패/빈 상태를 한 곳에서 그린다 — 화면마다 다르게 만들지 않는다. */
export default function StateBlock({
  loading,
  error,
  empty,
}: {
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
}) {
  const { ui } = useContent();
  const text = loading
    ? ui.states.loading
    : error
      ? ui.states.error
      : empty
        ? ui.states.empty
        : null;
  if (!text) return null;
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface-soft px-4 py-8 text-center text-sm text-faint">
      {text}
    </div>
  );
}
