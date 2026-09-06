import type { EightView } from '../data/spots';

/* 우도8경 카드. 사진이 생기면 여기에 <img> 를 추가한다(현재는 타이포 카드). */
export default function EightViewCard({ view, index }: { view: EightView; index: number }) {
  return (
    <article className="card card-hover">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold text-link">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="text-lg font-bold text-ink">{view.name}</h3>
        <span className="text-xs text-faint">{view.hanja}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-link">{view.meaning}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{view.desc}</p>
      <p className="mt-3 text-xs text-faint">언제 · {view.when}</p>
    </article>
  );
}
