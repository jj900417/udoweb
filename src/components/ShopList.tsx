import { useMemo, useState } from 'react';
import { udoApi } from '../api/udo';
import { useAsync } from '../api/useAsync';
import { useContent } from '../i18n';
import StateBlock from './StateBlock';

/* 가게 — 앱 서버 /shops(검수된 목록) + 업종 필터. 소개글은 외부 데이터: 렌더링만. */
export default function ShopList() {
  const { ui } = useContent();
  const { data, loading, error } = useAsync((s) => udoApi.shops(s));
  const [category, setCategory] = useState('');

  const items = data?.items ?? [];
  const categories = useMemo(
    () => Array.from(new Set(items.map((s) => s.category).filter(Boolean))).sort(),
    [items],
  );
  const shown = category ? items.filter((s) => s.category === category) : items;

  if (loading || error || items.length === 0)
    return <StateBlock loading={loading} error={error} empty={!loading && !error} />;

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={`chip ${category === '' ? 'border-brand text-brand' : ''}`}
          >
            {ui.actions.viewAll}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`chip ${category === c ? 'border-brand text-brand' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((shop) => (
          <article key={shop.id} className="card card-hover">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-ink">{shop.title}</h3>
              {shop.category && <span className="chip">{shop.category}</span>}
            </div>
            {shop.intro && (
              <p className="mt-1.5 whitespace-pre-line text-sm text-ink-soft">{shop.intro}</p>
            )}
            {shop.hours && (
              <p className="mt-2 text-xs text-faint">
                {ui.shops.hours} {shop.hours}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {shop.phone && (
                <a href={`tel:${shop.phone}`} className="chip hover:border-brand hover:text-brand">
                  ☎ {ui.actions.call}
                </a>
              )}
              {shop.kakao_url && (
                <a
                  href={shop.kakao_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip hover:border-brand hover:text-brand"
                >
                  {ui.actions.openMap} ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
